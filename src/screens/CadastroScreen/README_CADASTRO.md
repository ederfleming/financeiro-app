# Feature Documentation: Cadastro de Transações

## 📝 Visão Geral
Interface responsável pela entrada de dados do Panorama$. Suporta transações únicas, recorrentes e edições granulares (parciais ou totais). É a principal "escritora" de dados para a feature de **Saldos**.

## 🏗️ Arquitetura da Feature

### 1. CadastroScreen (`screens/Cadastro/`)
**Papel:** UI Layer (Coletora de Inputs).
- Renderiza o formulário, seletores de data e modais de decisão.
- **Regra de Ouro:** Não valida campos, não converte moedas e não decide lógica de recorrência. Apenas "dispara" o que o hook ordena.

### 2. useTransacaoForm (Form Controller) (`hooks/useTransacaoForm.ts`)
**Papel:** Controller de Formulário e Regras de Negócio.
- **Diferenciação:** Determina automaticamente o modo (Criação vs. Edição) via parâmetros da rota.
- **Normalização:** Converte valores formatados (String pt-BR) para numéricos (Number) antes da persistência.
- **Lógica de Conflito:** Gerencia o Modal de Decisão para recorrências (Editar apenas uma ocorrência vs. Todas).

## 📥 Contrato de Inicialização (Params)
A tela reage aos parâmetros recebidos via navegação:
- `transacaoId`: Ativa o **Modo Edição** e carrega os dados originais.
- `data` / `categoria`: Permite o pré-preenchimento vindo da planilha de Saldos (atalho).

## 🛠️ Regras de Negócio e Validação
- **Sanitização de Valor:** A UI exibe máscara de moeda, mas o hook centraliza a função `converterValorParaNumero()`.
- **Campos Obrigatórios:** Valor > 0, Data válida e Descrição preenchida. Falhas interrompem o fluxo com alertas nativos.
- **Persistência:** Utiliza exclusivamente o `services/storage.ts` para operações de `add`, `update` ou `editarOcorrenciaRecorrente`.

## 🔄 Fluxo de Edição de Recorrência
Este é o ponto mais crítico da feature. Ao editar uma transação recorrente, o hook coordena:
1. **Edição Pontual:** Chama `editarOcorrenciaRecorrente`, preservando a série histórica e alterando apenas a data alvo.
2. **Edição Total:** Chama `updateTransacao`, alterando o registro mestre da série e, por consequência, **todas** as ocorrências virtuais.

## ⚠️ Pontos de Atenção & Manutenção
- **Integridade:** Alterações nesta feature impactam diretamente os cálculos de **Saldos** e as futuras projeções de **Panoramas**.
- **Performance:** A lista de tags é carregada do storage de forma assíncrona; garantir que o estado de `loading` cubra essa inicialização.
- **Estabilidade:** Qualquer refatoração deve manter o contrato de saída do objeto `Transacao` para evitar corrupção do JSON no AsyncStorage.
- **Consistência Temporal:** Datas devem ser normalizadas via `formatDate` para evitar divergência com o motor de recorrência.


## 🚩 Status
- **Status:** ✅ Implementada e Estável.
- **Próximo Passo:** Integrar novas `Tags` criadas dinamicamente (Feature de Tags pendente).