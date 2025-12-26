# Feature Documentation: Configuração Inicial (Onboarding)

## 📝 Visão Geral
A feature de **Configuração Inicial** estabelece o estado base financeiro do usuário no Panorama$. Ela é o marco zero da aplicação: define a partir de qual data e com qual valor o sistema deve começar a processar a saúde financeira do usuário.

**Novidade:** A partir da versão atual, o onboarding foi expandido para incluir um sistema de **Gastos Variáveis**, permitindo que o usuário cadastre seus gastos mensais fixos e obtenha automaticamente uma estimativa de gasto diário recomendado.

## 🏗️ Estrutura da Feature

### 1. ConfiguracaoInicialScreen (`screens/ConfiguracaoInicial/`)
**Papel:** Formulário de Setup em Multi-Steps e Persistência de Base.
- **Sistema de Steps:** Dividido em 2 etapas sequenciais:
  - **Step 1:** Saldo inicial e data inicial
  - **Step 2:** Gastos variáveis mensais (opcional, mas recomendado)
- **Componentes Auxiliares:**
  - `GastoVariavelCard`: Exibe cada gasto cadastrado com opção de remoção
  - `Button`: Componente reutilizável para ações (Voltar/Próximo/Finalizar)
- **Persistência:** Interage diretamente com as funções `getConfig` e `setConfig` do `services/storage.ts`.
- **Regra de Ouro:** Nenhuma outra funcionalidade financeira é liberada antes da conclusão bem-sucedida desta tela.

### 2. GastoVariavelCard (`components/GastoVariavelCard/`)
**Papel:** Componente de Apresentação.
- Exibe título, descrição (opcional) e valor do gasto mensal
- Permite remoção individual com confirmação
- Segue o mesmo padrão visual do `TransacaoCard`

## 📥 Dados Coletados e Persistidos

### Step 1: Configuração Base
Os dados fundamentais são coletados primeiro:

- **Saldo Inicial (`number`):** O montante disponível no momento do setup. É a base para o cálculo de saldo acumulado.
- **Data Inicial (`string/ISO`):** A âncora temporal do domínio financeiro.
  Transações anteriores a esta data **não devem impactar o saldo acumulado**
  nem projeções futuras.

### Step 2: Gastos Variáveis (Novo)
Sistema para cadastro de despesas mensais fixas e cálculo automático do gasto diário recomendado:

- **Gastos Variáveis (`GastoVariavel[]`):** Lista de gastos mensais fixos cadastrados pelo usuário.

```typescript
interface GastoVariavel {
  id: string;
  titulo: string;      // Ex: "Aluguel", "Condomínio"
  descricao: string;   // Ex: "Vence dia 10" (opcional)
  valor: number;       // Valor mensal em R$
}
```

- **Dias para Divisão (`28 | 30 | 31`):** Base de cálculo escolhida pelo usuário para dividir os gastos mensais.
  - **Padrão:** 30 dias
  - **Objetivo:** Flexibilizar o cálculo para diferentes estilos de planejamento

- **Gasto Diário Padrão (`number`):** Calculado automaticamente pela fórmula:

```typescript
gastoDiarioPadrao = totalGastosVariaveis / diasParaDivisao
// Exemplo: R$ 3.000 (gastos) ÷ 30 (dias) = R$ 100/dia
```

- **Onboarding Completo (`boolean`):** Flag de controle que desativa este fluxo para acessos futuros.

### Consolidação Final
Todos os dados são consolidados no objeto `Config` e salvos no AsyncStorage:

```typescript
const config: Config = {
  saldoInicial: 5000,
  dataInicial: "2024-12-01",
  gastosVariaveis: [
    { id: "1", titulo: "Aluguel", descricao: "Vence dia 10", valor: 1500 },
    { id: "2", titulo: "Condomínio", descricao: "", valor: 400 },
    { id: "3", titulo: "Internet", descricao: "", valor: 100 }
  ],
  diasParaDivisao: 30,
  gastoDiarioPadrao: 100, // (1500 + 400 + 100) / 30
  percentualEconomia: 0,
  onboardingCompleto: true
};
```

## 🔄 Fluxo de Navegação e UX

### Sistema de Steps

**Barra de Progresso:**
- Indicador visual mostrando "Etapa 1 de 2" ou "Etapa 2 de 2"
- Barra de progresso preenchida (50% → 100%)

**Step 1 → Step 2:**
- Validação: Saldo inicial deve estar preenchido
- Botão "Próximo" avança para Step 2
- Dados do Step 1 são mantidos em memória

**Step 2 → Finalização:**
- Usuário pode:
  - Adicionar gastos variáveis (via modal)
  - Remover gastos cadastrados
  - Escolher divisão por 28, 30 ou 31 dias
  - Pular esta etapa (gastos vazios = `gastoDiarioPadrao: 0`)
- Botão "Voltar" retorna ao Step 1 sem perder dados
- Botão "Finalizar" persiste tudo e redireciona

### Modal de Adicionar Gasto

**Campos:**
- **Título:** Obrigatório (Ex: "Aluguel")
- **Descrição:** Opcional (Ex: "Vence dia 10")
- **Valor Mensal:** Obrigatório com máscara de moeda

**Validações:**
- Título não pode estar vazio
- Valor deve ser maior que zero
- Modal fecha automaticamente após adicionar com sucesso

## 🎯 Fluxo de Finalização

1. **Validação:** Garante que o saldo inicial foi preenchido e a data selecionada é válida.
2. **Conversão:** Transforma a string de entrada (pt-BR) em `number` puro para armazenamento.
3. **Cálculo Automático:** Processa `gastoDiarioPadrao = total / diasParaDivisao`.
4. **Persistência:** Grava o objeto de configuração completo e marca `onboardingCompleto: true`.
5. **Feedback:** Exibe alert com mensagem de sucesso e o valor do gasto diário calculado:

"Configuração salva com sucesso!
   
   Gasto diário recomendado: R$ 100,00"

6. **Stack Reset:** Utiliza `navigation.replace("MainTabs")` para garantir que o usuário não consiga retornar ao setup via gesto de "voltar".

## ⚖️ Regras de Negócio Críticas

### Configuração Base
- **Imutabilidade de Fluxo:** Uma vez concluída, a configuração inicial não pode ser acessada novamente (exceto via reset total de dados).
- **Impacto em Cascata:** Qualquer alteração futura nestes valores (caso seja implementada uma tela de "Ajustes") recalculará retroativamente toda a planilha de **Saldos** e as projeções de **Panoramas**.
- **Normalização:** A UI trabalha com máscaras visuais, mas o storage armazena apenas dados primitivos e normalizados.

### Gastos Variáveis
- **Opcionalidade:** O usuário pode finalizar o onboarding sem cadastrar gastos (lista vazia).
- **Caso sem gastos:** `gastoDiarioPadrao = 0` (não impacta saldos, apenas não projeta gastos diários).
- **Validação de Valor:** Todos os valores devem ser > 0 para serem aceitos.
- **Persistência Atômica:** A lista completa de gastos é salva de uma vez (não há salvamento parcial).

### Integração com Tela de Saldos
O `gastoDiarioPadrao` calculado aqui alimenta diretamente a coluna "diarios" na tela de Saldos:
- **Dia atual sem gasto real:** Mostra `gastoDiarioPadrao` (estimativa)
- **Dias futuros sem gasto real:** Mostra `gastoDiarioPadrao` (projeção)
- **Dias passados sem gasto real:** Mostra `R$ 0,00` (não gastou)
- **Qualquer dia com gasto real:** Mostra o valor real cadastrado

## 💡 Exemplo de Uso Completo

### Cenário: Usuário configurando pela primeira vez

**Step 1:**
```
```
Saldo Inicial: R$ 5.000,00
Data Inicial: 01/12/2024
[Próximo]

**Step 2:**
```
```
Dividir por: [28] [●30●] [31]

Gastos cadastrados:
- Aluguel: R$ 1.500,00
- Condomínio: R$ 400,00
- Internet: R$ 100,00

Total mensal: R$ 2.000,00
Gasto diário recomendado: R$ 66,67

[Voltar] [Finalizar]

**Resultado no Storage:**

```json
{
  "saldoInicial": 5000,
  "dataInicial": "2024-12-01",
  "gastosVariaveis": [
    { "id": "1", "titulo": "Aluguel", "descricao": "", "valor": 1500 },
    { "id": "2", "titulo": "Condomínio", "descricao": "", "valor": 400 },
    { "id": "3", "titulo": "Internet", "descricao": "", "valor": 100 }
  ],
  "diasParaDivisao": 30,
  "gastoDiarioPadrao": 66.67,
  "percentualEconomia": 0,
  "onboardingCompleto": true
}
```

## ⚠️ Pontos de Atenção

### Dependências e Consistência
- **Dependência:** As telas de `Saldos` e `Panoramas` dependem da existência destes dados.
  Caso o `storage` não retorne uma `config` válida, o app deve:
  - Injetar uma configuração padrão, ou
  - Redirecionar automaticamente para o fluxo de Configuração Inicial.

- **Consistência Temporal:** A `dataInicial` deve ser tratada com o mesmo `formatDate` utilizado no restante do app para evitar desvios de fuso horário.

### Limitações Atuais
- **Edição Pós-Onboarding:** Atualmente não existe tela para editar gastos variáveis após finalizar o setup.
  - **Workaround:** Reset completo dos dados ou edição manual via DevTools
  - **Roadmap:** Tela de "Gerenciar Gastos Variáveis" no menu de configurações

- **Validação de Duplicatas:** Não há verificação de títulos duplicados (ex: dois "Aluguel")
  - **Impacto:** Baixo (apenas visual/organizacional)

### Performance
- **Cálculo em Tempo Real:** O resumo (total mensal e gasto diário) é calculado a cada alteração
- **Impacto:** Desprezível (operações simples sobre array pequeno < 20 itens)

## 🎨 Componentes e Estilos

### GastoVariavelCard
**Aparência:**
```
```
┌─────────────────────────────────────┐
│ 💰  Aluguel         R$ 1.500,00     │
│     Vence dia 10                    │
│ ─────────────────────────────────── │
│ 🗑 Remover                           │
└─────────────────────────────────────┘

**Estados:**
- Normal: Borda cinza clara
- Hover/Press: Feedback visual sutil
- Descrição: Só aparece se preenchida

### Resumo de Gastos
**Aparência:**
```
```
┌─────────────────────────────────────┐
│ Total mensal: R$ 2.000,00           │
│ ─────────────────────────────────── │
│ Gasto diário recomendado: R$ 66,67  │
└─────────────────────────────────────┘

**Destaque:**
- Fundo roxo claro (purple[500] + 10% opacity)
- Gasto diário em negrito e cor roxa (purple[700])

## 🚩 Status e Roadmap

### Status Atual
- **Status:** ✅ Implementada e Estável
- **Versão:** 2.0 (com sistema de gastos variáveis)
- **Importância:** 🔒 Crítica (Base de todo o domínio financeiro)

### Implementações Recentes
- ✅ Sistema de steps (multi-etapas)
- ✅ Cadastro de gastos variáveis
- ✅ Cálculo automático do gasto diário
- ✅ Escolha de dias para divisão (28/30/31)
- ✅ Validações e feedback visual
- ✅ Componente `GastoVariavelCard` reutilizável

### Próximos Passos
- [ ] Tela de edição de gastos variáveis pós-onboarding
- [ ] Sugestões de categorias comuns (templates)
- [ ] Importação de gastos via foto de boleto/fatura
- [ ] Histórico de mudanças nos gastos variáveis
- [ ] Gráfico de distribuição dos gastos mensais

### Melhorias Futuras
- [ ] Permitir editar ordem dos gastos (drag & drop)
- [ ] Exportar/importar configuração via JSON
- [ ] Modo "configuração rápida" (skip gastos variáveis)
- [ ] Tutorial interativo explicando cada campo

