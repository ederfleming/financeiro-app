## 🎯 Próximos Passos: Implementação da Tela de Menu (Versão Atualizada)

Sou desenvolvedor front-end trabalhando no **Panorama$**. Após revisar o `RESUMO_PROJETO.md`, os objetivos atualizados para esta sprint são:

### 1. Feature Selecionada

* **Implementação da Tela de Menu**

### 2. Arquivos para Análise

Para uma implementação integrada, os seguintes arquivos devem ser analisados:

* **Tipagem & Navegação:** Definições de interfaces e rotas do sistema.
* **Storage:** Lógica de persistência para as novas regras de gasto.
* **Setup:** Tela de cadastro inicial (será o componente base para a nova funcionalidade).
* **Utils & Temas:** Padronização visual e funções auxiliares da pasta `util`.

### 3. Objetivos da Implementação

#### A. Subtela: Previsão de Gasto Diário

* **Acesso:** Criar entrada na Tela de Menu para esta nova visualização.
* **Gerenciamento:** Listagem de gastos variáveis com opções de **adicionar** e **remover**.
* **Lógica de Substituição:** * O novo gasto variável deve substituir o `gastoDiarioPadrao` antigo conforme a nova regra.
* **Respeito ao Histórico:** O novo valor **não** deve afetar dias anteriores à data escolhida.
* **Priorização:** A aplicação deve validar se o valor a ser exibido/considerado é o gasto padrão ou o gasto real, seguindo a hierarquia de dados do projeto.


* **Sincronização:** * Recalcular o `gastoDiarioPadrao` automaticamente após alterações.
* Salvar no storage e forçar o recarregamento das telas dependentes (**Saldos** e **Panoramas**).


* **Desenvolvimento:** Reaproveitar **na íntegra** a tela de cadastro inicial para manter a consistência.

#### B. Opção: Reiniciar Panoramas

* **Segurança:** Exibir modal de alerta crítico antes de qualquer ação.
* **Ações:**
* **Cancelar:** Fecha o modal e mantém o estado atual.
* **Confirmar:** Executa o *hard reset* (limpa todos os valores, zera as tags e apaga o storage relacionado).


* **Fluxo de Saída:** Após o reset, redirecionar obrigatoriamente para a tela de **Configurações Iniciais** para um novo setup.

