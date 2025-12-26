# 📦 Storage Service README - ATUALIZADO

---

## `src/services/README.md`

```markdown
# 📘 Especificação Técnica: Motor de Persistência (Storage Service)

## 1. Visão Geral
O **Storage Service** é o núcleo do domínio do Panorama$. Ele atua como a fonte única da verdade (Single Source of Truth) para todos os dados financeiros do aplicativo, centralizando:
* Configurações globais e estado de onboarding.
* Transações (únicas e recorrências virtuais).
* Logs de exclusões e edições pontuais em séries.
* Estado de conciliação de dias e gerenciamento de tags.
* **Tags organizadas por categoria** ← ✨ NOVO

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
| `@panorama$:tags` | Global | **Tags por categoria** | Objeto estruturado ← ✨ ATUALIZADO |

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
  percentualEconomia: number;        // Meta de economia (0-100%)
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

**Comportamento do `percentualEconomia`:**
- Armazena meta de economia mensal (0% a 100%)
- Exemplo: 15% = usuário quer economizar 15% das entradas
- **Editável via:** MenuScreen → MetaEconomiaScreen → `updateConfig()`
- **Uso futuro:** TotaisScreen exibirá progresso mensal (Meta vs Real)
- **Cálculo da meta em R$:** `(mediaEntradas * percentualEconomia) / 100`

> 📌 **Nota:** O gasto diário padrão é uma **estimativa/limite sugerido**, não um custo automático. Ele só impacta o saldo quando não há gasto real cadastrado no dia (hoje ou futuro).

* **Garantia de Existência:** O service assegura que este objeto sempre exista. Se ausente, injeta um padrão e redireciona para o Onboarding.

---

### 4.2 Tags por Categoria ← ✨ NOVA ESTRUTURA

```typescript
export interface TagsPorCategoria {
  entradas: string[];
  saidas: string[];
  diarios: string[];
  cartao: string[];
  economia: string[];
}

// Exemplo de estrutura persistida:
{
  entradas: ["Salário", "Freelance", "Investimentos"],
  saidas: ["Supermercado", "Farmácia", "Combustível"],
  diarios: ["Almoço", "Transporte"],
  cartao: ["Netflix", "Spotify"],
  economia: ["Reserva", "Aposentadoria"]
}
```

**Características:**
- ✅ Tags organizadas por categoria (não há tags globais)
- ✅ Permite mesmo nome em categorias diferentes
- ✅ Máximo 20 tags por categoria
- ✅ Máximo 20 caracteres por tag
- ✅ Validação de duplicatas dentro da mesma categoria
- ✅ Migração automática: tags antigas (formato `string[]`) são removidas

**Migração de Formato Antigo:**
```typescript
// Formato ANTIGO (v2.2.0 e anteriores)
tags: ["Alimentação", "Transporte", "Lazer", "Saúde", "Educação"]

// Formato NOVO (v2.3.0+)
tags: {
  entradas: [],
  saidas: [],
  diarios: [],
  cartao: [],
  economia: []
}
```

> ⚠️ **ATENÇÃO:** Na primeira execução da v2.3.0, todas as tags antigas serão **removidas**. Não há tentativa de categorização automática (decisão de design do usuário).

---

### 4.3 Tipos de Categoria e Recorrência

```typescript
export type Categoria =
  | "entradas" | "saidas" | "diarios" 
  | "cartao" | "economia";

export type Recorrencia =
  | "unica" | "diaria" | "semanal" | "quinzenal" 
  | "cada21dias" | "cada28dias" | "mensal";
```

> 📌 **Nota:** A categoria `"todas"` foi removida. Tags agora são sempre vinculadas a uma categoria específica.

---

### 4.4 Transação (`Transacao`)
A entidade mestre que suporta a lógica de série temporal virtual.

```typescript
export interface Transacao {
  id: string;                 // Identificador imutável da série
  valor: number;              // Valor nominal base
  data: string;               // YYYY-MM-DD (Início da recorrência)
  categoria: Categoria;
  tag?: string;               // Nome da tag (deve existir em tags[categoria])
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

> 📌 **Nota sobre Tags:** O campo `tag` armazena apenas o **nome** da tag (string). A validação de existência é feita em tempo de cadastro através do `CadastroScreen`, que carrega apenas tags da categoria selecionada via `getTagsCategoria()`.

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
  percentualEconomia: 15, // Meta de 15%
  onboardingCompleto: true,
});
```

#### `updateConfig(novaConfig: Partial<Config>): Promise<void>`
Atualiza parcialmente a configuração (merge inteligente).
```typescript
// Exemplo 1: Atualiza gastos variáveis
await updateConfig({
  gastosVariaveis: [...novosGastos],
  diasParaDivisao: 28,
  gastoDiarioPadrao: 110.50,
});

// Exemplo 2: Atualiza apenas meta de economia
await updateConfig({
  percentualEconomia: 20, // Muda meta para 20%
});
```

**Casos de uso:**
- PrevisaoGastoDiarioScreen: Edita `gastosVariaveis`, `diasParaDivisao`, `gastoDiarioPadrao`
- MetaEconomiaScreen: Edita `percentualEconomia`
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

#### `resetStorage(): Promise<void>`
Remove TODAS as chaves do Panorama$ do AsyncStorage.

**⚠️ ATENÇÃO: OPERAÇÃO IRREVERSÍVEL**

Remove:
- Todas as transações
- Todas as tags (estrutura por categoria incluída) ← ✨ ATUALIZADO
- Todas as configurações
- Gastos variáveis
- Meta de economia
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
Alert.alert() com confirmação detalhada
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

### 5.3 Operações de Tags ← ✨ NOVO

#### `getTags(): Promise<TagsPorCategoria>`
Retorna todas as tags organizadas por categoria.

```typescript
const tags = await getTags();
console.log(tags.saidas);  // ["Supermercado", "Farmácia", ...]
console.log(tags.entradas); // ["Salário", "Freelance", ...]
```

**Migração automática:**
- Se não existir → Cria estrutura vazia padrão
- Se formato antigo (`string[]`) → Remove e cria estrutura vazia
- Se formato correto → Retorna dados

---

#### `setTags(tags: TagsPorCategoria): Promise<void>`
Substitui completamente a estrutura de tags.

```typescript
await setTags({
  entradas: ["Salário", "Freelance"],
  saidas: ["Supermercado"],
  diarios: [],
  cartao: [],
  economia: []
});
```

> ⚠️ **Uso Interno:** Esta função é usada internamente pelas operações de CRUD. Raramente chamada diretamente por telas.

---

#### `getTagsCategoria(categoria: Categoria): Promise<string[]>`
Retorna apenas as tags de uma categoria específica.

```typescript
const tagsSaidas = await getTagsCategoria("saidas");
// ["Supermercado", "Farmácia", "Combustível"]
```

**Uso principal:**
- CadastroScreen: Filtra tags quando categoria muda
- TagsScreen: Exibe tags no accordion

---

#### `addTag(categoria: Categoria, nomeTag: string): Promise<{ success: boolean; error?: string }>`
Adiciona uma nova tag a uma categoria específica.

```typescript
const resultado = await addTag("saidas", "Padaria");

if (resultado.success) {
  console.log("Tag adicionada com sucesso!");
} else {
  console.error(resultado.error); // "Tag já existe nesta categoria"
}
```

**Validações aplicadas:**
- ❌ Nome vazio
- ❌ Duplicata na mesma categoria
- ❌ Limite de 20 tags por categoria
- ❌ Limite de 20 caracteres
- ✅ Trim automático

**Retornos possíveis:**
```typescript
{ success: true }
{ success: false, error: "Nome da tag não pode ser vazio" }
{ success: false, error: "Tag já existe nesta categoria" }
{ success: false, error: "Limite de 20 tags por categoria atingido" }
{ success: false, error: "Nome deve ter no máximo 20 caracteres" }
```

---

#### `editTag(categoria: Categoria, nomeAntigo: string, nomeNovo: string): Promise<{ success: boolean; error?: string; transacoesAtualizadas?: number }>`
Edita o nome de uma tag e atualiza automaticamente todas as transações que a usam.

```typescript
const resultado = await editTag("saidas", "Supermercado", "Supermercado Zona Sul");

if (resultado.success) {
  console.log(`${resultado.transacoesAtualizadas} transações atualizadas!`);
}
```

**Validações aplicadas:**
- ❌ Nome vazio
- ❌ Nome excede 20 caracteres
- ❌ Tag antiga não existe
- ❌ Novo nome já existe (duplicata)

**Comportamento:**
1. Valida novo nome
2. Atualiza nome da tag no array de tags
3. Busca TODAS as transações
4. Atualiza campo `tag` nas transações da categoria correspondente
5. Persiste transações atualizadas
6. Retorna contador de transações afetadas

**Retornos possíveis:**
```typescript
{ success: true, transacoesAtualizadas: 15 }
{ success: false, error: "Tag não encontrada" }
{ success: false, error: "Já existe uma tag com este nome nesta categoria" }
```

> 📌 **Importante:** Esta operação é **atômica**. Se falhar, nenhuma alteração é persistida.

---

#### `deleteTag(categoria: Categoria, nomeTag: string): Promise<{ success: boolean; error?: string }>`
Remove uma tag de uma categoria.

```typescript
const resultado = await deleteTag("saidas", "Farmácia");

if (resultado.success) {
  console.log("Tag removida!");
}
```

**Comportamento:**
- Remove tag do array de tags
- NÃO remove transações que usam a tag
- Transações afetadas ficam com `tag: undefined`

**Retornos possíveis:**
```typescript
{ success: true }
{ success: false, error: "Tag não encontrada" }
```

---

### 5.4 Escrita Redundante por Mês (Otimização)

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
console.log(config.gastoDiarioPadrao);   // 100
console.log(config.diasParaDivisao);     // 30
console.log(config.percentualEconomia);  // 15
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
| **Atualizar Config Parcial** | `updateConfig` | Merge inteligente. Mantém outros campos. |
| **Reset Completo** | `resetStorage` | Remove TUDO. Volta ao onboarding. |
| **Adicionar Tag** | `addTag` | Validações + persistência. |
| **Editar Tag** | `editTag` | Atualiza tag + todas as transações que a usam. ← ✨ NOVO |
| **Remover Tag** | `deleteTag` | Remove tag. Transações ficam sem tag. |

---

## 8. Fluxos de Integração

### 8.1 Fluxo de Edição de Gastos Variáveis

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

### 8.2 Fluxo de Definição de Meta de Economia

```
MetaEconomiaScreen monta
    ↓
const config = await getConfig()
const transacoes = await getTransacoes()
    ↓
calcularMediaMensalEntradas(transacoes)
    ↓
Se média === 0 → Abre modal de estimativa
Se média > 0 → Exibe total de entradas
    ↓
Usuário ajusta % via slider ou inputs
    ↓
await updateConfig({
  percentualEconomia: X
})
    ↓
Config persistido no AsyncStorage
    ↓
Retorna para MenuScreen
    ↓
(Futuro) TotaisScreen usa percentualEconomia
para exibir progresso mensal
```

### 8.3 Fluxo de Reset Completo

```
MenuScreen → "Reiniciar Panoramas"
    ↓
Alert.alert(
  '⚠️ Ação Irreversível',
  'Apagará: transações, tags, config, meta de economia...',
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

### 8.4 Fluxo de Gerenciamento de Tags ← ✨ NOVO

```
TagsScreen monta
    ↓
const tags = await getTags()
    ↓
Exibe accordion por categoria
    ↓
[ADICIONAR TAG]
Usuário clica "Adicionar tag" em uma categoria
    ↓
Modal abre com input vazio
    ↓
Usuário digita "Supermercado"
    ↓
await addTag("saidas", "Supermercado")
    ↓
Validações executadas
    ↓
Se sucesso → Tag aparece na lista
Se erro → Alert com mensagem
    ↓
[EDITAR TAG]
Usuário clica no ícone de editar
    ↓
Modal abre com nome atual
    ↓
Usuário altera para "Supermercado XYZ"
    ↓
Alert de confirmação: "X transações serão atualizadas"
    ↓
await editTag("saidas", "Supermercado", "Supermercado XYZ")
    ↓
Sistema atualiza:
  1. Nome da tag
  2. Todas as transações que usam a tag
    ↓
Alert de sucesso: "15 transação(ões) atualizadas"
    ↓
[REMOVER TAG]
Usuário clica no ícone de remover
    ↓
Alert de confirmação: "Transações não serão removidas"
    ↓
await deleteTag("saidas", "Farmácia")
    ↓
Tag removida da lista
Transações permanecem (com tag = undefined)
```

### 8.5 Fluxo de Seleção de Tags no Cadastro ← ✨ NOVO

```
CadastroScreen monta
    ↓
Usuário seleciona categoria "saidas"
    ↓
useEffect detecta mudança de categoria
    ↓
const tags = await getTagsCategoria("saidas")
    ↓
setTagsDisponiveis(tags)
    ↓
Se tagSelecionada não existe em tags → limpa
    ↓
ScrollView exibe apenas tags de "saidas"
    ↓
Usuário troca para "entradas"
    ↓
useEffect detecta mudança
    ↓
const tags = await getTagsCategoria("entradas")
    ↓
setTagsDisponiveis(tags)
    ↓
ScrollView atualiza para tags de "entradas"
    ↓
Tag anterior é limpa (não existe em entradas)
```

---

## 9. Riscos e Mitigações

* **Concorrência:** O `AsyncStorage` é assíncrono por natureza. **Mitigação:** Todas as escritas são centralizadas e executadas de forma sequencial via `await`.
* **Limites de Memória (Android):** Arquivos JSON gigantes podem causar lentidão. **Mitigação:** Particionamento mensal para garantir que a UI principal manipule apenas pequenos fragmentos de dados.
* **Integridade de Referência:** A lógica de edições pontuais depende do `id`. **Mitigação:** IDs são gerados na criação e tratados como imutáveis.
* **Reset Acidental:** `resetStorage()` é destrutivo. **Mitigação:** Sempre exigir confirmação via Alert com texto detalhado antes de executar.
* **Merge Incorreto:** `updateConfig()` usa spread operator. **Mitigação:** Sempre passar apenas campos que devem ser atualizados, nunca passar `undefined` ou `null` para campos críticos.
* **Tags Órfãs:** Transações podem referenciar tags que não existem mais. **Mitigação:** Interface exibe "Tag não encontrada" ou campo vazio. Edição de tag atualiza automaticamente todas as transações. ← ✨ NOVO
* **Duplicação de Tags:** Nome igual em categorias diferentes é permitido. **Mitigação:** Validação garante que não há duplicatas DENTRO da mesma categoria. ← ✨ NOVO
* **Migração de Tags:** Formato antigo é incompatível. **Mitigação:** Sistema detecta e limpa automaticamente tags antigas na primeira execução da v2.3.0. ← ✨ NOVO

---

## 10. Tabela de Operações Disponíveis

### Configuração
| Função | Tipo | Descrição |
|--------|------|-----------|
| `getConfig()` | Leitura | Retorna config atual ou padrão |
| `setConfig(config)` | Escrita | Substitui config completa |
| `updateConfig(partial)` | Escrita | Atualiza campos específicos |
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

### Conciliação
| Função | Tipo | Descrição |
|--------|------|-----------|
| `getDiasConciliados()` | Leitura | Lista de dias conciliados |
| `toggleDiaConciliado(data)` | Escrita | Adiciona/remove da lista |
| `isDiaConciliado(data)` | Leitura | Verifica se dia está conciliado |

### Tags ← ✨ SEÇÃO ATUALIZADA
| Função | Tipo | Descrição |
|--------|------|-----------|
| `getTags()` | Leitura | Retorna estrutura completa por categoria |
| `setTags(tags)` | Escrita | Substitui estrutura completa ⚠️ |
| `getTagsCategoria(categoria)` | Leitura | Retorna apenas tags de uma categoria |
| `addTag(categoria, nome)` | Escrita | Adiciona tag com validações |
| `editTag(cat,nomeAnt, nomeNov)` | Escrita | Edita tag + atualiza transações |
| `deleteTag(categoria, nome)` | Escrita | Remove tag (não afeta transações) |

### Sistema
| Função | Tipo | Descrição |
|--------|------|-----------|
| `resetStorage()` | Escrita | Remove TODAS as chaves do app ⚠️ |

---

## 11. Status e Roadmap

- [x] Particionamento mensal e redundância de escrita.
- [x] Motor de recorrência virtual com suporte a exclusão/edição pontual.
- [x] Exclusão de recorrências "desta data em diante" com `dataFimRecorrencia`.
- [x] CRUD de Tags básico (formato antigo).
- [x] Conciliação de dias.
- [x] Sistema de gastos variáveis com cálculo automático de gasto diário padrão.
- [x] Lógica inteligente de gasto diário (real vs estimado) baseada em período temporal.
- [x] `updateConfig()` para edição parcial de configurações.
- [x] `resetStorage()` para reset completo do aplicativo.
- [x] Tela de edição de gastos variáveis pós-onboarding.
- [x] Sistema de meta de economia com `percentualEconomia`.
- [x] **Tags organizadas por categoria com validações robustas** ← ✅ v2.3.0
- [x] **Migração automática de tags antigas** ← ✅ v2.3.0
- [x] **Edição de tags com atualização automática de transações** ← ✅ v2.3.0
- [ ] **Roadmap:** Implementar função de `rebuildIndices()` para reconstruir caches mensais a partir do global.
- [ ] **Roadmap:** Exportação de dados em JSON para backup externo.
- [ ] **Roadmap:** Validação de integridade de dados (detectar inconsistências entre cache e global).
- [ ] **Roadmap:** Compressão de histórico antigo (arquivar transações de anos anteriores).
- [ ] **Roadmap:** Analytics de uso de tags (quantas transações por tag).
- [ ] **Roadmap:** Sugestões inteligentes de tags baseadas em descrição de transação.

---

**Última atualização:** 25/12/2024  
**Versão:** 1.0.0  
**Status:** ✅ Sistema de Tags por Categoria Implementado
```