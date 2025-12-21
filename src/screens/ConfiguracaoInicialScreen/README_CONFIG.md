# Feature Documentation: Configuração Inicial (Onboarding)

## 📝 Visão Geral
A feature de **Configuração Inicial** estabelece o estado base financeiro do usuário no Panorama$. Ela é o marco zero da aplicação: define a partir de qual data e com qual valor o sistema deve começar a processar a saúde financeira do usuário.

## 🏗️ Estrutura da Feature

### 1. ConfiguracaoInicialScreen (`screens/ConfiguracaoInicial/`)
**Papel:** Formulário de Setup e Persistência de Base.
- **Simplificação:** Por ser um fluxo de execução única (one-time setup), a lógica reside diretamente na Screen, sem necessidade de um hook dedicado.
- **Persistência:** Interage diretamente com as funções `getConfig` e `setConfig` do `services/storage.ts`.
- **Regra de Ouro:** Nenhuma outra funcionalidade financeira é liberada antes da conclusão bem-sucedida desta tela.

## 📥 Dados Coletados e Persistidos
Os dados são consolidados no objeto `Config` e salvos no AsyncStorage:

- **Saldo Inicial (`number`):** O montante disponível no momento do setup. É a base para o cálculo de saldo acumulado.
- **Data Inicial (`string/ISO`):** A âncora temporal do domínio financeiro.
  Transações anteriores a esta data **não devem impactar o saldo acumulado**
  nem projeções futuras.
- **Onboarding Completo (`boolean`):** Flag de controle que desativa este fluxo para acessos futuros.

## 🔄 Fluxo de Finalização
1. **Validação:** Garante que o saldo inicial foi preenchido e a data selecionada é válida.
2. **Conversão:** Transforma a string de entrada (pt-BR) em `number` puro para armazenamento.
3. **Persistência:** Grava o objeto de configuração e marca `onboardingCompleto: true`.
4. **Stack Reset:** Utiliza `navigation.replace("MainTabs")` para garantir que o usuário não consiga retornar ao setup via gesto de "voltar".

## ⚖️ Regras de Negócio Críticas
- **Imutabilidade de Fluxo:** Uma vez concluída, a configuração inicial não pode ser acessada novamente (exceto via reset total de dados).
- **Impacto em Cascata:** Qualquer alteração futura nestes valores (caso seja implementada uma tela de "Ajustes") recalculará retroativamente toda a planilha de **Saldos** e as projeções de **Panoramas**.
- **Normalização:** A UI trabalha com máscaras visuais, mas o storage armazena apenas dados primitivos e normalizados.

## ⚠️ Pontos de Atenção
- **Dependência:** As telas de `Saldos` e `Panoramas` dependem da existência destes dados.
  Caso o `storage` não retorne uma `config` válida, o app deve:
  - Injetar uma configuração padrão, ou
  - Redirecionar automaticamente para o fluxo de Configuração Inicial.

- **Consistência:** A `dataInicial` deve ser tratada com o mesmo `formatDate` utilizado no restante do app para evitar desvios de fuso horário.

## 🚩 Status
- **Status:** ✅ Implementada.
- **Importância:** 🔒 Crítica (Base de todo o domínio financeiro).




