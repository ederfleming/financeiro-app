# Feature Documentation: Saldos (Core Domain)

## 📝 Visão Geral
A tela **Saldos** é o centro operacional do Panorama$. Exibe uma visão mensal em formato de planilha/tabela com o saldo diário e acumulado, consolidando transações únicas e recorrentes.

## 🏗️ Divisão de Responsabilidades

### 1. SaldosScreen (`screens/Saldos/`)
**Papel:** Interface Pura (Declarativa).
- Renderiza a composição da UI e lista mensal.
- Encaminha eventos do usuário para o hook.
- **Regra de Ouro:** Proibido acesso ao storage ou execução de lógica financeira.

### 2. useSaldos (`hooks/useSaldos.ts`)
**Papel:** Orquestrador de Estado e Efeitos.
- **Estado:** Controla `mesAtual`, `filtroCategoria`, `loading` e o array de `saldos`.
- **Dados:** Consome exclusivamente o `services/storage.ts`.
- **UI UX:** Gerencia o scroll inteligente (Auto-scroll para o dia atual) e navegação.
- **Reatividade:** Recarrega dados via `useFocusEffect` para garantir consistência.

### 3. calcularSaldosMes (`utils/calculoSaldo.ts`)
**Papel:** Engine Financeira (Pure Function).
- **Inputs:** Datas do mês, Transações, Dias Conciliados e Configurações (Saldo Inicial, Gasto Diário Padrão).
- **Output:** `SaldoDia[]`.
- **Importância:** Único local onde reside a inteligência de cálculo do app.

## 🛠️ Fluxo de Dados e Navegação
- **Origem dos Dados:** 
  - `getTransacoes` / `getTransacoesMes` (via storage),
  - `getDiasConciliados`,
  - `getConfig` (inclui `gastoDiarioPadrao` para cálculo inteligente).
- **Navegação:** O hook centraliza as rotas para `Menu`, `Cadastro` (com pré-preenchimento de data/categoria) e `Detalhes`.
- **Formatação:** Datas são normalizadas via `formatDate` antes de qualquer operação.

## 💰 Lógica da Coluna "diarios" (Gasto Diário)

A categoria "diarios" possui comportamento especial que combina **gastos reais** com **estimativa configurada**.

### Regra de Resolução

A coluna "diarios" é calculada seguindo esta hierarquia:
```typescript
// Pseudocódigo da lógica em calcularTotaisDia()
const gastoDiarioReal = soma(transacoes categoria "diarios" do dia);

if (data < config.dataInicial) {
  diarios = 0; // Dias antes da configuração inicial
}
else if (gastoDiarioReal > 0) {
  diarios = gastoDiarioReal; // Gasto real tem prioridade absoluta
}
else if (isHoje(data) || isFutura(data)) {
  diarios = config.gastoDiarioPadrao; // Estimativa para planejamento
}
else {
  diarios = 0; // Dias passados sem gasto = zero
}
```

### Tabela de Comportamento

| Período | Gasto Real Cadastrado? | Valor Exibido | Impacto no Saldo |
|---------|------------------------|---------------|------------------|
| Antes de `dataInicial` | Qualquer | `R$ 0,00` | Não afeta |
| **Dias Passados** | ✅ Sim | Soma dos reais | Desconta |
| **Dias Passados** | ❌ Não | `R$ 0,00` | Não afeta |
| **Dia Atual (Hoje)** | ✅ Sim | Soma dos reais | Desconta |
| **Dia Atual (Hoje)** | ❌ Não | `gastoDiarioPadrao` | Desconta (estimativa) |
| **Dias Futuros** | ✅ Sim | Soma dos reais | Desconta |
| **Dias Futuros** | ❌ Não | `gastoDiarioPadrao` | Desconta (projeção) |

### Exemplo Visual

**Configuração:**
- `gastoDiarioPadrao = R$ 100,00`
- `dataInicial = 2024-12-01`

**Visualização na Tela:**
```
┌─────┬────────────┬──────────────┐
│ Dia │ Diários    │ Saldo        │
├─────┼────────────┼──────────────┤
│ 18  │ R$ 0,00    │ R$ 1.500,00  │ ← Passou sem gastar
│ 19  │ R$ 150,00  │ R$ 1.350,00  │ ← Gastou real (2 refeições)
│ 20  │ R$ 0,00    │ R$ 1.350,00  │ ← Passou sem gastar
│ 21  │ R$ 100,00  │ R$ 1.250,00  │ ← HOJE sem gasto (usa padrão)
│ 22  │ R$ 100,00  │ R$ 1.150,00  │ ← Futuro (projeção)
│ 23  │ R$ 100,00  │ R$ 1.050,00  │ ← Futuro (projeção)
└─────┴────────────┴──────────────┘
```

### Significado para o Usuário

- **Dias passados zerados:** "Você não gastou nada com diários nesse dia"
- **Dia atual com estimativa:** "Você pode gastar até R$ 100 hoje"
- **Dias futuros com estimativa:** "Projeção assumindo que você gastará R$ 100/dia"
- **Qualquer dia com valor real:** "Você realmente gastou essa quantia"

> 📌 **Importante:** O gasto diário padrão **não é uma transação automática**. É apenas um fallback de cálculo que:
> - Ajuda no planejamento (mostra quanto pode gastar)
> - Mantém projeções realistas no futuro
> - Reflete a realidade nos dias passados (zero se não gastou)

### Implementação Técnica

A lógica está implementada em:
1. **`utils/calculoSaldo.ts`** → `calcularTotaisDia(data, transacoes, config)`
2. **`utils/dateUtils.ts`** → `isHoje(data)` e `isFutura(data)` (helpers)

O `config.gastoDiarioPadrao` é calculado automaticamente durante o onboarding:
```typescript
gastoDiarioPadrao = totalGastosVariaveis / diasParaDivisao
// Ex: R$ 3.000 ÷ 30 dias = R$ 100/dia
```

## ⚡ Comportamentos Críticos
- **Scroll Inteligente:** Posicionamento automático no dia atual (mês vigente) ou no topo (outros meses).
- **Conciliação Otimista:** O status de conciliação reflete na UI imediatamente enquanto persiste no storage.
- **Performance:** O loading é restrito ao primeiro carregamento para evitar flicker na navegação entre abas.
- **Gasto Diário Inteligente:** Diferencia automaticamente realidade histórica (passado) de planejamento/projeção (presente/futuro).

## 🔗 Integração com Outras Features

### Cadastro de Transações
- Long press no dia → Abre tela de Cadastro com data/categoria pré-preenchidas
- Gastos diários cadastrados substituem automaticamente a estimativa

### Detalhes do Dia
- Long press nos valores → Lista todas as transações do dia (incluindo recorrentes)
- Exibe tanto gastos reais quanto indica quando a estimativa está sendo usada

### Configuração Inicial
- Define o `gastoDiarioPadrao` através dos gastos variáveis
- Este valor alimenta toda a projeção da tela de Saldos

## 🚩 Status e Próximos Passos
- **Status:** ✅ Estável / Implementada.
- **Recente:**
  - ✅ Sistema de gasto diário inteligente (real vs estimado)
  - ✅ Suporte a gastos variáveis e cálculo automático
- **Débito Técnico:** Avaliar a extração de:
  - lógica de filtros, e
  - lógica de navegação para hooks auxiliares caso o `useSaldos` cresça.
- **Melhorias Futuras:**
  - [ ] Indicador visual diferenciando gasto real vs estimado na coluna "diarios"
  - [ ] Tooltip/hint explicando "Este é o gasto estimado" ao tocar
  - [ ] Alert de conquista: "Parabéns! Gastou menos que o estimado"
- **Dependência:** A feature **Panorama** dependerá da evolução da lógica contida em `calcularSaldosMes` e utilizará o mesmo `gastoDiarioPadrao` para projeções futuras.