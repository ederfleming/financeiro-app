# 📊 Panorama$ - Controle Financeiro Pessoal

## 🎯 Visão Geral

**Panorama$** é um aplicativo de controle financeiro pessoal desenvolvido em **React Native + Expo**, focado em fornecer visualização clara da saúde financeira futura através de planilhas interativas e projeções inteligentes.

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
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── TransacaoCard/
│   │   ├── GastoVariavelCard/
│   │   └── ... (13 componentes)
│   │
│   ├── hooks/               # Hooks customizados
│   │   ├── useSaldos.ts
│   │   ├── usePanoramas.ts
│   │   ├── useTransacaoForm.ts
│   │   ├── useTagsScreen.ts  ← ✨ NOVO
│   │   └── ... (6 hooks)
│   │
│   ├── screens/             # Telas do app
│   │   ├── LoginScreen/
│   │   ├── ConfiguracaoInicialScreen/
│   │   ├── SaldosScreen/
│   │   ├── PanoramasScreen/
│   │   ├── CadastroScreen/
│   │   ├── DetalhesScreen/
│   │   ├── TotaisScreen/
│   │   ├── MenuScreen/
│   │   ├── PrevisaoGastoDiarioScreen/
│   │   ├── MetaEconomiaScreen/
│   │   └── TagsScreen/      ← ✨ ATUALIZADO
│   │
│   ├── services/            # Camada de persistência
│   │   ├── storage.ts       # AsyncStorage (Single Source of Truth)
│   │   └── README.md
│   │
│   ├── utils/               # Funções puras
│   │   ├── calculoSaldo.ts
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
- **Sistema de Tags por Categoria** ← ✨ NOVO
- Função `updateConfig()` para atualizações parciais
- Função `resetStorage()` para reset completo

📖 **Documentação:** `src/services/README.md`

---

### **2. Onboarding** → `ConfiguracaoInicialScreen`
- Step 1: Saldo inicial + Data inicial
- Step 2: Gastos variáveis mensais
- Cálculo automático do gasto diário padrão
- Escolha de divisão (28/30/31 dias)

📖 **Documentação:** `src/screens/ConfiguracaoInicialScreen/README.md`

---

### **3. Tela de Saldos** → `SaldosScreen`
- Visualização mensal em formato de planilha
- Navegação por swipe (gestos horizontais)
- Coluna "diarios" com lógica inteligente:
  - Passado sem gasto = R$ 0,00
  - Hoje/Futuro sem gasto = estimativa
  - Com gasto real = valor real
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

### **5. Cadastro de Transações** → `CadastroScreen`
- Transações únicas e recorrentes
- 5 categorias: entradas, saídas, diários, cartão, economia
- **Sistema de tags filtrado por categoria** ← ✨ ATUALIZADO
- Edição de ocorrências pontuais vs série completa
- Exclusão granular (apenas esta, desta em diante, todas)

📖 **Documentação:** `src/screens/CadastroScreen/README.md`

---

### **6. Sistema de Tags** → `TagsScreen` ← ✨ NOVO
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

---

### **7. Tela de Menu** → `MenuScreen`
- 3 opções principais:
  1. 🧮 Previsão de Gasto Diário (roxo)
  2. 📈 Meta de Economia (verde)
  3. 🗑️ Reiniciar Panoramas (vermelho)
- Footer com versão do app

📖 **Documentação:** `src/screens/MenuScreen/README.md`

---

### **8. Previsão de Gasto Diário** → `PrevisaoGastoDiarioScreen`
- Edição de gastos variáveis pós-onboarding
- Modal para adicionar novos gastos
- Cálculo automático do gasto diário
- Escolha de divisão (28/30/31 dias)
- Integração automática com Saldos e Panoramas

📖 **Documentação:** `src/screens/PrevisaoGastoDiarioScreen/README.md`

---

### **9. Meta de Economia** → `MetaEconomiaScreen`
- Cálculo automático de média mensal de entradas
- Slider interativo (0% a 100%)
- 2 inputs sincronizados (% e R$)
- Persistência via `updateConfig({ percentualEconomia })`
- Uso futuro: TotaisScreen (comparação Meta vs Real)

📖 **Documentação:** `src/screens/MetaEconomiaScreen/README.md`

---

### **10. Detalhes de Transações** → `DetalhesScreen`
- Lista de transações por dia
- Filtros por categoria
- **Exibição de tags nos cards** ← ✨ ATUALIZADO
- Exclusão com múltiplas opções

📖 **Documentação:** `src/screens/DetalhesScreen/README.md`

---

## 🔄 Interfaces de Dados Principais

### **Config** (base do app)
```typescript
interface Config {
  saldoInicial: number;
  dataInicial: string;
  gastosVariaveis: GastoVariavel[];
  diasParaDivisao: 28 | 30 | 31;
  gastoDiarioPadrao: number;
  percentualEconomia: number;        // 0 a 100
  onboardingCompleto: boolean;
}
```

### **TagsPorCategoria** ← ✨ NOVO
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

📖 **Documentação completa:** `src/types/README.md`

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

📖 **Documentação:** `src/utils/README.md`

---

## 📊 Métricas do Projeto

- **Telas:** 10 implementadas
- **Componentes reutilizáveis:** 13
- **Hooks customizados:** 6
- **Funções de utils:** ~35
- **READMEs de documentação:** 15+
- **Cobertura TypeScript:** 100%
- **Progresso:** ~90% das features planejadas

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
- [ ] TotaisScreen com análise de gastos por tags
- [ ] Scroll sincronizado entre colunas do Panorama
- [ ] Highlight do dia atual no Panorama

### **Média Prioridade**
- [ ] Gráficos de distribuição de gastos
- [ ] Exportação de dados (JSON/CSV)
- [ ] Alertas de gastos acima da estimativa
- [ ] Edição inline de gastos variáveis

### **Baixa Prioridade**
- [ ] Modo escuro
- [ ] Múltiplas moedas
- [ ] Sync com nuvem (Firebase/Supabase)
- [ ] Compartilhamento de orçamento

---

## 📚 Documentação Completa

Cada feature possui documentação detalhada em seu respectivo `README.md`:

### **Services**
- `src/services/README.md` - Motor de Persistência (Storage Service)

### **Screens**
- `src/screens/TagsScreen/README.md` ← ✨ NOVO
- `src/screens/MenuScreen/README.md`
- `src/screens/MetaEconomiaScreen/README.md`
- `src/screens/PrevisaoGastoDiarioScreen/README.md`
- `src/screens/CadastroScreen/README.md` ← ✨ ATUALIZADO
- `src/screens/SaldosScreen/README.md`
- `src/screens/PanoramasScreen/README.md`
- ... (outros)

### **Components**
- `src/components/TransacaoCard/README.md` ← ✨ ATUALIZADO
- `src/components/GastoVariavelCard/README.md`
- ... (outros)

---

## 📝 Versão e Status

**Versão atual:** 1.0.0 
**Última atualização:** 25/12/2024  
**Status:** ✅ Sistema de Tags por Categoria Implementado  
**Próxima feature:** TotaisScreen com análise por tags

---

**Desenvolvido com 💜 pela equipe Panorama$**