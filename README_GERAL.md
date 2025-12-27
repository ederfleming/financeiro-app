```markdown
# 📊 Panorama$ - Controle Financeiro Pessoal

## 🎯 Visão Geral

**Panorama$** é um aplicativo de controle financeiro pessoal desenvolvido em **React Native + Expo**, focado em fornecer visualização clara da saúde financeira futura através de planilhas interativas, projeções inteligentes e análise detalhada por tags.

---

## 🛠️ Stack Tecnológica
```
Framework: Expo ~54 (Bare Workflow)
Mobile: React Native 0.81
Core: React 19
Linguagem: TypeScript (strict mode)
Navegação: React Navigation (native-stack + bottom-tabs)
Gestos: React Native Gesture Handler
Persistência: AsyncStorage (local, sem backend)
Segurança: Expo Local Authentication (Biometria)
```

---

## 🏗️ Arquitetura do Projeto

### **Estrutura de Pastas**
```
panorama$/
├── src/
│   ├── components/          # Componentes reutilizáveis (16 componentes)
│   │   ├── Button/
│   │   ├── TransacaoCard/
│   │   ├── GastoVariavelCard/
│   │   ├── CardMetrica/              ← ✨ v1.0.0
│   │   ├── ProgressBar/              ← ✨ v1.0.0
│   │   ├── CategoriaAccordion/       ← ✨ v1.0.0
│   │   └── ... (outros componentes)
│   │
│   ├── hooks/               # Hooks customizados (7 hooks)
│   │   ├── useSaldos.ts
│   │   ├── usePanoramas.ts
│   │   ├── useTransacaoForm.ts
│   │   ├── useTagsScreen.ts          ← ✨ v1.0.0
│   │   ├── useTotais.ts              ← ✨ v1.0.0
│   │   └── ... (outros hooks)
│   │
│   ├── screens/             # Telas do app (12 telas)
│   │   ├── LoginScreen/
│   │   ├── ConfiguracaoInicialScreen/
│   │   ├── SaldosScreen/
│   │   ├── PanoramasScreen/
│   │   ├── CadastroScreen/
│   │   ├── DetalhesScreen/
│   │   ├── TotaisScreen/             ← ✨ v1.0.0 (completa)
│   │   ├── MenuScreen/
│   │   ├── PrevisaoGastoDiarioScreen/
│   │   ├── MetaEconomiaScreen/
│   │   ├── TagsScreen/               ← ✨ v1.0.0
│   │   └── RedefinirSaldoInicialScreen/ ← ✨ v1.0.0 (NOVA)
│   │
│   ├── services/            # Camada de persistência
│   │   ├── storage.ts       # AsyncStorage (Single Source of Truth)
│   │   └── README.md        # 📖 Documentação completa do Storage
│   │
│   ├── utils/               # Funções puras (~40 funções)
│   │   ├── calculoSaldo.ts
│   │   ├── totaisUtils.ts            ← ✨ v1.0.0
│   │   ├── recorrencia.ts
│   │   ├── dateUtils.ts
│   │   └── categorias.ts
│   │
│   ├── types/               # Definições TypeScript
│   │   ├── index.ts
│   │   └── navigation.d.ts
│   │
│   └── theme/               # Design tokens
│       └── colors.tsx
│
├── App.tsx
├── package.json
└── tsconfig.json
```

### **Padrão de Organização**

Cada feature segue a estrutura:
```
Feature/
├── index.tsx       # Código principal
├── styles.ts       # Estilos (design tokens)
└── README.md       # Documentação específica
```

---

## 📋 Features Implementadas

### **1. Sistema de Persistência** → `services/storage.ts`
- AsyncStorage como fonte única da verdade
- Particionamento mensal para performance
- Motor de recorrência virtual (não duplica transações)
- Suporte a exclusões e edições pontuais
- Sistema de Tags por Categoria
- Função `updateConfig()` para atualizações parciais
- Função `resetStorage()` para reset completo

📖 **Documentação:** `src/services/README.md`

---

### **2. Onboarding** → `ConfiguracaoInicialScreen` ← ✨ v1.0.0 ATUALIZADO
- **Step 0:** Identificação do usuário (nome, email, data de nascimento)
- **Step 1:** Saldo inicial + Data inicial
- **Step 2:** Gastos variáveis mensais
- Cálculo automático do gasto diário padrão
- Escolha de divisão (28/30/31 dias)
- **Criação automática de transação "Saldo Inicial"**
- **Criação automática de tag "Saldo Inicial"**

📖 **Documentação:** `src/screens/ConfiguracaoInicialScreen/README.md`

---

### **3. Tela de Saldos** → `SaldosScreen`
- Visualização mensal em formato de planilha
- Navegação por swipe (gestos horizontais)
- Coluna "diarios" com lógica inteligente (passado/presente/futuro)
- Conciliação de dias
- Filtros por categoria

📖 **Documentação:** `src/screens/SaldosScreen/README.md`

---

### **4. Tela de Panoramas** → `PanoramasScreen`
- Visualização trimestral (3 meses lado a lado)
- Navegação por swipe entre trimestres
- Destaque de fins de semana
- Formatação abreviada (R$ 5,0k)
- Scroll independente por coluna

📖 **Documentação:** `src/screens/PanoramasScreen/README.md`

---

### **5. Tela de Totais** → `TotaisScreen` ← ✨ v1.0.0
- **Performance:** Entradas - Gastos (com status colorido)
- **Economizado:** Progresso da meta com barra visual e frases motivacionais
- **Custo de Vida:** Saídas + Diários + Cartão (com análise de renda)
- **Diário Médio:** Gasto médio diário com velocímetro comparativo
- **Movimentações do Mês:** Accordion expansível por categoria
- **Análise por Tags:** Cada categoria exibe distribuição de gastos por tag
- Navegação mensal com recálculo automático
- Integração completa com Meta de Economia

📖 **Documentação:** `src/screens/TotaisScreen/README.md`  
📖 **Utils:** `src/utils/totaisUtils.ts` (funções de cálculo)  
📖 **Hook:** `src/hooks/useTotais.ts` (orquestração)

---

### **6. Cadastro de Transações** → `CadastroScreen`
- Transações únicas e recorrentes
- 5 categorias: entradas, saídas, diários, cartão, economia
- Sistema de tags filtrado por categoria
- Edição de ocorrências pontuais vs série completa
- Exclusão granular (apenas esta, desta em diante, todas)

📖 **Documentação:** `src/screens/CadastroScreen/README.md`

---

### **7. Sistema de Tags** → `TagsScreen` ← ✨ v1.0.0
- Tags organizadas por categoria (não há tags globais)
- Interface accordion expansível
- CRUD completo: criar, editar, remover
- Validações robustas (duplicatas, limites)
- Edição de tags atualiza automaticamente todas as transações
- Migração automática de tags antigas

**Limites:**
- 20 tags por categoria
- 20 caracteres por tag
- Duplicatas proibidas na mesma categoria
- Duplicatas permitidas em categorias diferentes

📖 **Documentação:** `src/screens/TagsScreen/README.md`  
📖 **Hook:** `src/hooks/useTagsScreen.ts`

---

### **8. Tela de Menu** → `MenuScreen` ← ✨ v1.0.0 ATUALIZADO
- Previsão de Gasto Diário
- Meta de Economia
- **Redefinir Saldo Inicial** ← NOVO
- Reiniciar Panoramas
- Footer com versão do app

📖 **Documentação:** `src/screens/MenuScreen/README.md`

---

### **9. Previsão de Gasto Diário** → `PrevisaoGastoDiarioScreen`
- Edição de gastos variáveis pós-onboarding
- Modal para adicionar novos gastos
- Cálculo automático do gasto diário
- Escolha de divisão (28/30/31 dias)
- Integração automática com Saldos e Panoramas

📖 **Documentação:** `src/screens/PrevisaoGastoDiarioScreen/README.md`

---

### **10. Meta de Economia** → `MetaEconomiaScreen`
- Cálculo automático de média mensal de entradas
- Slider interativo (0% a 100%)
- 2 inputs sincronizados (% e R$)
- Persistência via `updateConfig({ percentualEconomia })`
- Integração com TotaisScreen (comparação Meta vs Real)

📖 **Documentação:** `src/screens/MetaEconomiaScreen/README.md`

---

### **11. Redefinir Saldo Inicial** → `RedefinirSaldoInicialScreen` ← ✨ v1.0.0 NOVA
- Edição do saldo inicial e data inicial
- Atualização automática da transação "Saldo Inicial"
- Recálculo automático de todos os saldos e projeções
- Acessível via Menu

📖 **Documentação:** `src/screens/RedefinirSaldoInicialScreen/README.md`

---

### **12. Detalhes de Transações** → `DetalhesScreen`
- Lista de transações por dia
- Filtros por categoria
- Exibição de tags nos cards
- Exclusão com múltiplas opções

📖 **Documentação:** `src/screens/DetalhesScreen/README.md`

---

## 🧩 Componentes Reutilizáveis

### **Componentes Core**
- **Button** - Botão customizável com estados
- **LoadingScreen** - Tela de carregamento
- **HeaderMesNavegacao** - Cabeçalho de navegação mensal

📖 **Localização:** `src/components/[ComponentName]/`

### **Componentes de Cards**
- **TransacaoCard** - Card de transação com tags
- **GastoVariavelCard** - Card de gasto variável editável
- **CardMetrica** ← v1.0.0 - Card base para métricas

📖 **Localização:** `src/components/[ComponentName]/`

### **Componentes Visuais**
- **ProgressBar** ← v1.0.0 - Barra de progresso customizável
- **CategoriaAccordion** ← v1.0.0 - Accordion de categoria com tags
- **Divider** - Divisor visual
- **FiltrosCategorias** - Filtro de categorias

📖 **Localização:** `src/components/[ComponentName]/`

---

## 🔧 Hooks Customizados

| Hook | Responsabilidade | Documentação |
|------|------------------|--------------|
| `useSaldos` | Orquestração da SaldosScreen | `src/hooks/useSaldos.ts` |
| `usePanoramas` | Orquestração da PanoramasScreen | `src/hooks/usePanoramas.ts` |
| `useTotais` ← v1.0.0 | Orquestração da TotaisScreen | `src/hooks/useTotais.ts` |
| `useTransacaoForm` | Formulário de transações | `src/hooks/useTransacaoForm.ts` |
| `useTagsScreen` ← v1.0.0 | Gerenciamento de tags | `src/hooks/useTagsScreen.ts` |
| `useSaldoStyles` | Estilos dinâmicos de saldo | `src/hooks/useSaldoStyles.ts` |

📖 **Padrão:** Cada hook possui JSDoc detalhado no código

---

## 🛠️ Utils - Funções Puras

### **Cálculos Financeiros**
- **calculoSaldo.ts** - Cálculo de saldos, totais e formatação
- **totaisUtils.ts** ← v1.0.0 - Totais por categoria, agrupamento por tags, métricas

### **Data e Recorrência**
- **dateUtils.ts** - Manipulação de datas, formatação
- **recorrencia.ts** - Resolução de transações recorrentes

### **Configuração**
- **categorias.ts** - Metadados das categorias (ícones, cores, labels)

📖 **Documentação:** `src/utils/README.md`

---

## 💾 Storage Service

### **Operações Principais**

#### **Config**
```typescript
getConfig(): Promise<Config>
setConfig(config: Config): Promise<void>
updateConfig(partial: Partial<Config>): Promise<void>
resetStorage(): Promise<void>
```

#### **Transações**
```typescript
getTransacoes(): Promise<Transacao[]>
getTransacoesMes(year, month): Promise<Transacao[]>
addTransacao(t: Transacao): Promise<void>
updateTransacao(id, partial): Promise<void>
deleteTransacao(id): Promise<void>
excluirOcorrenciaRecorrente(id, data): Promise<void>
editarOcorrenciaRecorrente(id, data, dados): Promise<void>
```

#### **Tags** ← v1.0.0
```typescript
getTags(): Promise<TagsPorCategoria>
getTagsCategoria(categoria): Promise<string[]>
addTag(categoria, nome): Promise<Result>
editTag(categoria, nomeAntigo, nomeNovo): Promise<Result>
deleteTag(categoria, nome): Promise<Result>
```

#### **Saldo Inicial** ← v1.0.0
```typescript
criarTagSaldoInicial(): Promise<void>
criarTransacaoSaldoInicial(valor, data): Promise<void>
existeTransacaoSaldoInicial(): Promise<boolean>
```

#### **Conciliação**
```typescript
getDiasConciliados(): Promise<string[]>
toggleDiaConciliado(data): Promise<void>
isDiaConciliado(data): Promise<boolean>
```

📖 **Documentação Completa:** `src/services/README.md`

---

## 🔄 Interfaces de Dados Principais

### **UserProfile** ← ✨ v1.0.0 NOVO
```typescript
interface UserProfile {
  nome: string;
  email: string;
  dataNascimento: string; // YYYY-MM-DD
}
```

### **Config** (base do app) ← ✨ v1.0.0 ATUALIZADO
```typescript
interface Config {
  perfil: UserProfile;             // ← NOVO
  saldoInicial: number;            // ← Agora apenas referência histórica
  dataInicial: string;
  gastosVariaveis: GastoVariavel[];
  diasParaDivisao: 28 | 30 | 31;
  gastoDiarioPadrao: number;
  percentualEconomia: number;      // 0 a 100
  onboardingCompleto: boolean;
}
```

### **TagsPorCategoria** ← v1.0.0
```typescript
interface TagsPorCategoria {
  entradas: string[];
  saidas: string[];
  diarios: string[];
  cartao: string[];
  economia: string[];
}
```

### **Transacao**
```typescript
interface Transacao {
  id: string;
  valor: number;
  data: string;                      // YYYY-MM-DD
  categoria: Categoria;
  tag?: string;                      // Nome da tag (string simples)
  descricao: string;
  recorrencia: Recorrencia;
  datasExcluidas?: string[];
  dataFimRecorrencia?: string;
  edicoesEspecificas?: { ... };
}
```

📖 **Documentação Completa:** `src/types/index.ts`

---

## 🎯 Princípios de Arquitetura

### **1. Single Source of Truth**
- Todo dado passa obrigatoriamente por `services/storage.ts`
- Nenhuma tela acessa `AsyncStorage` diretamente

### **2. Separação de Responsabilidades**
```
Screen (UI) → Hook (orquestração) → Utils (lógica pura) → Storage (persistência)
```

### **3. Motor de Recorrência Virtual**
- Transações recorrentes são resolvidas **on-the-fly** (não persiste ocorrências)
- Suporta exclusões pontuais, edições pontuais e encerramento de série

### **4. Gasto Diário Inteligente**
- **NÃO é uma transação automática**
- É um fallback de cálculo para projeção
- Substitui-se por gastos reais automaticamente
- Respeita linha do tempo (passado/presente/futuro)

### **5. Saldo Inicial como Transação** ← ✨ v1.0.0 NOVO
- Saldo inicial é criado como transação de entrada única
- Tag especial "Saldo Inicial" (protegida, não editável via TagsScreen)
- `config.saldoInicial` é apenas referência histórica (não usado em cálculos)
- Evita dupla contagem e mantém transparência

📖 **Documentação:** `src/services/README.md` (Seção 3: Motor de Recorrência)

---

## 📊 Métricas do Projeto

- **Telas:** 12 implementadas
- **Componentes reutilizáveis:** 16
- **Hooks customizados:** 7
- **Funções de utils:** ~40
- **READMEs de documentação:** 20+
- **Cobertura TypeScript:** 100%
- **Progresso:** 98% das features planejadas

---

## ⚠️ Convenções do Projeto

### **Código**
- ✅ TypeScript strict mode
- ✅ Design tokens do theme (spacing, colors, fontSize, borderRadius)
- ✅ Formatação brasileira (4.098,72)
- ✅ Padrão: `index.tsx` + `styles.ts` + `README.md`

### **Envio de Código**
- ✅ Sempre enviar código **diretamente na conversa** (não usar artefatos)
- ✅ Separar por arquivos que precisam ser editados

### **Git**
- ✅ Commits em português
- ✅ Mensagens descritivas
- ✅ Uma feature por commit

---

## 🚀 Roadmap

### **Alta Prioridade**
- [ ] Indicador visual na coluna "diarios" (real vs estimado)
- [ ] Gráficos de distribuição de gastos por tag
- [ ] Tela de Perfil do Usuário (editar dados pessoais)

### **Média Prioridade**
- [ ] Exportação de dados (JSON/CSV)
- [ ] Comparação mensal de gastos (mês anterior vs atual)
- [ ] Histórico de mudanças no saldo inicial

### **Baixa Prioridade**
- [ ] Modo escuro
- [ ] Múltiplas moedas
- [ ] Sync com nuvem (Firebase/Supabase)

---

## 📚 Índice de Documentação

### **Arquitetura e Serviços**
- 📖 `src/services/README.md` - Storage Service (Single Source of Truth)
- 📖 `src/utils/README.md` - Funções puras e lógica de negócio
- 📖 `src/types/README.md` - Interfaces TypeScript

### **Telas Principais**
- 📖 `src/screens/ConfiguracaoInicialScreen/README.md` - Onboarding (3 steps)
- 📖 `src/screens/SaldosScreen/README.md` - Planilha mensal
- 📖 `src/screens/PanoramasScreen/README.md` - Visão trimestral
- 📖 `src/screens/TotaisScreen/README.md` ← v1.0.0 - Análise por tags
- 📖 `src/screens/CadastroScreen/README.md` - Cadastro de transações
- 📖 `src/screens/TagsScreen/README.md` ← v1.0.0 - Gerenciamento de tags
- 📖 `src/screens/DetalhesScreen/README.md` - Lista de transações
- 📖 `src/screens/MenuScreen/README.md` - Menu principal
- 📖 `src/screens/PrevisaoGastoDiarioScreen/README.md` - Edição de gastos variáveis
- 📖 `src/screens/MetaEconomiaScreen/README.md` - Definição de meta
- 📖 `src/screens/RedefinirSaldoInicialScreen/README.md` ← v1.0.0 - Redefinir saldo

### **Componentes**
- 📖 `src/components/[ComponentName]/README.md` - Documentação de cada componente

### **Changelog**
- 📖 `CHANGELOG.md` - Histórico de versões e atualizações

---

## 📝 Versão e Status

**Versão atual:** 1.0.0  
**Última atualização:** 26/12/2024  
**Status:** ✅ Sistema Completo com Identificação de Usuário + Saldo Inicial como Transação  
**Próxima feature:** Tela de Perfil do Usuário

---

**Desenvolvido com 💜 pela equipe Panorama$**
```

---

✅ **README_GERAL.md Atualizado!**

**Principais mudanças:**
- ✅ Atualizado para **12 telas** (era 11)
- ✅ Adicionada interface `UserProfile`
- ✅ Atualizada interface `Config` com campo `perfil`
- ✅ Documentado novo Step 0 no Onboarding
- ✅ Adicionada nova tela `RedefinirSaldoInicialScreen`
- ✅ Atualizado MenuScreen (4 opções)
- ✅ Novo princípio: "Saldo Inicial como Transação"
- ✅ Novas funções do Storage documentadas
- ✅ Métricas atualizadas (20+ READMEs, 98% completo)
- ✅ Roadmap atualizado
