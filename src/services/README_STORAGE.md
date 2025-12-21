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
| `@financeiro:config` | Global | Bootstrap / Login | Singleton |
| `@financeiro:transacoes` | Global | Base de cálculo e projeção | Full Snapshot |
| `@financeiro:transacoes:Y-M` | Mensal | Tela de Saldos | Particionado (Cache) |
| `@financeiro:dias_conciliados` | Global | Conciliação | Lista simples |
| `@financeiro:tags` | Global | UI / Cadastro | Lista simples |

> 📌 **Nota:** O particionamento mensal existe exclusivamente para performance de UI, garantindo que a planilha de saldos carregue instantaneamente.

---

## 4. Entidades Persistidas

### 4.1 Configuração (`Config`)
Representa o estado inicial e as preferências de domínio do usuário.
```typescript
export interface Config {
  saldoInicial: number;
  dataInicial: string;
  gastosEstimados: GastoVariavel[];
  diasParaDivisao: 28 | 30 | 31;
  gastoDiarioPadrao: number;
  percentualEconomia: number;
  onboardingCompleto: boolean;
}

```

> 📌 **Nota:** `gastoDiarioPadrao` é um valor derivado de `gastosEstimados / diasParaDivisao`. Ele é persistido apenas por performance e consistência de projeção, não devendo ser editado diretamente.

* **Garantia de Existência:** O service assegura que este objeto sempre exista. Se ausente, injeta um padrão e redireciona para o Onboarding.

### 4.2 Tipos de Categoria e Recorrência

```typescript
export type Categoria =
  | "entradas" | "saidas" | "diarios" 
  | "cartao" | "economia" | "todas";

export type Recorrencia =
  | "unica" | "diaria" | "semanal" | "quinzenal" 
  | "cada21dias" | "cada28dias" | "mensal";
  ````

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
  dataFimRecorrencia?: string; // ✨ NOVO: Encerra a recorrência nesta data (YYYY-MM-DD)
  edicoesEspecificas?: {      // Overrides pontuais por data
    [data: string]: Partial<
      Omit<Transacao, "id" | "recorrencia" | "datasExcluidas" | "edicoesEspecificas">
    >;
  };
}
```

---

## 5. Escrita Redundante por Mês (Otimização)
### `saveTransacoesPorMes`

Para manter a performance da tela de **Saldos** sem varrer anos de histórico em cada renderização:

- **Agrupamento:** O array global é processado e segmentado por chaves `YYYY-MM`.
- **Persistência Particionada:** Cada grupo é salvo na chave correspondente  
  `@financeiro:transacoes:Y-M`.
- **Sincronização:** As escritas são sequenciais (`await`) para garantir que o cache mensal
  nunca diverja do índice global.

---

## 6. Lógica de Leitura de Dados

### 6.1 Leitura Mensal (Cache Strategy)

A função `getTransacoesMes(year, month)` segue uma estratégia de **auto-reparo**:

- **Cache Hit:** Retorno imediato se a chave mensal existir.
- **Cache Miss:** Filtra o índice global em tempo de execução, retorna os dados
  e persiste automaticamente o cache mensal para consultas futuras.

---

### 6.2 Leitura por Data com Recorrência

A função `getTransacoesPorDataComRecorrencia(data)` resolve a recorrência
**exclusivamente em tempo de leitura**.

> ⚠️ **Importante:**  
> Esta função **não cria nem persiste ocorrências físicas**.  
> Todas as instâncias são resolvidas dinamicamente (*on-the-fly*).

**Fluxo de resolução:**

1. Avaliação Temporal:
   - Verifica se a data consultada é >= data inicial
   - Verifica se NÃO ultrapassa `dataFimRecorrencia` (quando definida)

2. **Supressão:** Ignora datas presentes em `datasExcluidas`.
3. **Override:** Aplica `edicoesEspecificas[data]` via *shallow merge* sobre a transação mestre.


---

## 7. Diferença Crítica de Operações
| Operação | Método | Impacto |
| :--- | :--- | :--- |
| **Alterar Série** | `updateTransacao` | Afeta a raiz e todas as ocorrências. |
| **Editar Ocorrência** | `editarOcorrenciaRecorrente` | Cria exceção. Afeta apenas a data específica. |
| **Excluir Ocorrência** | `excluirOcorrenciaRecorrente` | Adiciona à blacklist. A série permanece. |
| **✨ Excluir A Partir De** | `excluirRecorrenciaAPartirDe` | Define data fim. Encerra série mas preserva histórico. |
| **Excluir Série** | `deleteTransacao` | Remoção total. Destrói tudo. |

---

## 8. Riscos e Mitigações

* **Concorrência:** O `AsyncStorage` é assíncrono por natureza. **Mitigação:** Todas as escritas são centralizadas e executadas de forma sequencial via `await`.
* **Limites de Memória (Android):** Arquivos JSON gigantes podem causar lentidão. **Mitigação:** Particionamento mensal para garantir que a UI principal manipule apenas pequenos fragmentos de dados.
* **Integridade de Referência:** A lógica de edições pontuais depende do `id`. **Mitigação:** IDs são gerados na criação e tratados como imutáveis.

---

## 9. Status e Roadmap

- [x] Particionamento mensal e redundância de escrita.
- [x] Motor de recorrência virtual com suporte a exclusão/edição pontual.
- [x] CRUD de Tags e Conciliação de dias.
- [ ] **Roadmap:** Implementar função de `rebuildIndices()` para reconstruir caches mensais a partir do global.
- [ ] **Roadmap:** Exportação de dados em JSON para backup externo.