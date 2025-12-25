```markdown
## 📊 Resumo do Projeto: Panorama$

### **Visão Geral**
Aplicativo de controle financeiro pessoal em **React Native + Expo** focado em fornecer um panorama da saúde financeira futura através de visualização em planilha.

---

## 🛠️ Stack Tecnológica

```
- Framework: Expo ~54 (Bare Workflow)
- Mobile: React Native 0.81
- Core: React 19
  - Uso criterioso de novos hooks (use) apenas quando fizer sentido arquitetural
- Linguagem: TypeScript
- Navegação: React Navigation (native-stack + bottom-tabs)
- Gestos: React Native Gesture Handler (swipe, pan)
- Persistência: AsyncStorage (local, sem backend)
- Segurança: Expo Local Authentication (Biometria)
```

---

## 🏗️ Estrutura Atual do Projeto

```
panorama$/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── CalendarTodayIcon/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── DiaListItem/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── Divider/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── EmptyState/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── FiltrosCategorias/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── GastoVariavelCard/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── HeaderMesNavegacao/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── LoadingScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── ModalEdicaoRecorrente/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── ModalExclusaoRecorrente/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── TabelaHeader/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   └── TransacaoCard/
│   │       ├── index.tsx
│   │       ├── styles.ts
│   │       └── README.md
│   │
│   ├── hooks/
│   │   ├── README.md
│   │   ├── usePanoramas.ts
│   │   ├── useSaldos.ts
│   │   ├── useSaldoStyles.ts
│   │   ├── useTransacaoForm.ts
│   │   └── useTransacoesData.ts
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx                ← ✨ ATUALIZADO (PrevisaoGastoDiario)
│   │   └── README.md
│   │
│   ├── screens/
│   │   ├── CadastroScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── ConfiguracaoInicialScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── DetalhesScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── LoginScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── MenuScreen/                     ← ✨ ATUALIZADO (Header + Opções)
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── PanoramasScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── PrevisaoGastoDiarioScreen/      ← ✅ IMPLEMENTADO (NOVA)
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── SaldosScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   ├── TagsScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── README.md
│   │   └── TotaisScreen/
│   │       ├── index.tsx
│   │       ├── styles.ts
│   │       └── README.md
│   │
│   ├── services/
│   │   ├── storage.ts                      ← ✨ ATUALIZADO (updateConfig, resetStorage)
│   │   └── README.md
│   │
│   ├── theme/
│   │   ├── colors.tsx
│   │   └── README.md
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── navigation.d.ts                 ← ✨ ATUALIZADO (PrevisaoGastoDiario)
│   │   └── README.md
│   │
│   └── utils/
│       ├── README.md
│       ├── calculoSaldo.ts
│       ├── categorias.ts
│       ├── dateUtils.ts
│       └── recorrencia.ts
│
├── .eslintrc.js
├── .gitattributes
├── .gitignore
├── app.json
├── App.tsx
├── index.js
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
├── RESUMO_PROJETO.md                       ← Este arquivo
└── tsconfig.json
```

### Padrão de Organização:
```
Componente/Tela/Feature/
├── index.tsx          # Código principal
├── styles.ts          # Estilos
└── README.md          # Documentação específica
```

### Legenda:
- ✨ **NOVO** - Arquivo/funcionalidade criada recentemente
- ✨ **ATUALIZADO** - Arquivo modificado com novas funcionalidades
- ✅ **IMPLEMENTADO** - Feature completa e funcional
- 🚧 **TODO** - Funcionalidade planejada mas não implementada

### Arquivos Críticos (Core):
- `services/storage.ts` + `README.md` - Fonte única de verdade
- `utils/calculoSaldo.ts` + `README.md` - Engine financeira
- `utils/recorrencia.ts` + `README.md` - Motor de recorrência virtual
- `types/index.ts` + `README.md` - Definições de tipos TypeScript

---

## 📋 Features Principais Implementadas

### **1. Sistema de Persistência (Storage Service)**
- ✅ AsyncStorage como fonte única da verdade
- ✅ Particionamento mensal para performance
- ✅ Motor de recorrência virtual (não cria transações físicas)
- ✅ Suporte a exclusões e edições pontuais
- ✅ Suporte a encerramento de série (`dataFimRecorrencia`)
- ✅ **updateConfig()** - Atualização parcial de configurações ← ✨ NOVO
- ✅ **resetStorage()** - Reset completo do aplicativo ← ✨ NOVO

### **2. Configuração Inicial (Onboarding)**
- ✅ Sistema de 2 steps:
  - **Step 1:** Saldo inicial + Data inicial
  - **Step 2:** Gastos variáveis mensais
- ✅ Cálculo automático do gasto diário padrão
- ✅ Escolha de divisão por 28/30/31 dias
- ✅ Componente `GastoVariavelCard` para lista de gastos

### **3. Tela de Saldos**
- ✅ Visualização mensal em formato de planilha
- ✅ **Navegação por gestos (swipe):**
  - Deslizar para direita → Mês anterior
  - Deslizar para esquerda → Próximo mês
- ✅ Coluna "diarios" com lógica inteligente:
  - Passado sem gasto → R$ 0,00
  - Hoje sem gasto → Gasto estimado
  - Futuro → Projeção com gasto estimado
  - Qualquer dia COM gasto real → Valor real
- ✅ Scroll inteligente para o dia atual
- ✅ Conciliação de dias
- ✅ Filtros por categoria
- ✅ Feedback haptic em gestos

### **4. Tela de Panoramas**
- ✅ Visualização trimestral (3 meses lado a lado)
- ✅ Layout em 3 colunas verticais independentes
- ✅ Exibe apenas dia e saldo acumulado
- ✅ **Navegação por gestos (swipe):**
  - Deslizar para direita → Trimestre anterior (-3 meses)
  - Deslizar para esquerda → Próximo trimestre (+3 meses)
- ✅ Header customizado com título trimestral (ex: "Jan/25 - Mar/25")
- ✅ Botão "Ir para trimestre atual" (CalendarTodayIcon)
- ✅ Destaque visual de fins de semana (roxo)
- ✅ Cores dinâmicas de saldo (verde/vermelho/cinza)
- ✅ Formatação abreviada de moeda (R$ 5,0 mil)
- ✅ Scroll independente por coluna
- ✅ Feedback haptic em gestos

### **5. Tela de Menu** ← ✨ ATUALIZADA
- ✅ Header com botão de voltar centralizado
- ✅ Opção: **Previsão de Gasto Diário** → Abre modal de edição
- ✅ Opção: **Reiniciar Panoramas** → Reset completo com confirmação
- ✅ Alert de segurança com descrição detalhada dos dados que serão perdidos
- ✅ Navegação reset (não permite voltar após reset)
- ✅ Footer informativo com versão do app

### **6. Tela de Previsão de Gasto Diário** ← ✅ IMPLEMENTADO (NOVA)
- ✅ Edição de gastos variáveis pós-onboarding
- ✅ Modal bottom-sheet para adicionar novos gastos
- ✅ Lista de gastos com `GastoVariavelCard`
- ✅ Remoção com confirmação
- ✅ Escolha de divisão (28/30/31 dias)
- ✅ Cálculo automático do gasto diário
- ✅ Resumo visual com destaque
- ✅ Formatação de valor idêntica ao CadastroScreen
- ✅ Validações completas (título, valor, mínimo 1 gasto)
- ✅ Info box explicando comportamento inteligente
- ✅ Persistência via `updateConfig()`
- ✅ Atualização automática em Saldos e Panoramas

### **7. Cadastro de Transações**
- ✅ Suporte a transações únicas e recorrentes
- ✅ Categorias: entradas, saídas, diários, cartão, economia
- ✅ Recorrências: única, diária, semanal, quinzenal, cada21dias, cada28dias, mensal
- ✅ Sistema de tags
- ✅ Edição de ocorrências pontuais vs série completa

### **8. Detalhes de Transações**
- ✅ Lista de transações por dia
- ✅ Filtros por categoria
- ✅ Exclusão com opções:
  - Apenas esta ocorrência
  - **Desta data em diante**
  - Todas as ocorrências

---

## 🆕 Implementações Recentes (Sessão Atual)

### **1. Tela de Menu Completa** ← ✨ FEATURE IMPLEMENTADA

**Arquivos criados/atualizados:**
```typescript
// screens/MenuScreen/index.tsx - REFATORADO
- Header customizado com botão de voltar
- 2 opções principais: Previsão e Reset
- Navegação para PrevisaoGastoDiario
- Sistema de reset com confirmação
- Footer informativo

// screens/MenuScreen/styles.ts - ATUALIZADO
- Estilos do header centralizado
- Cards de menu com ícones coloridos
- Estilo especial para opção perigosa (Reset)
- Footer com versão do app
```

**Comportamento:**
- Header com 3 elementos: botão voltar (esquerda), título+subtítulo (centro), espaço vazio (direita)
- Opção 1: Ícone de calculadora roxo → Abre PrevisaoGastoDiarioScreen
- Opção 2: Ícone de lixeira vermelho → Alert de confirmação → Reset completo
- Footer: "Panorama$ v2.0.0" + "Controle financeiro inteligente"

---

### **2. Tela de Previsão de Gasto Diário** ← ✅ NOVA FEATURE COMPLETA

**Arquivos criados:**
```typescript
// screens/PrevisaoGastoDiarioScreen/index.tsx
export default function PrevisaoGastoDiarioScreen() {
  // Estados
  const [gastosVariaveis, setGastosVariaveis] = useState<GastoVariavel[]>([]);
  const [diasParaDivisao, setDiasParaDivisao] = useState<28 | 30 | 31>(30);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Funções
  carregarDados();
  calcularGastoDiario();
  formatarValorInput();
  converterValorParaNumero();
  handleAdicionarGasto();
  handleRemoverGasto();
  handleSalvar();
}

// screens/PrevisaoGastoDiarioScreen/styles.ts
- Header roxo consistente com CadastroScreen
- Info box roxo claro no topo
- Botões de divisão (28/30/31) com estado ativo
- Empty state ilustrado
- Resumo com valores destacados
- Modal bottom-sheet com KeyboardAvoidingView
- Input de valor grande e destacado (R$ cifrao)

// screens/PrevisaoGastoDiarioScreen/README.md
- Documentação completa da feature
- Fluxo de dados detalhado
- Exemplos de uso práticos
- Integração com outras telas
- Roadmap de melhorias
```

**Lógica de Funcionamento:**
```typescript
// 1. Carrega config atual
const config = await getConfig();
setGastosVariaveis(config.gastosVariaveis);
setDiasParaDivisao(config.diasParaDivisao);

// 2. Usuário adiciona/remove/edita gastos
// Interface: Modal → Título + Descrição (opcional) + Valor

// 3. Cálculo automático
const total = gastosVariaveis.reduce((acc, g) => acc + g.valor, 0);
const gastoDiario = total / diasParaDivisao;

// 4. Salvar
await updateConfig({
  gastosVariaveis,
  diasParaDivisao,
  gastoDiarioPadrao: gastoDiario,
});

// 5. Propagação automática
// SaldosScreen e PanoramasScreen usam getConfig() no mount
// Próxima visita → novo gastoDiarioPadrao aplicado automaticamente
```

**Layout Visual:**
```
┌─────────────────────────────────────────┐
│  ←  Previsão de Gasto Diário            │ ← Header roxo
├─────────────────────────────────────────┤
│ ℹ️  Este valor será usado como...       │ ← Info box
├─────────────────────────────────────────┤
│ Dividir gastos por:                     │
│ [28] [30✓] [31]                         │ ← Botões de divisão
├─────────────────────────────────────────┤
│ Gastos Variáveis        [+ Adicionar]   │
│ ┌─────────────────────────────────────┐ │
│ │ 🛒 Aluguel        R$ 1.200,00  🗑️   │ │
│ │    Apartamento Centro               │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🛒 Condomínio     R$ 300,00    🗑️   │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Total mensal:           R$ 1.500,00     │ ← Resumo
│ Divisão por:            30 dias         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Gasto diário:           R$ 50,00        │ ← Destaque roxo
├─────────────────────────────────────────┤
│        [Salvar Alterações]              │ ← Botão fixo
└─────────────────────────────────────────┘

Modal (bottom-sheet):
┌─────────────────────────────────────────┐
│ Novo Gasto Variável              ✕      │
├─────────────────────────────────────────┤
│ Título (Obrigatório)                    │
│ [Ex: Aluguel                    ]       │
│                                         │
│ Descrição (Opcional)                    │
│ [Ex: Vence todo dia 10          ]       │
│                                         │
│ Valor Mensal                            │
│ ┌───────────────────────────────────┐   │
│ │ R$  1.500,00                      │   │ ← Grande e destacado
│ └───────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  [Cancelar]           [Adicionar]       │
└─────────────────────────────────────────┘
```

**Comportamento Inteligente (Integração com calcularTotaisDia):**
```typescript
// ANTES de salvar novo valor:
Dia 10/Dez (passado sem gasto) = R$ 0,00
Dia 23/Dez (hoje sem gasto) = R$ 50,00 (antigo)
Dia 25/Dez (futuro sem gasto) = R$ 50,00 (antigo)

// DEPOIS de salvar novo valor (R$ 60,00):
Dia 10/Dez (passado sem gasto) = R$ 0,00 (mantém zerado!)
Dia 23/Dez (hoje sem gasto) = R$ 60,00 (atualizado!)
Dia 25/Dez (futuro sem gasto) = R$ 60,00 (atualizado!)

// Gastos reais SEMPRE têm prioridade:
Dia 24/Dez (com gasto real de R$ 80) = R$ 80,00 (ignora padrão)
```

---

### **3. Sistema de Reset Completo** ← ✨ NOVA FUNCIONALIDADE

**Arquivo atualizado:**
```typescript
// services/storage.ts - Nova função
export async function resetStorage(): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const panoramaKeys = allKeys.filter((key) => key.startsWith('@panorama$:'));
    await AsyncStorage.multiRemove(panoramaKeys);
  } catch (error) {
    console.error('Erro ao resetar storage:', error);
    throw error;
  }
}
```

**Fluxo Completo:**
```
MenuScreen → Toca "Reiniciar Panoramas"
    ↓
Alert.alert (modal de confirmação)
    ↓
Texto detalhado:
    "Você está prestes a APAGAR TODOS OS DADOS:
     • Todas as transações
     • Todas as tags
     • Todas as configurações
     • Gastos variáveis
     • Dias conciliados
     
     Esta ação NÃO PODE SER DESFEITA!"
    ↓
Botões: [Cancelar] [Sim, apagar tudo] (destrutivo)
    ↓
confirmarReset()
    ↓
await resetStorage()
    ↓
navigation.dispatch(CommonActions.reset({
  index: 0,
  routes: [{ name: 'ConfiguracaoInicial' }],
}))
    ↓
Usuário volta para onboarding (sem histórico de navegação)
```

---

### **4. Atualização da Navegação** ← ✨ ROTAS ATUALIZADAS

**Arquivo modificado:**
```typescript
// navigation/AppNavigator.tsx
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Saldos" ... />
      <Tab.Screen name="Totais" ... />
      <Tab.Screen name="AddPlaceholder" ... /> {/* Botão central + */}
      <Tab.Screen name="Panoramas" ... />
      <Tab.Screen name="Tags" ... />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" ... />
      <Stack.Screen name="ConfiguracaoInicial" ... />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Cadastro" ... presentation="modal" />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen 
        name="PrevisaoGastoDiario" 
        component={PrevisaoGastoDiarioScreen}
        options={{ presentation: "modal" }} // ← NOVO
      />
    </Stack.Navigator>
  );
}
```

**Estrutura Final:**
```
App
├── Stack Navigator (RootStack)
│   ├── Login
│   ├── ConfiguracaoInicial
│   ├── MainTabs (Tab Navigator)
│   │   ├── Saldos
│   │   ├── Totais
│   │   ├── [Botão +] → Cadastro (modal)
│   │   ├── Panoramas
│   │   └── Tags
│   ├── Cadastro (modal)
│   ├── Menu (stack screen) ← ✨ ATUALIZADO
│   └── PrevisaoGastoDiario (modal) ← ✨ NOVO
```

**Types atualizados:**
```typescript
// types/navigation.d.ts
export type RootStackParamList = {
  Login: undefined;
  ConfiguracaoInicial: undefined;
  MainTabs: undefined;
  Cadastro: { transacaoId?: string; data?: string; categoria?: string } | undefined;
  Menu: undefined;
  PrevisaoGastoDiario: undefined; // ← NOVO
};

export type TabParamList = {
  Saldos: undefined;
  Totais: undefined;
  AddPlaceholder: undefined;
  Panoramas: undefined;
  Tags: undefined;
};
```

---

## 📚 Documentação Atualizada

### **Arquivos de README criados/atualizados:**

1. ✅ **screens/PrevisaoGastoDiarioScreen/README.md** ← ✨ NOVO
   - Visão geral da feature de edição
   - Fluxo de dados completo
   - Lógica de cálculo e comportamento inteligente
   - Tabela de comportamento por período
   - Layout e UX detalhados
   - Validações e tratamento de erros
   - Integração com SaldosScreen e PanoramasScreen
   - Casos de uso práticos
   - Roadmap de melhorias futuras

2. ✅ **screens/MenuScreen/README.md** ← Precisa ser criado
   - Estrutura do menu
   - Opções disponíveis
   - Fluxo de reset completo
   - Integração com PrevisaoGastoDiario

3. ✅ **services/README.md** (storage-service) ← Precisa atualização
   - Documentar `updateConfig()`
   - Documentar `resetStorage()`
   - Explicar segurança do reset

---

## 🎯 Regras de Negócio Críticas

### **Motor de Recorrência Virtual**
- Transações recorrentes são resolvidas **on-the-fly** (não persiste ocorrências)
- Suporta exclusões pontuais (`datasExcluidas`)
- Suporta edições pontuais (`edicoesEspecificas`)
- Suporta encerramento de série (`dataFimRecorrencia`)

### **Gasto Diário**
- **NÃO é uma transação automática**
- É um fallback de cálculo para projeção
- Substitui-se automaticamente por gastos reais
- Respeita a linha do tempo (passado/presente/futuro)
- Usado tanto na tela de Saldos quanto na de Panoramas
- **Editável pós-onboarding** via MenuScreen → PrevisaoGastoDiario ← ✨ NOVO

### **Sistema de Reset**
- ✅ Remove TODAS as chaves `@panorama$:` do AsyncStorage
- ✅ Não permite recuperação (irreversível)
- ✅ Alert de confirmação com descrição detalhada
- ✅ Reset de navegação (não permite voltar)
- ✅ Retorna para ConfiguracaoInicialScreen

### **Navegação por Gestos**
- Swipe horizontal sobre listas/scrollviews
- Threshold de 50px evita mudanças acidentais
- Não interfere com scroll vertical
- Feedback haptic em todas as mudanças
- Implementado em: SaldosScreen (mensal) e PanoramasScreen (trimestral)

### **Separação de Responsabilidades**
- ❌ Proibido calcular regras financeiras na UI
- ✅ Lógica de negócio exclusiva em `hooks` ou `utils`
- ✅ Storage é a única fonte de verdade
- ✅ Componentes são "burros" (apenas apresentação)
- ✅ Hooks orquestram estado e efeitos colaterais

---

## 🔄 Fluxo de Dados Típico

```
User Interaction
      ↓
Screen (apenas UI)
      ↓
Hook (orquestrador)
      ↓
Storage Service (leitura/escrita)
      ↓
Utils (cálculos puros)
      ↓
Hook (atualiza estado)
      ↓
Screen (re-renderiza)
```

### Exemplo: Edição de Gasto Diário
```
MenuScreen → Toca "Previsão de Gasto Diário"
      ↓
navigation.navigate("PrevisaoGastoDiario")
      ↓
PrevisaoGastoDiarioScreen monta
      ↓
useEffect → carregarDados()
      ↓
getConfig() → gastosVariaveis, diasParaDivisao
      ↓
Usuário adiciona "Netflix: R$ 45"
      ↓
setGastosVariaveis([...gastosVariaveis, novoGasto])
      ↓
calcularGastoDiario() → novo valor (ex: R$ 55 → R$ 60)
      ↓
Usuário toca "Salvar Alterações"
      ↓
updateConfig({ gastosVariaveis, diasParaDivisao, gastoDiarioPadrao: 60 })
      ↓
AsyncStorage.setItem("@panorama$:config", JSON.stringify(config))
      ↓
Alert.alert("Sucesso") → navigation.goBack()
      ↓
Usuário volta para MenuScreen
      ↓
Próxima visita ao SaldosScreen/PanoramasScreen
      ↓
getConfig() retorna novo gastoDiarioPadrao (60)
      ↓
calcularTotaisDia() usa 60 para dias futuros sem gasto
      ↓
Tela re-renderiza com nova projeção
```

---

## 🚀 Próximas Features (Roadmap)

### **Alta Prioridade**
- [x] **Tela de edição de gastos variáveis (pós-onboarding)** ← ✅ CONCLUÍDO
- [ ] Indicador visual na coluna "diarios" (real vs estimado)
- [ ] Scroll sincronizado entre colunas do Panorama
- [ ] Highlight do dia atual nas 3 colunas do Panorama
- [ ] README.md do MenuScreen

### **Média Prioridade**
- [ ] Gráficos de distribuição de gastos
- [ ] Exportação de dados (JSON/CSV)
- [ ] Sistema de metas financeiras
- [ ] Alertas de gastos acima da estimativa
- [ ] Tap no dia do Panorama para abrir detalhes
- [ ] Indicador de conciliação no Panorama
- [ ] Edição inline de gastos na PrevisaoGastoDiario

### **Baixa Prioridade**
- [ ] Modo escuro
- [ ] Múltiplas moedas
- [ ] Sync com nuvem (Firebase/Supabase)
- [ ] Compartilhamento de orçamento
- [ ] Animações de transição entre períodos
- [ ] Toggle 3/6 meses no Panorama
- [ ] Comparação entre trimestres diferentes
- [ ] Histórico de mudanças de gastos variáveis

---

## ⚠️ Pontos de Atenção para Próxima Sessão

### **1. Convenções Importantes**
- Sempre enviar código **diretamente na conversa** (não usar artefatos)
- Separar por arquivos que precisam ser editados
- Usar tokens do theme (`spacing`, `colors`, `fontSize`, `borderRadius`, `typography`)
- Manter padrão de organização: `index.tsx` + `styles.ts` + `README.md`

### **2. Limitações Atuais**
- **Panoramas:** Dia atual não destacado visualmente
- **Panoramas:** Dias conciliados não exibidos (campo existe mas não renderizado)
- **PrevisaoGastoDiario:** Não existe edição inline (só adicionar/remover)
- **PrevisaoGastoDiario:** Não há validação de duplicatas em gastos variáveis
- **MenuScreen:** Falta README.md documentando a feature

### **3. Dependências entre Features**
```
Config Inicial → Saldos → Panoramas
     ↓              ↓         ↓
gastoDiarioPadrao  Usa o padrão para cálculos e projeções
     ↓
     ↓ (editável via)
MenuScreen → PrevisaoGastoDiario ← ✨ NOVO
     ↓
updateConfig() → AsyncStorage
     ↓
calcularTotaisDia (utils/calculoSaldo.ts)
     ↓
calcularSaldosMes / calcularSaldosTrimestre
```

### **4. Requisitos do Gesture Handler**
- `GestureHandlerRootView` deve envolver a raiz do app (AppNavigator)
- `<View collapsable={false}>` necessário ao envolver FlatList/ScrollView
- Import correto: `react-native-gesture-handler`
- `.activeOffsetX([-50, 50])` para evitar conflito com scroll vertical

### **5. Arquivos Críticos para PrevisaoGastoDiario**
```typescript
// Tela principal
screens/PrevisaoGastoDiarioScreen/index.tsx

// Persistência
services/storage.ts → updateConfig()

// Componentes reutilizados
components/GastoVariavelCard → exibição + remoção
components/LoadingScreen → estado de carregamento

// Integração
screens/SaldosScreen → usa gastoDiarioPadrao via getConfig()
screens/PanoramasScreen → usa gastoDiarioPadrao via getConfig()
utils/calculoSaldo.ts → calcularTotaisDia() aplica a lógica
```

---

## 📝 Estrutura de Interfaces Principais

```typescript
// Config (base do app)
interface Config {
  saldoInicial: number;
  dataInicial: string;
  gastosVariaveis: GastoVariavel[];
  diasParaDivisao: 28 | 30 | 31;
  gastoDiarioPadrao: number;
  percentualEconomia: number;
  onboardingCompleto: boolean;
}

// GastoVariavel (gastos mensais fixos)
interface GastoVariavel {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
}

// Transação (modelo de dados)
interface Transacao {
  id: string;
  valor: number;
  data: string;
  categoria: Categoria;
  tag?: string;
  descricao: string;
  recorrencia: Recorrencia;
  datasExcluidas?: string[];
  dataFimRecorrencia?: string;
  edicoesEspecificas?: { [data: string]: Partial<...> };
}

// SaldoDia (resultado de cálculo)
interface SaldoDia {
  dia: number;
  entradas: number;
  saidas: number;
  diarios: number;
  cartao: number;
  economia: number;
  saldoAcumulado: number;
  conciliado: boolean;
}

// SaldoTrimestreColuna (específico do Panorama)
interface SaldoTrimestreColuna {
  mes: Date;
  saldos: SaldoDia[];
}
```

---

## ✅ Estado Atual do Projeto

**Funcionalidades Completas:**
- ✅ Onboarding com gastos variáveis (2 steps)
- ✅ Tela de Saldos com gasto diário inteligente
- ✅ Tela de Panoramas com visualização trimestral
- ✅ **Tela de Menu com 2 opções principais** ← ✨ IMPLEMENTADO
- ✅ **Tela de Previsão de Gasto Diário (edição pós-onboarding)** ← ✅ NOVO
- ✅ **Sistema de Reset Completo do App** ← ✅ NOVO
- ✅ Navegação por swipe (mensal e trimestral)
- ✅ Cadastro de transações (únicas e recorrentes)
- ✅ Detalhes por dia com filtros
- ✅ Sistema de recorrência completo
- ✅ Exclusão granular (apenas esta, desta em diante, todas)
- ✅ Conciliação de dias

**Qualidade do Código:**
- ✅ TypeScript strict
- ✅ Separação de responsabilidades (Screen/Hook/Utils)
- ✅ Documentação técnica completa (READMEs)
- ✅ Design tokens consistentes (theme)
- ✅ Gestos nativos implementados (Gesture Handler)
- ✅ Interfaces bem definidas
- ✅ **Padrão de formatação de valor consistente** ← ✨ MELHORADO

**Performance:**
- ✅ Particionamento mensal (storage)
- ✅ Cache strategy implícito (useFocusEffect)
- ✅ Cálculos otimizados (recursão eficiente)
- ✅ Gestos performáticos (activeOffsetX)
- ✅ Re-renders minimizados (useMemo, useCallback)
- ✅ **updateConfig parcial** (não reescreve tudo) ← ✨ OTIMIZADO

**UX/UI:**
- ✅ Navegação intuitiva por gestos
- ✅ Scroll inteligente para dia atual (Saldos)
- ✅ Feedback visual de ações (cores dinâmicas)
- ✅ Feedback haptic em gestos
- ✅ Interface responsiva
- ✅ Loading states apropriados
- ✅ Destaque de fins de semana (Panoramas)
- ✅ Formatação inteligente de valores (abreviação)
- ✅ **Modais consistentes (Cadastro, PrevisaoGastoDiario)** ← ✨ PADRONIZADO
- ✅ **Alerts de confirmação para ações destrutivas** ← ✨ IMPLEMENTADO

---

## 📊 Métricas do Projeto

- **Telas implementadas:** 8 (Config, Saldos, Panoramas, Cadastro, Detalhes, Login, **Menu**, **PrevisaoGastoDiario** ← ✨ +2)
- **Componentes reutilizáveis:** ~13
- **Hooks customizados:** ~6
- **Funções de utils:** ~32 (**updateConfig**, **resetStorage** ← ✨ +2)
- **Documentação:** 6 READMEs completos (**PrevisaoGastoDiarioScreen/README.md** ← ✨ +1, MenuScreen/README.md pendente)
- **Cobertura TypeScript:** 100%
- **Gestos implementados:** Swipe horizontal (navegação mensal e trimestral)
- **Features prontas para uso:** 8/10 planejadas (~80%) ← ✨ PROGRESSO

**Última atualização:** 23/12/2024  
**Versão:** 1.0.0  
**Status:** ✅ Menu + Previsão de Gasto Diário + Reset Implementados

---

## 🎉 Conquistas da Sessão

1. ✅ **Tela de Menu funcional** com header e 2 opções
2. ✅ **Tela de Previsão de Gasto Diário** completa (modal, validações, persistência)
3. ✅ **Sistema de Reset** com confirmação segura
4. ✅ **updateConfig() e resetStorage()** no storage service
5. ✅ **Navegação atualizada** com rotas corretas
6. ✅ **Types atualizados** para novas telas
7. ✅ **Padrão de código consistente** em todo o projeto
8. ✅ **Formatação de valor padronizada** entre telas
9. ✅ **Integração completa** entre Menu, Previsão e cálculos de saldo

```


