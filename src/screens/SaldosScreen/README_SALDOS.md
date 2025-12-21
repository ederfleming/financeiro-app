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
- **Inputs:** Datas do mês, Transações, Dias Conciliados e Configurações (Saldo Inicial).
- **Output:** `SaldoDia[]`.
- **Importância:** Único local onde reside a inteligência de cálculo do app.

## 🛠️ Fluxo de Dados e Navegação
- **Origem dos Dados:** 
  - `getTransacoes` / `getTransacoesMes` (via storage),
  - `getDiasConciliados`,
  - `getConfig`.
- **Navegação:** O hook centraliza as rotas para `Menu`, `Cadastro` (com pré-preenchimento de data/categoria) e `Detalhes`.
- **Formatação:** Datas são normalizadas via `formatDate` antes de qualquer operação.

## ⚡ Comportamentos Críticos
- **Scroll Inteligente:** Posicionamento automático no dia atual (mês vigente) ou no topo (outros meses).
- **Conciliação Otimista:** O status de conciliação reflete na UI imediatamente enquanto persiste no storage.
- **Performance:** O loading é restrito ao primeiro carregamento para evitar flicker na navegação entre abas.

## 🚩 Status e Próximos Passos
- **Status:** ✅ Estável / Implementada.
- **Débito Técnico:** Avaliar a extração de:
  - lógica de filtros, e
  - lógica de navegação para hooks auxiliares caso o `useSaldos` cresça.
- **Dependência:** A feature **Panorama** dependerá da evolução da lógica contida em `calcularSaldosMes`.