```markdown
# 📘 Especificação Técnica: Motor de Persistência (Storage Service)

## 1. Visão Geral
O **Storage Service** é o núcleo do domínio do Panorama$. Ele atua como a fonte única da verdade (Single Source of Truth) para todos os dados financeiros do aplicativo, centralizando:
* Configurações globais e estado de onboarding.
* Transações (únicas e recorrências virtuais).
* Logs de exclusões e edições pontuais em séries.
* Estado de conciliação de dias e gerenciamento de tags.

> 📌 **Regra de Ouro:** Nenhuma tela ou hook acessa o `AsyncStorage` diretamente. Toda leitura e escrita passa obrigatoriamente por este módulo para garantir a integridade dos dados.

---

## 2. Estratégia de Persistência (Baixo Nível)
O Panorama$ utiliza um modelo de **Persistência por Snapshot Sequencial**. Como o `AsyncStorage` não é um banco relacional, o sistema opera da seguinte forma:

1. **Leitura:** Carrega o estado atual completo para a memória (RAM).
2. **Mutação:** Aplica alterações de forma determinística no objeto JavaScript.
3. **Escrita:** Persiste novamente o JSON completo.
4. **Consistência:** Garantida via execução sequencial (`await`), evitando condições de corrida (race conditions) básicas.

---

## 3. Hierarquia de Chaves e Estratégia de Leitura
| Chave | Escopo | Uso Principal | Estratégia |
| :--- | :--- | :--- | :--- |
| `@panorama$:config` | Global | Bootstrap / Login | Singleton |
| `@panorama$:transacoes` | Global | Base de cálculo e projeção | Full Snapshot |
| `@panorama$:transacoes:Y-M` | Mensal | Tela de Saldos | Particionado (Cache) |
| `@panorama$:dias_conciliados` | Global | Conciliação | Lista simples |
| `@panorama$:tags` | Global | UI / Cadastro | Lista simples |

> 📌 **Nota:** O particionamento mensal existe exclusivamente para performance de UI, garantindo que a planilha de saldos carregue instantaneamente.

---

## 4. Entidades Persistidas

### 4.1 Configuração (`Config`)
Representa o estado inicial e as preferências de domínio do usuário.
```typescript
export interface Config {
  saldoInicial: number;
  dataInicial: string;        // Formato YYYY-MM-DD
  gastosVariaveis: GastoVariavel[]; // Lista de gastos mensais fixos
  diasParaDivisao: 28 | 30 | 31;    // Base de cálculo do gasto diário
  gastoDiarioPadrao: number;         // Calculado automaticamente
  percentualEconomia: number;
  onboardingCompleto: boolean;
}

export interface GastoVariavel {
  id: string;
  titulo: string;      // Ex: "Aluguel"
  descricao: string;   // Ex: "Vence dia 10" (opcional)
  valor: number;       // Valor mensal
}
```

**Comportamento do `gastoDiarioPadrao`:**
- É calculado automaticamente: `totalGastosVariaveis / diasParaDivisao`
- Exemplo: R$ 3.000 de gastos ÷ 30 dias = R$ 100/dia
- **Editável via:** MenuScreen → PrevisaoGastoDiarioScreen → `updateConfig()`
- **Uso na Tela de Saldos:**
  - Dias passados sem gasto real → `diarios = 0`
  - Dia atual sem gasto real → `diarios = gastoDiarioPadrao` (estimativa)
  - Dias futuros sem gasto real → `diarios = gastoDiarioPadrao` (projeção)
  - Qualquer dia COM gasto real → `diarios = soma dos gastos reais`

> 📌 **Nota:** O gasto diário padrão é uma **estimativa/limite sugerido**, não um custo automático. Ele só impacta o saldo quando não há gasto real cadastrado no dia (hoje ou futuro).

* **Garantia de Existência:** O service assegura que este objeto sempre exista. Se ausente, injeta um padrão e redireciona para o Onboarding.

### 4.2 Tipos de Categoria e Recorrência

```typescript
export type Categoria =
  | "entradas" | "saidas" | "diarios" 
  | "cartao" | "economia" | "todas";

export type Recorrencia =
  | "unica" | "diaria" | "semanal" | "quinzenal" 
  | "cada21dias" | "cada28dias" | "mensal";
```

> 📌 **Nota:** A categoria `"todas"` é um utilitário exclusivo de UI/Filtro e **não deve ser persistida** em registros individuais de `Transacao`.

### 4.3 Transação (`Transacao`)
A entidade mestre que suporta a lógica de série temporal virtual.

```typescript
export interface Transacao {
  id: string;                 // Identificador imutável da série
  valor: number;              // Valor nominal base
  data: string;               // YYYY-MM-DD (Início da recorrência)
  categoria: Categoria;
  tag?: string;
  descricao: string;
  recorrencia: Recorrencia;

  // CONTROLE DE RECORRÊNCIA VIRTUAL
  datasExcluidas?: string[];  // Blacklist de datas da série
  dataFimRecorrencia?: string; // Encerra a recorrência nesta data (YYYY-MM-DD)
  edicoesEspecificas?: {      // Overrides pontuais por data
    [data: string]: Partial
      Omit<Transacao, "id" | "recorrencia" | "datasExcluidas" | "edicoesEspecificas">
    >;
  };
}
```

---

## 5. Operações de Escrita

### 5.1 Operações de Configuração

#### `setConfig(config: Config): Promise<void>`
Substitui a configuração completa.
```typescript
await setConfig({
  saldoInicial: 5000,
  dataInicial: '2024-12-01',
  gastosVariaveis: [...],
  diasParaDivisao: 30,
  gastoDiarioPadrao: 100,
  percentualEconomia: 10,
  onboardingCompleto: true,
});
```

#### `updateConfig(novaConfig: Partial<Config>): Promise<void>` ← ✨ NOVO
Atualiza parcialmente a configuração (merge inteligente).
```typescript
// Atualiza apenas gastosVariaveis e gastoDiarioPadrao
await updateConfig({
  gastosVariaveis: [...novosGastos],
  diasParaDivisao: 28,
  gastoDiarioPadrao: 110.50,
});
```

**Uso principal:**
- PrevisaoGastoDiarioScreen para editar gastos pós-onboarding
- Evita reescrever campos não relacionados
- Mantém integridade dos outros campos do Config

**Implementação:**
```typescript
export async function updateConfig(novaConfig: Partial<Config>): Promise<void> {
  try {
    const configAtual = await getConfig();
    const configAtualizada = { ...configAtual, ...novaConfig };
    await setConfig(configAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar config:', error);
    throw error;
  }
}
```

---

### 5.2 Operações de Reset

#### `resetStorage(): Promise<void>` ← ✨ NOVO
Remove TODAS as chaves do Panorama$ do AsyncStorage.

**⚠️ ATENÇÃO: OPERAÇÃO IRREVERSÍVEL**

Remove:
- Todas as transações
- Todas as tags
- Todas as configurações
- Gastos variáveis
- Dias conciliados
- Cache mensal de transações

```typescript
await resetStorage();
// AsyncStorage agora está limpo
// App retorna para ConfiguracaoInicialScreen
```

**Implementação:**
```typescript
export async function resetStorage(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const panoramaKeys = allKeys.filter((key) => key.startsWith('@panorama$:'));
    await AsyncStorage.multiRemove(panoramaKeys);
  } catch (error) {
    console.error('Erro ao resetar storage:', error);
    throw error;
  }
}
```

**Uso principal:**
- MenuScreen → Opção "Reiniciar Panoramas"
- Desenvolvimento e testes
- Recuperação de estado inconsistente

**Fluxo completo:**
```
MenuScreen → handleReiniciarPanoramas()
    ↓
Alert.alert() com confirmação
    ↓
await resetStorage()
    ↓
navigation.dispatch(CommonActions.reset({
  index: 0,
  routes: [{ name: 'ConfiguracaoInicial' }],
}))
    ↓
Usuário volta ao onboarding sem histórico de navegação
```

---

### 5.3 Escrita Redundante por Mês (Otimização)

#### `saveTransacoesPorMes(transacoes: Transacao[]): Promise<void>`

Para manter a performance da tela de **Saldos** sem varrer anos de histórico em cada renderização:

- **Agrupamento:** O array global é processado e segmentado por chaves `YYYY-MM`.
- **Persistência Particionada:** Cada grupo é salvo na chave correspondente  
  `@panorama$:transacoes:Y-M`.
- **Sincronização:** As escritas são sequenciais (`await`) para garantir que o cache mensal
  nunca diverja do índice global.

---

## 6. Lógica de Leitura de Dados

### 6.1 Leitura de Configuração

#### `getConfig(): Promise<Config>`
Retorna a configuração atual ou cria uma padrão se não existir.

```typescript
const config = await getConfig();
console.log(config.gastoDiarioPadrao); // 100
console.log(config.diasParaDivisao);   // 30
```

#### `isOnboardingCompleto(): Promise<boolean>`
Verifica rapidamente se o usuário já completou o onboarding.

```typescript
if (await isOnboardingCompleto()) {
  navigation.navigate('Login');
} else {
  navigation.navigate('ConfiguracaoInicial');
}
```

---

### 6.2 Leitura Mensal (Cache Strategy)

#### `getTransacoesMes(year: number, month: number): Promise<Transacao[]>`

Segue uma estratégia de **auto-reparo**:

- **Cache Hit:** Retorno imediato se a chave mensal existir.
- **Cache Miss:** Filtra o índice global em tempo de execução, retorna os dados
  e persiste automaticamente o cache mensal para consultas futuras.

```typescript
// Busca transações de Janeiro/2025
const transacoes = await getTransacoesMes(2025, 0); // month é 0-indexed
```

---

### 6.3 Leitura por Data com Recorrência

#### `getTransacoesPorDataComRecorrencia(data: string): Promise<Transacao[]>`

Resolve a recorrência **exclusivamente em tempo de leitura**.

> ⚠️ **Importante:**  
> Esta função **não cria nem persiste ocorrências físicas**.  
> Todas as instâncias são resolvidas dinamicamente (*on-the-fly*).

**Fluxo de resolução:**

1. **Avaliação Temporal:**
   - Verifica se a data consultada é >= data inicial
   - Verifica se NÃO ultrapassa `dataFimRecorrencia` (quando definida)

2. **Supressão:** Ignora datas presentes em `datasExcluidas`.

3. **Override:** Aplica `edicoesEspecificas[data]` via *shallow merge* sobre a transação mestre.

```typescript
// Retorna transações aplicáveis em 2024-12-23
// Inclui: únicas do dia + recorrências ativas + overrides
const transacoes = await getTransacoesPorDataComRecorrencia('2024-12-23');
```

---

## 7. Diferença Crítica de Operações
| Operação | Método | Impacto |
| :--- | :--- | :--- |
| **Alterar Série** | `updateTransacao` | Afeta a raiz e todas as ocorrências. |
| **Editar Ocorrência** | `editarOcorrenciaRecorrente` | Cria exceção. Afeta apenas a data específica. |
| **Excluir Ocorrência** | `excluirOcorrenciaRecorrente` | Adiciona à blacklist. A série permanece. |
| **Excluir A Partir De** | `excluirRecorrenciaAPartirDe` | Define data fim. Encerra série mas preserva histórico. |
| **Excluir Série** | `deleteTransacao` | Remoção total. Destrói tudo. |
| **Atualizar Config Parcial** | `updateConfig` ← ✨ NOVO | Merge inteligente. Mantém outros campos. |
| **Reset Completo** | `resetStorage` ← ✨ NOVO | Remove TUDO. Volta ao onboarding. |

---

## 7.1 Lógica do Gasto Diário (Categoria "diarios")

A categoria "diarios" possui comportamento especial na tela de Saldos, combinando gastos reais com estimativa configurada.

### Regra de Resolução (por dia)
```typescript
function resolverGastoDiario(data: string, transacoes: Transacao[], config: Config): number {
  const gastoDiarioReal = soma(transacoes onde categoria === 'diarios' e data === data);
  
  // 1. Dias antes da dataInicial configurada
  if (data < config.dataInicial) {
    return 0;
  }
  
  // 2. Tem gasto real cadastrado? Sempre usa o real
  if (gastoDiarioReal > 0) {
    return gastoDiarioReal;
  }
  
  // 3. Sem gasto real: depende do período
  const hoje = formatDate(new Date());
  
  if (data < hoje) {
    return 0; // Passou sem gastar, fica zero
  } else {
    return config.gastoDiarioPadrao; // Hoje ou futuro = estimativa
  }
}
```

### Tabela de Comportamento

| Período | Tem Gasto Real? | Resultado |
|---------|-----------------|-----------|
| Antes de `dataInicial` | Qualquer | `0` |
| Passado | ✅ Sim | Soma dos gastos reais |
| Passado | ❌ Não | `0` |
| Hoje | ✅ Sim | Soma dos gastos reais |
| Hoje | ❌ Não | `gastoDiarioPadrao` |
| Futuro | ✅ Sim | Soma dos gastos reais |
| Futuro | ❌ Não | `gastoDiarioPadrao` |

### Exemplo Prático

**Configuração:**
- `gastoDiarioPadrao = R$ 100,00`
- `dataInicial = 2024-12-01`

**Cenário:**
```
Dia 18 (passado): Sem gasto cadastrado → diarios = R$ 0,00
Dia 19 (passado): Gastou R$ 150 (2 refeições) → diarios = R$ 150,00
Dia 20 (passado): Sem gasto cadastrado → diarios = R$ 0,00
Dia 21 (HOJE): Sem gasto cadastrado → diarios = R$ 100,00 (estimativa)
Dia 22 (futuro): Sem gasto cadastrado → diarios = R$ 100,00 (projeção)
```

**Impacto no Saldo:**
- Dias 18 e 20: Saldo não é afetado (passou sem gastar)
- Dia 19: Saldo desconta R$ 150 (gasto real)
- Dias 21 e 22: Saldo desconta R$ 100 (estimativa/projeção)

**Edição Pós-Onboarding:**
```
MenuScreen → PrevisaoGastoDiario
    ↓
Usuário adiciona "Netflix: R$ 45"
    ↓
Total: R$ 3.000 + R$ 45 = R$ 3.045
    ↓
Novo gastoDiarioPadrao: R$ 3.045 / 30 = R$ 101,50
    ↓
await updateConfig({ 
  gastosVariaveis: [...], 
  gastoDiarioPadrao: 101.50 
})
    ↓
Próxima visita ao SaldosScreen/PanoramasScreen
    ↓
Dias futuros sem gasto usam R$ 101,50
Dias passados sem gasto continuam R$ 0,00
```

> 📌 **Importante:** Esta lógica é implementada em `utils/calculoSaldo.ts` na função `calcularTotaisDia()`, que recebe o `config` como parâmetro para acessar `gastoDiarioPadrao` e `dataInicial`.

---

## 8. Fluxos de Integração

### 8.1 Fluxo de Edição de Gastos Variáveis ← ✨ NOVO

```
PrevisaoGastoDiarioScreen monta
    ↓
const config = await getConfig()
    ↓
setGastosVariaveis(config.gastosVariaveis)
setDiasParaDivisao(config.diasParaDivisao)
    ↓
Usuário adiciona/remove gastos
    ↓
const novoGastoDiario = Σ(gastos) / dias
    ↓
await updateConfig({
  gastosVariaveis: [...],
  diasParaDivisao: 28,
  gastoDiarioPadrao: novoGastoDiario
})
    ↓
Config persistido no AsyncStorage
    ↓
Telas SaldosScreen/PanoramasScreen
usam getConfig() no próximo mount
    ↓
Nova projeção aplicada automaticamente
```

### 8.2 Fluxo de Reset Completo ← ✨ NOVO

```
MenuScreen → "Reiniciar Panoramas"
    ↓
Alert.alert(
  '⚠️ Ação Irreversível',
  'Apagará: transações, tags, config...',
  [Cancelar, Confirmar]
)
    ↓
await resetStorage()
    ↓
AsyncStorage.getAllKeys()
    ↓
Filter('@panorama$:*')
    ↓
AsyncStorage.multiRemove([...keys])
    ↓
navigation.dispatch(CommonActions.reset({
  index: 0,
  routes: [{ name: 'ConfiguracaoInicial' }]
}))
    ↓
App reinicia do zero
Sem histórico de navegação
```

---

## 9. Riscos e Mitigações

* **Concorrência:** O `AsyncStorage` é assíncrono por natureza. **Mitigação:** Todas as escritas são centralizadas e executadas de forma sequencial via `await`.
* **Limites de Memória (Android):** Arquivos JSON gigantes podem causar lentidão. **Mitigação:** Particionamento mensal para garantir que a UI principal manipule apenas pequenos fragmentos de dados.
* **Integridade de Referência:** A lógica de edições pontuais depende do `id`. **Mitigação:** IDs são gerados na criação e tratados como imutáveis.
* **Reset Acidental:** `resetStorage()` é destrutivo. **Mitigação:** Sempre exigir confirmação via Alert com texto detalhado antes de executar.
* **Merge Incorreto:** `updateConfig()` usa spread operator. **Mitigação:** Sempre passar apenas campos que devem ser atualizados, nunca passar `undefined` ou `null` para campos críticos.

---

## 10. Tabela de Operações Disponíveis

### Configuração
| Função | Tipo | Descrição |
|--------|------|-----------|
| `getConfig()` | Leitura | Retorna config atual ou padrão |
| `setConfig(config)` | Escrita | Substitui config completa |
| `updateConfig(partial)` | Escrita | Atualiza campos específicos ← ✨ NOVO |
| `isOnboardingCompleto()` | Leitura | Verifica flag de onboarding |

### Transações
| Função | Tipo | Descrição |
|--------|------|-----------|
| `getTransacoes()` | Leitura | Retorna todas as transações |
| `getTransacoesMes(y, m)` | Leitura | Cache mensal otimizado |
| `getTransacoesPorData(data)` | Leitura | Filtra por data exata |
| `getTransacoesPorDataComRecorrencia(data)` | Leitura | Resolve recorrências on-the-fly |
| `addTransacao(t)` | Escrita | Adiciona nova transação |
| `updateTransacao(id, partial)` | Escrita | Atualiza série completa |
| `deleteTransacao(id)` | Escrita | Remove série permanentemente |
| `excluirOcorrenciaRecorrente(id, data)` | Escrita | Blacklist de data específica |
| `excluirRecorrenciaAPartirDe(id, data)` | Escrita | Define dataFimRecorrencia |
| `editarOcorrenciaRecorrente(id, data, dados)` | Escrita | Override pontual |

### Conciliação e Tags
| Função | Tipo | Descrição |
|--------|------|-----------|
| `getDiasConciliados()` | Leitura | Lista de dias conciliados |
| `toggleDiaConciliado(data)` | Escrita | Adiciona/remove da lista |
| `isDiaConciliado(data)` | Leitura | Verifica se dia está conciliado |
| `getTags()` | Leitura | Lista de tags disponíveis |
| `addTag(tag)` | Escrita | Adiciona nova tag |
| `deleteTag(tag)` | Escrita | Remove tag |

### Sistema ← ✨ NOVO
| Função | Tipo | Descrição |
|--------|------|-----------|
| `resetStorage()` | Escrita | Remove TODAS as chaves do app ⚠️ |

---

## 11. Status e Roadmap

- [x] Particionamento mensal e redundância de escrita.
- [x] Motor de recorrência virtual com suporte a exclusão/edição pontual.
- [x] Exclusão de recorrências "desta data em diante" com `dataFimRecorrencia`.
- [x] CRUD de Tags e Conciliação de dias.
- [x] Sistema de gastos variáveis com cálculo automático de gasto diário padrão.
- [x] Lógica inteligente de gasto diário (real vs estimado) baseada em período temporal.
- [x] **updateConfig()** para edição parcial de configurações ← ✅ IMPLEMENTADO
- [x] **resetStorage()** para reset completo do aplicativo ← ✅ IMPLEMENTADO
- [x] Tela de edição de gastos variáveis pós-onboarding ← ✅ IMPLEMENTADO
- [ ] **Roadmap:** Implementar função de `rebuildIndices()` para reconstruir caches mensais a partir do global.
- [ ] **Roadmap:** Exportação de dados em JSON para backup externo.
- [ ] **Roadmap:** Validação de integridade de dados (detectar inconsistências entre cache e global).
- [ ] **Roadmap:** Compressão de histórico antigo (arquivar transações de anos anteriores).

---

**Última atualização:** 23/12/2024  
**Versão:** 2.1.0  
**Status:** ✅ updateConfig() e resetStorage() Implementados
```
