## 🎯 Próximos Passos: Implementação da Tela de Menu

Sou desenvolvedor front-end trabalhando no **Panorama$**. Após revisar o `RESUMO_PROJETO.md` e validar a lógica de cálculo atual, os objetivos são:

### 1. Feature Selecionada

* **Implementação da Tela de Menu e Subtelas**

### 2. Arquivos para Análise

* **Storage (`services/storage.ts`):** Para implementar o `updateConfig` e `resetStorage`.
* **Utils (`utils/calculoSaldo.ts`):** Validar a integração com `calcularTotaisDia`.
* **Setup (`screens/ConfiguracaoInicialScreen/`):** Base para a nova tela de Previsão.
* **Navegação:** Adicionar as novas rotas no `AppNavigator`.

### 3. Objetivos da Implementação

#### A. Subtela: Previsão de Gasto Diário

* **Interface:** Criar uma "cópia" funcional da tela de cadastro inicial, adaptada para o contexto de edição.
* **Gerenciamento:** Listar, adicionar e remover gastos variáveis.
* **Lógica de Valor Default:** * Ao salvar, o novo `gastoDiarioPadrao` (calculado pela soma dos novos gastos variáveis) substitui o valor antigo no objeto `Config`.
* **Comportamento Inteligente (Baseado em `calcularTotaisDia`):**
* **Histórico:** Dias passados sem gasto real permanecem `0`, conforme a regra `else if (gastoDiarioReal === 0) { totais.diarios = 0; }`.
* **Projeção:** O novo valor padrão será aplicado automaticamente para **Hoje** e **Futuro** onde não houver gasto real.


* **Persistência:** Atualizar o storage e garantir que as telas de **Saldos** e **Panoramas** reflitam a nova projeção imediatamente.

#### B. Opção: Reiniciar Panoramas

* **Segurança:** Modal de alerta com aviso de perda total de dados (transações, tags e configurações).
* **Fluxo de Confirmação:** * Limpeza completa das chaves `@panorama:` no `AsyncStorage`.
* **Reset de Navegação:** Redirecionar para `ConfiguracaoInicialScreen`, limpando a pilha de histórico (o usuário não pode "voltar" para o menu após o reset).


Me pergunte o que precisar caso tenha duvidas e peça os arquivos necessários para que você possa analisar.