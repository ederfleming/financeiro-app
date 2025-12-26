# Feature Documentation: Detalhes de Transações

## 📝 Visão Geral
A tela de **Detalhes** atua como o detalhamento granular de um dia selecionado na planilha de Saldos. Ela consolida transações únicas e instâncias de recorrências, permitindo a gestão direta (filtro, edição e exclusão) das movimentações daquela data.

## 🏗️ Arquitetura da Feature

### 1. DetalhesScreen (`screens/Detalhes/`)
**Papel:** UI Layer (Exibição e Eventos).
- Renderiza o Header com a data e a lista de cards de transação.
- Gerencia a visibilidade de modais de exclusão e estados de `EmptyState`.
- **Regra de Ouro:** Não filtra dados e não conhece as funções de persistência.

### 2. useTransacoesData (`hooks/useTransacoesData.ts`)
**Papel:** Orquestrador de Dados do Dia.
- **Data Fetching:** Utiliza `useFocusEffect` para garantir que a lista esteja sempre atualizada ao voltar da tela de Cadastro.
- **Inteligência de Dados:** Consome `getTransacoesPorDataComRecorrencia`, garantindo que instâncias de gastos repetitivos apareçam na lista.
- **Filtragem:** Processa o estado `filtroCategoria` e deriva a lista `transacoesFiltradas`.

## 📥 Contrato de Inicialização (Params)
A tela depende obrigatoriamente do parâmetro:
- `data`: String normalizada (ISO/YYYY-MM-DD) que serve como chave de busca para o storage.

## 🔄 Fluxo de Exclusão (Crítico)
A feature implementa uma lógica de proteção para evitar perda de dados acidental:

1. **Transação Única:** Exclusão direta via `deleteTransacao` após confirmação simples (`Alert`).
2. **Transação Recorrente (Fluxo em 3 etapas):** 
   - **Excluir apenas esta ocorrência:** Invoca `excluirOcorrenciaRecorrente`. A série histórica permanece intacta, apenas a data atual é marcada como excluída.
   - **Excluir desta data em diante:** Invoca `excluirRecorrenciaAPartirDe`. Define `dataFimRecorrencia` para encerrar a série a partir da data selecionada, preservando o histórico anterior.
   - **Excluir todas as ocorrências:** Invoca `deleteTransacao`, removendo o registro mestre da série e, consequentemente, todas as instâncias virtuais (passadas e futuras).

## 🔗 Navegação e Integração
- **Continuidade:** Ao navegar para "Cadastro" a partir desta tela, o hook injeta a `data` e a `categoria` (respeitando o filtro ativo) para agilizar o preenchimento.
- **Sincronia:** Qualquer exclusão aqui dispara um recarregamento que impacta instantaneamente o saldo acumulado visualizado na tela anterior (Saldos).

## ⚠️ Pontos de Atenção
- **Impacto no Domínio:** Excluir uma recorrência "total" nesta tela altera retroativamente todos os meses do app.
- **Performance:** O hook deve garantir que o estado de `loading` seja aplicado corretamente durante o re-fetch após exclusões.
- **Consistência de Filtro:** O estado `filtroCategoria` afeta tanto a lista quanto o comportamento do botão "Adicionar", devendo permanecer sincronizado com a UI.

## 🚩 Status
- **Status:** ✅ Implementada e Estável.
- **Risco:** ⚠️ Alto (Operações de escrita/deleção em lote).