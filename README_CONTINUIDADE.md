---

## 🎯 Como Continuar

Para iniciar uma nova sessão de desenvolvimento, forneça:

1. **Qual feature:** Nome da funcionalidade a implementar
2. **Quais arquivos:** Arquivos relacionados que devem ser analisados
3. **Qual o objetivo:** Descrição clara do comportamento esperado

**Exemplo:**
```
"Vou implementar a tela de edição de gastos variáveis.
Preciso que você veja: ConfiguracaoInicialScreen, storage.ts, Config interface.
Objetivo: Permitir adicionar/editar/remover gastos variáveis após o onboarding,
com recálculo automático do gastoDiarioPadrao."
```

**Contexto sempre disponível:**
- Este arquivo de resumo (`RESUMO_PROJETO.md`)
- READMEs específicos de cada feature
- Estrutura do projeto documentada acima

---

Sou desenvolvedor front-end trabalhando no Panorama$.
Acabei de ler o RESUMO_PROJETO.md acima.

1. **Qual feature:** Agora quero implementar: **Tela de Menu**

2. **Quais arquivos:** Arquivos relacionados que devem ser analisados;
  - Talvez seja importante você conhecer os arquivos de tipagem, navegação, storage, tela de cadastro inicial, temas e arquivos da pasta util.

3. **Qual o objetivo:** 
- Criar uma tela de menu, a princípio com 2 subtelas: Previsão de gasto diário e Reiniciar panoramas;
  * Para a previsão de gastos diários devemos: 
    - Criar uma tela acessível pelo Menu
    - Listar gastos variáveis cadastrados
    - Permitir adicionar/editar/remover gastos
    - Permitir escolher a partir de qual data esse novo valor será aplicado
    - O novo valor não pode substituir os valores já cadastrados nos dias anteriores ao escolhido
    - Recalcular gastoDiarioPadrao automaticamente
    - Salvar no storage e recarregar telas afetadas (Saldos, Panoramas)
    - Pode reaproveitar o máximo possivel da tela de configurações iniciais

  * A segunda opção do menu deve ser 'Reiniciar Panoramas':
    - Deve mostrar um modal de alerta avisando que todos os valores cadastrados serão perdidos se confirmado;
    - Se cancelado, apenas fecha o modal;
    - Se confirmado, deve zerar todos os valores cadastrados, todas as tags criadas, e deve redicionar para a tela de configurações iniciais para ser feito o setup inicial do projeto novamente.
    
Me pergunte se tiver dúvidas ou peça os arquivos necessários.