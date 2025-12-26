# 💰 README da MetaEconomiaScreen

---

## `src/screens/MetaEconomiaScreen/README.md`

```markdown
# 💰 MetaEconomiaScreen - Definição de Meta de Economia Mensal

## 📋 Visão Geral

A **MetaEconomiaScreen** permite que o usuário defina sua meta de economia mensal como uma porcentagem das entradas. O sistema calcula automaticamente a média mensal de entradas e permite ajustar o percentual desejado através de um slider interativo ou inputs sincronizados.

**Objetivo:** Fornecer uma referência clara de quanto o usuário pretende economizar mensalmente, que será usada futuramente pela TotaisScreen para exibir progresso (Meta vs Real).

---

## 🎯 Funcionalidades Principais

### **1. Cálculo Automático de Média de Entradas**
- Analisa TODAS as transações desde `dataInicial`
- Considera transações únicas E recorrentes
- Filtra apenas categoria `"entradas"`
- Calcula média mensal real baseada em dados históricos

**Fórmula:**
```typescript
const mesesDecorridos = calcularMesesEntre(dataInicial, hoje);
const totalEntradas = somarTransacoesCategoria(transacoes, "entradas");
const mediaEntradas = totalEntradas / mesesDecorridos;
```

### **2. Fallback: Modal de Estimativa**
Se não houver entradas cadastradas (`mediaEntradas === 0`):
- Abre modal automático pedindo estimativa
- Input formatado em Real (R$ 1.234,56)
- Usuário informa quanto espera receber mensalmente
- Sistema usa essa estimativa para cálculos

### **3. Slider Interativo**
- Range: 0% a 100%
- Step: 0.5% (meio ponto percentual)
- Atualiza em tempo real os dois inputs
- Visual suave e responsivo

### **4. Inputs Sincronizados**

#### **Input de Porcentagem (%)**
- Aceita digitação livre
- Limita automaticamente a 100%
- Formata ao perder foco (ex: `20` → `20,0`)
- Atualiza slider + input R$

#### **Input de Valor (R$)**
- Formatação brasileira em tempo real
- Converte para porcentagem ao digitar
- Atualiza slider + input %
- Exemplo: `R$ 600,00` → `15,0%`

### **5. Persistência**
- Salva apenas o campo `percentualEconomia` no Config
- Usa `updateConfig()` para merge inteligente
- Não sobrescreve outros campos do Config

---

## 🏗️ Arquitetura

### **Componentes da Tela**

```
MetaEconomiaScreen
    ├── Header (fixo)
    │   ├── Botão Voltar
    │   └── Título
    │
    ├── ScrollView (conteúdo)
    │   ├── Card Total de Entradas (verde)
    │   │   └── Média mensal calculada
    │   │
    │   ├── Slider (roxo)
    │   │   └── Porcentagem de 0% a 100%
    │   │
    │   ├── Inputs Sincronizados
    │   │   ├── Input % (edição livre)
    │   │   └── Input R$ (formatação automática)
    │   │
    │   ├── Card Resumo (roxo)
    │   │   └── "Você pretende economizar..."
    │   │
    │   └── Info Box (azul)
    │       └── Explicação de uso futuro
    │
    └── Botão Salvar (fixo no rodapé)
```

### **Estados Principais**

```typescript
const [percentual, setPercentual] = useState<number>(0);           // 0 a 100
const [valorReais, setValorReais] = useState<string>("");          // "1.234,56"
const [percentualInput, setPercentualInput] = useState<string>(""); // "20,0"
const [mediaEntradas, setMediaEntradas] = useState<number>(0);
const [modalEstimativaVisible, setModalEstimativaVisible] = useState(false);
const [estimativaInput, setEstimativaInput] = useState<string>("");
const [loading, setLoading] = useState(true);
```

---

## 🔄 Fluxos de Interação

### **Fluxo 1: Primeira Abertura (Com Entradas Cadastradas)**

```
MetaEconomiaScreen monta
    ↓
const config = await getConfig()
const transacoes = await getTransacoes()
    ↓
calcularMediaMensalEntradas(transacoes, config.dataInicial)
    ↓
mediaEntradas = R$ 4.000,00
    ↓
Card verde exibe: "Total de entradas: R$ 4.000,00/mês"
    ↓
Slider na posição 0%
    ↓
Usuário arrasta slider para 15%
    ↓
Input % atualiza: "15,0"
Input R$ atualiza: "R$ 600,00"
Card resumo: "Você pretende economizar R$ 600,00 por mês"
    ↓
Usuário clica em "Salvar Meta"
    ↓
await updateConfig({ percentualEconomia: 15 })
    ↓
Toast: "Meta de economia salva!"
    ↓
navigation.goBack()
```

### **Fluxo 2: Primeira Abertura (Sem Entradas Cadastradas)**

```
MetaEconomiaScreen monta
    ↓
calcularMediaMensalEntradas() retorna 0
    ↓
Modal de estimativa abre automaticamente
    ↓
"Você ainda não possui entradas cadastradas.
 Informe uma estimativa mensal:"
    ↓
Usuário digita: "R$ 5.000,00"
    ↓
Clica em "Confirmar"
    ↓
mediaEntradas = 5000
Modal fecha
    ↓
Card verde exibe: "Total de entradas (estimado): R$ 5.000,00/mês"
    ↓
Fluxo continua normalmente
```

### **Fluxo 3: Edição via Input de Porcentagem**

```
Usuário clica no input %
    ↓
Digita "25"
    ↓
handlePercentualInputChange("25")
    ↓
Valida se é número válido
    ↓
Se > 100 → limita a 100
    ↓
setPercentual(25)
setPercentualInput("25")
    ↓
Calcula valor em R$: 4000 * 0.25 = 1000
    ↓
setValorReais(formatarMoeda(1000))
    ↓
Slider move para posição 25%
    ↓
Card resumo atualiza: "R$ 1.000,00 por mês"
```

### **Fluxo 4: Edição via Input de Reais**

```
Usuário clica no input R$
    ↓
Digita "800"
    ↓
handleValorReaisChange("800")
    ↓
Formata em tempo real: "R$ 800,00"
    ↓
Calcula %: (800 / 4000) * 100 = 20%
    ↓
setPercentual(20)
setPercentualInput("20,0")
    ↓
Slider move para posição 20%
    ↓
Card resumo atualiza: "R$ 800,00 por mês"
```

### **Fluxo 5: Edição de Meta Existente**

```
MetaEconomiaScreen monta
    ↓
config.percentualEconomia = 15
    ↓
Slider inicia em 15%
Input % exibe: "15,0"
Input R$ exibe: "R$ 600,00"
Card resumo exibe meta atual
    ↓
Usuário ajusta para 20%
    ↓
Clica em "Salvar Meta"
    ↓
await updateConfig({ percentualEconomia: 20 })
    ↓
Meta atualizada
```

---

## 🎨 Elementos Visuais

### **Card Total de Entradas (Verde)**
```
┌─────────────────────────────────────┐
│ 💰 Total de Entradas                │
│                                     │
│        R$ 4.000,00                  │
│           por mês                   │
└─────────────────────────────────────┘
```

### **Slider (Roxo)**
```
┌─────────────────────────────────────┐
│ 0% ●━━━━━━━━○━━━━━━━━━━━━━━━━ 100% │
│           15%                       │
└─────────────────────────────────────┘
```

### **Inputs Sincronizados**
```
┌─────────────────────────────────────┐
│ Porcentagem       │    Valor em R$  │
│                   │                 │
│ [  15,0  %  ]     │  [ R$ 600,00 ]  │
└─────────────────────────────────────┘
```

### **Card Resumo (Roxo)**
```
┌─────────────────────────────────────┐
│ 💜 Meta de Economia                 │
│                                     │
│ Você pretende economizar            │
│ R$ 600,00 por mês                   │
│                                     │
│ Isso representa 15% das suas        │
│ entradas mensais.                   │
└─────────────────────────────────────┘
```

### **Info Box (Azul)**
```
┌─────────────────────────────────────┐
│ ℹ️ Como funciona?                    │
│                                     │
│ Esta meta será usada na tela de    │
│ Totais para comparar quanto você   │
│ pretende economizar vs quanto      │
│ realmente economizou no mês.       │
└─────────────────────────────────────┘
```

### **Modal de Estimativa**
```
┌─────────────────────────────────────┐
│ 💰 Estimativa de Entradas      ✕   │
├─────────────────────────────────────┤
│                                     │
│ Você ainda não possui entradas     │
│ cadastradas. Para calcular sua     │
│ meta de economia, informe uma      │
│ estimativa do total de entradas    │
│ mensais:                           │
│                                     │
│ R$ [____________]                  │
│                                     │
├─────────────────────────────────────┤
│ [Cancelar]           [Confirmar]   │
└─────────────────────────────────────┘
```

---

## 🔧 Funções Auxiliares

### **calcularMediaMensalEntradas()**
```typescript
function calcularMediaMensalEntradas(
  transacoes: Transacao[],
  dataInicial: string
): number {
  const hoje = new Date();
  const inicio = new Date(dataInicial);
  
  // Calcula meses decorridos
  const mesesDecorridos = calcularMesesEntre(inicio, hoje);
  
  // Soma todas as entradas
  const totalEntradas = transacoes
    .filter(t => t.categoria === "entradas")
    .reduce((acc, t) => acc + t.valor, 0);
  
  // Retorna média mensal
  return mesesDecorridos > 0 
    ? totalEntradas / mesesDecorridos 
    : 0;
}
```

### **formatarPercentual()**
```typescript
function formatarPercentual(valor: number): string {
  // Garante 1 casa decimal
  // Ex: 15 → "15,0"
  return valor.toFixed(1).replace(".", ",");
}
```

### **converterParaPercentual()**
```typescript
function converterParaPercentual(
  valorReais: number,
  totalEntradas: number
): number {
  if (totalEntradas === 0) return 0;
  
  const percentual = (valorReais / totalEntradas) * 100;
  
  // Limita a 100%
  return Math.min(percentual, 100);
}
```

---

## ⚙️ Integração com Outros Componentes

### **Storage Service**
```typescript
// Leitura
const config = await getConfig();
const percentualAtual = config.percentualEconomia; // 0 a 100

// Escrita
await updateConfig({
  percentualEconomia: 15
});
```

### **Uso Futuro na TotaisScreen**
```typescript
// TotaisScreen (futuro)
const config = await getConfig();
const metaMensal = (mediaEntradas * config.percentualEconomia) / 100;
const economiaReal = calcularEconomiaReal(transacoes, mes);

const progresso = (economiaReal / metaMensal) * 100;

// Exibir barra de progresso:
// Meta: R$ 600,00 | Real: R$ 450,00 (75%)
```

### **MenuScreen**
```typescript
// Navegação
navigation.navigate("MetaEconomia");

// Retorno
navigation.goBack(); // Volta para MenuScreen
```

---

## 💾 Persistência de Dados

### **Estrutura no Config**
```typescript
interface Config {
  // ... outros campos
  percentualEconomia: number; // 0 a 100
}

// Exemplo de Config salvo:
{
  saldoInicial: 5000,
  dataInicial: "2024-01-01",
  gastosVariaveis: [...],
  diasParaDivisao: 30,
  gastoDiarioPadrao: 100,
  percentualEconomia: 15, // ← Meta de 15%
  onboardingCompleto: true
}
```

### **Como é Salvo**
```typescript
// Apenas o campo percentualEconomia é atualizado
await updateConfig({
  percentualEconomia: 15
});

// Config anterior:
// { ..., percentualEconomia: 10, ... }

// Config depois:
// { ..., percentualEconomia: 15, ... }
// Todos os outros campos permanecem intactos
```

---

## 🎯 Regras de Negócio

### **Validações**
- ✅ Percentual mínimo: 0%
- ✅ Percentual máximo: 100%
- ✅ Step do slider: 0.5%
- ✅ Input % aceita decimais (15.5 → 15,5)
- ✅ Input % limita a 100 automaticamente
- ✅ Input R$ não pode exceder total de entradas
- ✅ Formatação brasileira obrigatória (vírgula, não ponto)

### **Cálculos**
```typescript
// De % para R$
valorReais = (mediaEntradas * percentual) / 100

// De R$ para %
percentual = (valorReais / mediaEntradas) * 100

// Exemplo:
// mediaEntradas = R$ 4.000,00
// percentual = 15%
// valorReais = (4000 * 15) / 100 = R$ 600,00
```

### **Comportamento Especial: Sem Entradas**
- Se `mediaEntradas === 0` → Modal de estimativa abre automaticamente
- Usuário DEVE informar uma estimativa para continuar
- Botão "Cancelar" fecha modal e volta para MenuScreen
- Estimativa é usada APENAS para cálculos da tela (não é salva)

---

## ⚠️ Pontos de Atenção

### **Performance**
- Cálculo de média percorre TODAS as transações
- Para muitos registros, pode demorar ~100ms
- Estado `loading` garante que UI não trava

### **Precisão**
- Cálculo de meses considera dias fracionados
- Transações recorrentes são expandidas virtualmente
- Média é sempre baseada em dados reais (não estimativas)

### **UX**
- Slider deve ser suave (60fps)
- Inputs devem formatar em tempo real
- Feedback visual imediato ao ajustar valores
- Toast de sucesso ao salvar

### **Edge Cases**
```typescript
// 1. Usuário novo (sem transações)
// → Modal de estimativa obrigatório

// 2. Apenas uma transação de entrada
// → Média mensal = valor da transação

// 3. Percentual maior que 100%
// → Limitado automaticamente a 100%

// 4. Valor em R$ maior que entradas
// → Limitado automaticamente ao total
```

---

## 🔄 Sincronização de Estados

### **Sequência de Atualização**

```
Usuário move slider
    ↓
setPercentual(novoValor)
    ↓
useEffect detecta mudança em percentual
    ↓
Calcula valorReais
    ↓
Formata percentualInput
    ↓
Atualiza inputs visuais
    ↓
Atualiza card resumo
```

**Importante:** A sincronização é **unidirecional** para evitar loops:
- Slider → Percentual → Inputs
- Input % → Percentual → Input R$ + Slider
- Input R$ → Percentual → Input % + Slider

---

## 🚀 Melhorias Futuras

### **Não Implementado (Roadmap)**
- [ ] Gráfico histórico de economia mensal
- [ ] Comparação: meta vs real dos últimos 3 meses
- [ ] Sugestão inteligente baseada em padrão de gastos
- [ ] Notificação quando atingir a meta
- [ ] Diferentes metas por categoria (não só entradas)
- [ ] Meta progressiva (aumentar X% a cada mês)
- [ ] Exportação de relatório de economia

---

## 📊 Estrutura de Dados Completa

```typescript
// Props da tela (vazio, navegação stack)
type MetaEconomiaScreenProps = {};

// Estado local
interface MetaEconomiaState {
  percentual: number;              // 0 a 100
  valorReais: string;              // "1.234,56"
  percentualInput: string;         // "15,0"
  mediaEntradas: number;           // Calculado
  modalEstimativaVisible: boolean;
  estimativaInput: string;         // "4.000,00"
  loading: boolean;
}

// Config persistido
interface Config {
  percentualEconomia: number; // 0 a 100
}
```

---

## 🔗 Links Relacionados

- **Tela de Menu:** `src/screens/MenuScreen/`
- **Storage Service:** `src/services/storage.ts`
- **Config Types:** `src/types/index.ts`
- **Tela de Totais (futuro):** `src/screens/TotaisScreen/`
- **Previsão de Gasto Diário:** `src/screens/PrevisaoGastoDiarioScreen/`

---

## 🚩 Status

- **Implementação:** ✅ Completa
- **Versão:** 1.0.0
- **Última Atualização:** 25/12/2024
- **Integração com TotaisScreen:** ⏳ Pendente (futuro)

---

**Desenvolvido com 💜 pela equipe Panorama$**
```

