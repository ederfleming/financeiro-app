```markdown
# 📊 TotaisScreen - Análise Financeira Mensal

## 🎯 Visão Geral

A **TotaisScreen** é a tela de análise financeira do Panorama$, oferecendo uma visão completa da saúde financeira do mês através de métricas calculadas automaticamente e agrupamento de gastos por tags.

---

## 📋 Estrutura da Tela

### **Header**
- Navegação mensal (< Mês/Ano >)
- Botão "Ir para hoje" (calendário)
- Botão voltar (ícone de menu reutilizado)

### **Seção 1: Cálculos do mês**

#### **1. Performance**
```
Performance
[↓] - [↑] - [🛒] - [💰] - [💳]

R$ 3.220,49
Sobrou dinheiro
```

**Cálculo:** `Entradas - (Saídas + Diários + Cartão + Economia)`

**Status:**
- `performance > 0` → "Sobrou dinheiro" (verde)
- `performance < 0` → "Faltou dinheiro" (vermelho)
- `performance === 0` → "Zero a zero" (cinza)

---

#### **2. Economizado (Meta de Economia)**
```
Economizado
[💰] [✓]

R$ 1.470,00    Meta: R$ 1.470,00

[████████████████████] 100%

Parabéns! Você alcançou sua meta! 🎉
```

**Componentes:**
- Valor economizado (totais.economia)
- Meta em R$ calculada: `(entradas * percentualEconomia) / 100`
- Barra de progresso: `(economia / meta) * 100` (máximo 100%)
- Frase motivacional baseada no percentual

**Frases Motivacionais (5 faixas):**
| Percentual | Frase |
|------------|-------|
| 0% | "Todo começo é importante! Comece a economizar hoje" |
| 1-20% | "Você deu o primeiro passo! Continue economizando" |
| 21-50% | "Você está no caminho certo! Siga em frente" |
| 51-80% | "Ótimo progresso! Você está quase lá" |
| 81-99% | "Incrível! Falta pouco para alcançar sua meta" |
| 100%+ | "Parabéns! Você alcançou sua meta! 🎉" |

---

#### **3. Custo de Vida**
```
Custo de vida
[↑] + [🛒] + [💳]

R$ 6.579,51
Dentro da renda
```

**Cálculo:** `Saídas + Diários + Cartão`

**Status:**
- `custo <= 80% das entradas` → "Dentro da renda" (verde)
- `custo <= 100% das entradas` → "Fora da renda" (amarelo)
- `custo > 100% das entradas` → "Muito fora da renda" (vermelho)

---

#### **4. Diário Médio**
```
Diário médio

[🛒] / 20            R$ 45,50
                    Sugerido: R$ 66,67

[████████░░░░░░░░░░░]
```

**Componentes:**
- Ícone da categoria "diários"
- Divisor: dia atual do mês
- Valor médio: `soma dos diários / dia atual`
- Valor sugerido: `gastoDiarioPadrao` (da Config)
- Barra de progresso (velocímetro):
  - Verde: `diarioMedio <= gastoDiarioPadrao`
  - Amarelo: `diarioMedio <= gastoDiarioPadrao * 1.2` (até 20% acima)
  - Vermelho: `diarioMedio > gastoDiarioPadrao * 1.2` (muito acima)

**Regras especiais:**
- Se mês passado → divide pelo último dia do mês
- Se mês futuro → exibe "Sem gastos registrados ainda neste mês"
- Barra não aparece se `diaAtualDoMes === 0`

---

### **Seção 2: Movimentações do mês**

Lista de categorias em formato accordion expansível:

```
[↓] Entradas                          R$ 9.800,00  [v]
    🏷️ Salário         R$ 8.000,00 (82%)
    🏷️ Freelance       R$ 1.500,00 (15%)
    🏷️ Sem tag         R$   300,00 (3%)

[↑] Saídas                            R$ 4.279,51  [>]

[🛒] Diários                          R$ 910,00    [>]
```

**Funcionalidades:**
- ✅ Clique para expandir/recolher
- ✅ Exibe total da categoria no header
- ✅ Lista de tags ordenada por valor (maior → menor)
- ✅ Cada tag mostra: nome, valor e percentual
- ✅ Transações sem tag aparecem agrupadas como "Sem tag"
- ✅ Múltiplos accordions podem estar abertos simultaneamente
- ✅ Ao sair da tela, todos os accordions fecham automaticamente

---

## 🔄 Fluxo de Dados

```
TotaisScreen monta
    ↓
useTotais() inicializa
    ↓
carregarDados()
    ↓
Promise.all([
  getTransacoes(),
  getConfig()
])
    ↓
calcularTotaisMes(transacoes, year, month, config)
    ↓
calcularTotaisPorCategoria(transacoes, year, month, config)
    ↓
Para cada dia do mês:
  getTransacoesAplicaveisNaData(transacoes, data)
  Agrupa por categoria e tag
    ↓
Calcula métricas:
  - Performance
  - Meta de Economia
  - Custo de Vida
  - Diário Médio
    ↓
Renderiza UI com todos os dados
```

---

## 🎨 Componentes Reutilizados

### **1. HeaderMesNavegacao**
- Props customizadas:
  - `showMenuButton={true}` - Botão "voltar" no lugar do menu
  - `showTodayButton={true}` - Botão calendário habilitado
  - `onAbrirMenu={voltar}` - Usa `navigation.goBack()`

### **2. CardMetrica**
Componente base para todas as métricas com:
- Título
- Ícones (array opcional)
- Valor principal
- Subtítulo
- Conteúdo customizado (children)

### **3. ProgressBar**
Barra de progresso reutilizável com:
- Percentual (0-100)
- Cor customizável
- Altura configurável
- Opção de exibir/ocultar texto de percentual

### **4. CategoriaAccordion**
Accordion expansível com:
- Ícone e cor da categoria
- Total da categoria
- Lista de tags com valores e percentuais
- Estado de expansão independente

---

## 📊 Cálculos Detalhados

### **Totais por Categoria**
```typescript
// Para cada dia do mês
for (let dia = 1; dia <= ultimoDia; dia++) {
  const transacoesDoDia = getTransacoesAplicaveisNaData(transacoes, data);
  
  transacoesDoDia.forEach((t) => {
    totais[t.categoria] += t.valor;
  });
}

// Normalização (2 casas decimais)
totais[categoria] = Math.round(totais[categoria] * 100) / 100;
```

### **Agrupamento por Tags**
```typescript
const agrupamento: { [tag: string]: number } = {};

transacoesDoDia
  .filter((t) => t.categoria === categoria)
  .forEach((t) => {
    const tagNome = t.tag || "Sem tag";
    agrupamento[tagNome] = (agrupamento[tagNome] || 0) + t.valor;
  });

// Converte para array e calcula percentuais
const tags = Object.entries(agrupamento)
  .map(([nome, valor]) => ({
    nome,
    valor,
    percentual: Math.round((valor / totalCategoria) * 100),
  }))
  .sort((a, b) => b.valor - a.valor); // Ordena por valor (maior primeiro)
```

### **Dia Atual do Mês**
```typescript
const hoje = new Date();
const mesAtual = hoje.getMonth();
const anoAtual = hoje.getFullYear();

// Mês atual → retorna dia de hoje
if (year === anoAtual && month === mesAtual) {
  return hoje.getDate(); // Ex: 26
}

// Mês passado → retorna último dia do mês
if (year < anoAtual || (year === anoAtual && month < mesAtual)) {
  return new Date(year, month + 1, 0).getDate(); // Ex: 31
}

// Mês futuro → retorna 0 (sem gastos)
return 0;
```

---

## ⚙️ Dependências

### **Hooks**
- `useTotais` - Orquestração de estado e cálculos
- `useFocusEffect` - Recarrega dados ao ganhar foco

### **Services**
- `getTransacoes()` - Busca todas as transações
- `getConfig()` - Busca configurações (meta de economia, gasto diário)

### **Utils**
- `totaisUtils.ts` - Todas as funções de cálculo
- `calculoSaldo.ts` - `formatarMoeda()`
- `recorrencia.ts` - `getTransacoesAplicaveisNaData()`
- `categorias.ts` - Metadados das categorias

### **Componentes**
- `HeaderMesNavegacao`
- `LoadingScreen`
- `CardMetrica`
- `ProgressBar`
- `CategoriaAccordion`

---

## 🎯 Casos de Uso

### **1. Visualizar Performance do Mês**
```
Usuário: Abre TotaisScreen
Sistema: Exibe Performance com status colorido
Resultado: Usuário vê rapidamente se sobrou ou faltou dinheiro
```

### **2. Acompanhar Meta de Economia**
```
Usuário: Visualiza card "Economizado"
Sistema: Exibe progresso da meta + frase motivacional
Resultado: Usuário sabe quanto falta para atingir a meta
```

### **3. Analisar Gastos por Tag**
```
Usuário: Clica em "Saídas" na seção de Movimentações
Sistema: Expande accordion mostrando tags
Resultado: Usuário vê distribuição detalhada (ex: Supermercado 32%)
```

### **4. Comparar Diário Real vs Sugerido**
```
Usuário: Visualiza card "Diário médio"
Sistema: Exibe barra colorida (verde/amarelo/vermelho)
Resultado: Usuário sabe se está gastando dentro do limite
```

### **5. Navegar Entre Meses**
```
Usuário: Clica em seta < ou >
Sistema: Muda mês e recalcula todos os totais
Resultado: Usuário compara meses diferentes
```

---

## 🚨 Tratamento de Casos Especiais

### **Sem Entradas Cadastradas**
```
Custo de vida: R$ 5.000,00
Sem entradas cadastradas
```
- Meta de economia fica em 0%
- Status do custo de vida: "Sem entradas cadastradas" (cinza)

### **Sem Meta Definida**
```
Economizado: R$ 500,00
Meta: R$ 0,00
0%
Todo começo é importante! Comece a economizar hoje
```
- Barra fica vazia
- Frase inicial aparece

### **Mês Futuro**
```
Diário médio
[🛒] / 0

Sem gastos registrados ainda neste mês
```
- Dia atual = 0
- Não exibe barra de progresso
- Mensagem informativa

### **Categoria Sem Tags**
```
[↑] Saídas           R$ 1.500,00  [v]
    🏷️ Sem tag       R$ 1.500,00 (100%)
```
- Todas as transações sem tag aparecem agrupadas

### **Múltiplas Tags na Mesma Categoria**
```
[🛒] Diários         R$ 2.000,00  [v]
    🏷️ Almoço        R$ 800,00 (40%)
    🏷️ Transporte    R$ 700,00 (35%)
    🏷️ Lanche        R$ 300,00 (15%)
    🏷️ Sem tag       R$ 200,00 (10%)
```
- Ordenação por valor (maior → menor)
- Percentuais somam 100%

---

## 🎨 Design Tokens Utilizados

### **Cores**
```typescript
// Performance
colors.green[500]  // Sobrou (positivo)
colors.red[500]    // Faltou (negativo)
colors.gray[600]   // Zero a zero

// Meta de Economia
colors.green[500]  // Barra de progresso
colors.green[900]  // Valor economizado

// Custo de Vida
colors.green[500]  // Dentro da renda
colors.yellow[500] // Fora da renda
colors.red[500]    // Muito fora

// Diário Médio
colors.green[500]  // Dentro do limite
colors.yellow[500] // Atenção (até 20% acima)
colors.red[500]    // Muito acima (>20%)
```

### **Espaçamentos**
```typescript
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.lg    // 16px
spacing.xl    // 20px
spacing.xxl   // 24px
```

### **Tipografia**
```typescript
fontSize.sm    // 12px
fontSize.md    // 14px
fontSize.lg    // 16px
fontSize.xl    // 18px
fontSize.xxl   // 20px
fontSize.xxxl  // 24px

typography.regular
typography.medium
typography.semibold
typography.bold
```

---

## 📝 Exemplo de Dados

### **Input (Config + Transações)**
```typescript
config: {
  gastoDiarioPadrao: 66.67,
  percentualEconomia: 15, // 15% de meta
}

transacoes: [
  { categoria: "entradas", valor: 9800, tag: "Salário" },
  { categoria: "saidas", valor: 500, tag: "Supermercado" },
  { categoria: "diarios", valor: 45.50, tag: "Almoço" },
  // ... (recorrentes resolvidas)
]
```

### **Output (Métricas Calculadas)**
```typescript
{
  performance: 3220.49,
  statusPerformance: { texto: "Sobrou dinheiro", cor: "#00A933" },
  
  metaEmReais: 1470.00,
  percentualEconomizado: 100,
  fraseMotivacional: "Parabéns! Você alcançou sua meta! 🎉",
  
  custoDeVida: 6579.51,
  statusCustoDeVida: { texto: "Dentro da renda", cor: "#00A933" },
  
  diarioMedio: 45.50,
  corBarraDiarioMedio: "#00A933", // Verde (dentro)
  percentualBarraDiarioMedio: 68, // 45.50 / 66.67 * 100
  
  totaisPorCategoria: [
    {
      categoria: "entradas",
      total: 9800,
      tags: [
        { nome: "Salário", valor: 8000, percentual: 82 },
        { nome: "Freelance", valor: 1500, percentual: 15 },
        { nome: "Sem tag", valor: 300, percentual: 3 }
      ]
    },
    // ...
  ]
}
```

---

## 🔄 Interações do Usuário

### **Navegação**
- **< seta esquerda** → Mês anterior
- **> seta direita** → Próximo mês
- **📅 ícone calendário** → Volta para mês atual
- **☰ ícone menu** → Volta para tela anterior (`navigation.goBack()`)

### **Accordions**
- **Clique no header** → Expande/recolhe lista de tags
- **Múltiplos abertos** → Permitido (não há limite)
- **Ao sair da tela** → Todos fecham automaticamente (estado local)

### **Scroll**
- **Vertical** → Navega entre cards e categorias
- **Suave e fluido** → `showsVerticalScrollIndicator={false}`

---

## 🐛 Tratamento de Erros

```typescript
try {
  const [transacoes, config] = await Promise.all([
    getTransacoes(),
    getConfig(),
  ]);
  
  // Cálculos...
} catch (error) {
  console.error("Erro ao carregar dados:", error);
  // Mantém estado anterior ou exibe valores zerados
}
```

**Comportamento:**
- Se erro ao carregar → Mantém dados anteriores
- Loading screen aparece durante carregamento
- Valores padrão se config não existir

---

## 🚀 Performance

### **Otimizações Aplicadas**
- ✅ `useFocusEffect` para recarregar apenas quando necessário
- ✅ `useCallback` para evitar recálculos desnecessários
- ✅ Cálculo único no hook, componentes apenas renderizam
- ✅ `FlatList` não necessário (lista pequena de categorias)
- ✅ Estado local dos accordions (não persiste)

### **Complexidade**
- **Cálculo de totais:** O(n * d) onde n = transações, d = dias do mês
- **Agrupamento por tags:** O(n * d) + O(t log t) para ordenação
- **Renderização:** O(c) onde c = 5 categorias (constante)

---

## 📚 Referências

### **Arquivos Relacionados**
- `src/hooks/useTotais.ts` - Hook de orquestração
- `src/utils/totaisUtils.ts` - Funções de cálculo
- `src/components/CardMetrica/` - Card de métrica
- `src/components/ProgressBar/` - Barra de progresso
- `src/components/CategoriaAccordion/` - Accordion de categoria

### **Documentação Externa**
- `src/services/README.md` - Storage Service
- `src/screens/SaldosScreen/README.md` - Referência de estrutura
- `README_GERAL.md` - Visão geral do projeto

---

**Versão:** 1.0.0  
**Data:** 26/12/2024  
**Status:** ✅ Implementação Completa  
**Desenvolvido com 💜 pela equipe Panorama$**
```

---
