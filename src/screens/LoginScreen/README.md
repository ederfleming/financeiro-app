# Feature Documentation: Login (Gate de Acesso)

## 📝 Visão Geral
A feature de **Login** atua como o gatekeeper de segurança e o controlador do fluxo de inicialização do Panorama$. Ela decide o destino do usuário com base no status do onboarding e na presença de biometria.

## 🏗️ Arquitetura da Feature

### 1. LoginScreen (`screens/Login/`)
**Papel:** UI e Orquestração de Entrada.
- Exibe o branding e os controles de acesso.
- Diferente das outras telas, esta centraliza a lógica de hardware (biometria) devido à sua natureza de "startup" da aplicação.
- **Regra de Ouro:** Não existe autenticação externa (backend) ou gerenciamento de sessão via token.

## 🔑 Fluxo de Autenticação e Decisão

### 1. Verificação de Capacidade (Hardware)
Ao montar o componente, a tela utiliza o `expo-local-authentication` para:
- `hasHardwareAsync()`: Verificar se o dispositivo possui suporte físico.
- `isEnrolledAsync()`: Verificar se o usuário possui biometria cadastrada.
- O resultado define se o botão de acesso solicitará biometria ou será um acesso direto.

### 2. Lógica de Navegação Condicional
Ao acionar o login, o app segue a árvore de decisão:
- **Onboarding Pendente:** Se `isOnboardingCompleto()` retornar `false`, o destino obrigatório é `ConfiguracaoInicial`.
- **Onboarding Completo:** - Se biometria disponível: Dispara `authenticateAsync`. Sucesso navega para `MainTabs`.
  - Se biometria indisponível: Navega direto para `MainTabs`.

## 🔄 Comportamentos de Navegação
- **Stack Reset:** Utiliza `navigation.replace` em todos os fluxos de sucesso para limpar a pilha de navegação, impedindo que o usuário volte à tela de Login usando o botão "voltar" do sistema.

## 🛠️ Dependências e Estados
- **Local Authentication:** Dependência crítica do Expo para segurança biométrica.
- **Storage Service:** Utilizado para consultar o status do onboarding (`getConfig`).
- **Estados de UI:** `loading` (para processamento da biometria) e `hasBiometrics` (para exibição condicional de ícones).

## ⚠️ Segurança e Pontos de Atenção
- **Segurança Local:** A autenticação é estritamente local. O app não protege os dados contra usuários que conheçam a senha de desbloqueio do próprio dispositivo (uma vez que a biometria do sistema libera o acesso).
- **Fallback:** Em dispositivos sem biometria, o login funciona apenas como um passo de confirmação de entrada, sem bloqueio por senha numérica.

## 🚩 Status
- **Status:** ✅ Implementada e Estável.
- **Risco:** 🔒 Baixo (Segurança local apenas).