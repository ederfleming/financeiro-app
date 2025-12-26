# 🎛️ README da MenuScreen

---

## `src/screens/MenuScreen/README.md`

```markdown
# 🎛️ MenuScreen - Central de Configurações

## 📋 Visão Geral

A **MenuScreen** é a central de configurações e opções avançadas do Panorama$. Fornece acesso rápido a ajustes de previsões financeiras, metas de economia e função destrutiva de reset completo do aplicativo.

**Objetivo:** Centralizar configurações pós-onboarding em uma interface limpa e organizada, separando funções comuns (roxo/verde) de ações críticas (vermelho).

---

## 🎯 Funcionalidades Principais

### **1. Previsão de Gasto Diário** (Roxo)
- Navega para `PrevisaoGastoDiarioScreen`
- Permite editar gastos variáveis mensais
- Ajusta divisão de dias (28/30/31)
- Recalcula automaticamente o gasto diário padrão

**Uso:** Quando o usuário precisa ajustar suas despesas fixas mensais ou alterar o método de divisão para cálculo diário.

### **2. Meta de Economia** (Verde)
- Navega para `MetaEconomiaScreen`
- Define percentual de economia mensal (0% a 100%)
- Calcula automaticamente valor em R$ baseado em entradas
- Persiste meta no Config para uso futuro na TotaisScreen

**Uso:** Quando o usuário quer estabelecer ou ajustar sua meta de economia mensal.

### **3. Reiniciar Panoramas** (Vermelho)
- Ação destrutiva com confirmação obrigatória
- Remove TODOS os dados do AsyncStorage
- Reseta aplicativo para estado inicial (onboarding)
- Sem histórico de navegação (impossível voltar)

**Uso:** Reset completo para recomeçar do zero, testes, ou recuperação de estado corrompido.

---

## 🏗️ Arquitetura

### **Componentes da Tela**

```
MenuScreen (SafeAreaView)
    ├── Header (flexível)
    │   ├── Botão Voltar (esquerda)
    │   ├── Título + Subtítulo (centro)
    │   └── Espaço vazio (direita, simetria)
    │
    ├── Menu List (flex 1)
    │   ├── Item 1: Previsão de Gasto Diário (roxo)
    │   ├── Item 2: Meta de Economia (verde)
    │   └── Item 3: Reiniciar Panoramas (vermelho)
    │
    └── Footer (fixo)
        ├── Versão do app (v1.0.0)
        └── Tagline
```

### **Estrutura de MenuItem**

```typescript
interface MenuItem {
  icon: string;              // Nome do ícone Ionicons
  iconColor: string;         // Cor do ícone
  backgroundColor: string;   // Cor de fundo do container
  title: string;             // Título principal
  description: string;       // Descrição auxiliar
  onPress: () => void;       // Ação ao clicar
  danger?: boolean;          // Se true, aplica estilo de perigo
}
```

---

## 🎨 Interface Visual

### **Layout Completo**

```
┌─────────────────────────────────────┐
│ ←           Menu                    │
│     Configurações e opções          │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🧮  Previsão de Gasto Diário  ▶ │ │ (Roxo)
│ │     Edite seus gastos variáveis │ │
│ │     mensais                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📈  Meta de Economia          ▶ │ │ (Verde)
│ │     Defina quanto quer          │ │
│ │     economizar por mês          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🗑️  Reiniciar Panoramas       ▶ │ │ (Vermelho)
│ │     Apaga todos os dados e      │ │
│ │     reinicia o app              │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│        Panorama$ v1.0.0             │
│   Controle financeiro inteligente   │
└─────────────────────────────────────┘
```

### **Alert de Confirmação (Reset)**

```
┌─────────────────────────────────────┐
│ ⚠️ Atenção: Ação Irreversível       │
├─────────────────────────────────────┤
│                                     │
│ Você está prestes a APAGAR TODOS OS │
│ DADOS do aplicativo:                │
│                                     │
│ • Todas as transações               │
│ • Todas as tags                     │
│ • Todas as configurações            │
│ • Gastos variáveis                  │
│ • Meta de economia                  │
│ • Dias conciliados                  │
│                                     │
│ Esta ação NÃO PODE SER DESFEITA!    │
│                                     │
│ Deseja realmente continuar?         │
│                                     │
├─────────────────────────────────────┤
│ [Cancelar]    [Sim, apagar tudo]   │
└─────────────────────────────────────┘
```

---

## 🔄 Fluxos de Interação

### **Fluxo 1: Editar Previsão de Gasto Diário**

```
Usuário na MainTabs (qualquer aba)
    ↓
Acessa MenuScreen via botão/header
    ↓
Clica em "Previsão de Gasto Diário"
    ↓
navigation.navigate("PrevisaoGastoDiario")
    ↓
PrevisaoGastoDiarioScreen abre como modal
    ↓
Usuário edita gastos variáveis
    ↓
Clica em "Salvar"
    ↓
await updateConfig({ gastosVariaveis, gastoDiarioPadrao })
    ↓
Modal fecha automaticamente
    ↓
Volta para MenuScreen
    ↓
(Opcional) Usuário volta para MainTabs
```

### **Fluxo 2: Definir Meta de Economia**

```
Usuário na MenuScreen
    ↓
Clica em "Meta de Economia"
    ↓
navigation.navigate("MetaEconomia")
    ↓
MetaEconomiaScreen abre como modal
    ↓
Sistema calcula média de entradas
    ↓
Se média === 0 → Modal de estimativa
Se média > 0 → Exibe total
    ↓
Usuário ajusta % via slider/inputs
    ↓
Clica em "Salvar Meta"
    ↓
await updateConfig({ percentualEconomia })
    ↓
Toast de sucesso
    ↓
Modal fecha automaticamente
    ↓
Volta para MenuScreen
```

### **Fluxo 3: Reiniciar Panoramas (Reset Completo)**

```
Usuário na MenuScreen
    ↓
Clica em "Reiniciar Panoramas"
    ↓
Alert.alert() com lista detalhada
    ↓
Usuário lê o aviso
    ↓
OPÇÃO A: Clica "Cancelar"
    ↓
    Alert fecha
    Permanece na MenuScreen
    Nenhuma ação realizada

OPÇÃO B: Clica "Sim, apagar tudo"
    ↓
    confirmarReset() executado
    ↓
    await resetStorage()
    ↓
    AsyncStorage.getAllKeys()
    ↓
    Filtra chaves '@panorama$:*'
    ↓
    AsyncStorage.multiRemove([...keys])
    ↓
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'ConfiguracaoInicial' }]
    }))
    ↓
    App volta para onboarding
    Sem histórico de navegação
    Stack limpo
    ↓
    Usuário precisa refazer onboarding completo
```

---

## 🔧 Funções Principais

### **handlePrevisaoGastoDiario()**
```typescript
function handlePrevisaoGastoDiario() {
  navigation.navigate("PrevisaoGastoDiario");
}
```
**Objetivo:** Navegar para tela de edição de gastos variáveis (modal).

---

### **handleMetaEconomia()**
```typescript
function handleMetaEconomia() {
  navigation.navigate("MetaEconomia");
}
```
**Objetivo:** Navegar para tela de definição de meta de economia (modal).

---

### **handleReiniciarPanoramas()**
```typescript
function handleReiniciarPanoramas() {
  Alert.alert(
    "⚠️ Atenção: Ação Irreversível",
    "Você está prestes a APAGAR TODOS OS DADOS do aplicativo:\n\n" +
      "• Todas as transações\n" +
      "• Todas as tags\n" +
      "• Todas as configurações\n" +
      "• Gastos variáveis\n" +
      "• Meta de economia\n" +
      "• Dias conciliados\n\n" +
      "Esta ação NÃO PODE SER DESFEITA!\n\n" +
      "Deseja realmente continuar?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sim, apagar tudo",
        style: "destructive",
        onPress: confirmarReset,
      },
    ]
  );
}
```
**Objetivo:** Exibir confirmação detalhada antes de executar reset.

**Características:**
- ✅ Lista TODOS os dados que serão apagados
- ✅ Usa estilo "destructive" no botão de confirmação (iOS)
- ✅ Duas etapas: Alert → Execução
- ✅ Texto em negrito e maiúsculas para reforçar gravidade

---

### **confirmarReset()**
```typescript
async function confirmarReset() {
  try {
    await resetStorage();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ConfiguracaoInicial" }],
      })
    );
  } catch (error) {
    console.error("Erro ao resetar:", error);
    Alert.alert(
      "Erro",
      "Não foi possível resetar o aplicativo. Tente novamente."
    );
  }
}
```
**Objetivo:** Executar reset completo e redirecionar para onboarding.

**Características:**
- ✅ Try/catch para capturar erros
- ✅ Alert de erro caso falhe
- ✅ Usa `CommonActions.reset()` para limpar stack de navegação
- ✅ Impossível voltar via botão "Voltar" após reset

---

## ⚙️ Integração com Outros Componentes

### **Storage Service**
```typescript
import { resetStorage } from "@/services/storage";

// Execução do reset
await resetStorage();

// Resultado:
// - Todas as chaves '@panorama$:*' são removidas
// - AsyncStorage fica limpo
// - App volta ao estado inicial
```

### **Navegação**
```typescript
// Navegação modal (PrevisaoGastoDiario e MetaEconomia)
navigation.navigate("PrevisaoGastoDiario");
navigation.navigate("MetaEconomia");

// Navegação destrutiva (Reset)
navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: "ConfiguracaoInicial" }],
  })
);

// Voltar (comportamento padrão)
navigation.goBack(); // Retorna para tela anterior (MainTabs)
```

### **MainTabs**
- MenuScreen é acessada via navegação stack (não é uma tab)
- Pode ser acessada de qualquer tab da MainTabs
- Botão voltar retorna para a tab de origem

---

## 🎨 Hierarquia de Cores

### **Cores por Tipo de Ação**

| Ação | Cor Principal | Cor de Fundo | Significado |
|------|---------------|--------------|-------------|
| **Previsão de Gasto Diário** | `purple[500]` | `purple[100]` | Ação comum/configuração |
| **Meta de Economia** | `green[700]` | `green[100]` | Ação positiva/crescimento |
| **Reiniciar Panoramas** | `red[500]` | `red[100]` | Ação destrutiva/perigo |

### **Estilo Visual de Perigo**
```typescript
// Item de menu normal
<Text style={styles.menuItemTitle}>Previsão de Gasto Diário</Text>

// Item de menu perigoso (vermelho)
<Text style={[styles.menuItemTitle, styles.menuItemTitleDanger]}>
  Reiniciar Panoramas
</Text>
```

---

## 🚨 Comportamento Crítico: Reset Completo

### **O que é Removido?**
```typescript
// Chaves removidas:
@panorama$:config
@panorama$:transacoes
@panorama$:transacoes:2024-12
@panorama$:transacoes:2024-11
@panorama$:dias_conciliados
@panorama$:tags

// Total: TODAS as chaves que começam com '@panorama$:'
```

### **O que NÃO é Removido?**
- Dados de outros aplicativos no dispositivo
- Configurações do sistema operacional
- Arquivos de cache do React Native

### **Após o Reset**
```
Estado do App:
├── AsyncStorage: vazio (sem chaves @panorama$)
├── Navegação: ConfiguracaoInicialScreen (sem stack)
├── Usuário: precisa refazer onboarding completo
└── Dados: perdidos permanentemente (sem backup)
```

---

## ⚠️ Pontos de Atenção

### **UX/UI**
- ✅ Alert detalhado lista TUDO que será apagado
- ✅ Botão "Sim, apagar tudo" usa estilo "destructive"
- ✅ Ícone de lixeira (trash) reforça ação destrutiva
- ✅ Cor vermelha separa visualmente de outras opções
- ✅ Posicionamento no final da lista (menos acessível)

### **Segurança**
- ✅ Confirmação em duas etapas (clique + alert)
- ✅ Não há atalho ou gesto acidental
- ✅ Texto em CAPS destaca gravidade
- ⚠️ Não há backup automático antes do reset

### **Navegação**
- ✅ `CommonActions.reset()` limpa stack completo
- ✅ Impossível voltar após reset (sem histórico)
- ✅ Garante que usuário não tente acessar dados apagados

### **Tratamento de Erros**
```typescript
try {
  await resetStorage();
  // Sucesso: redireciona
} catch (error) {
  // Falha: exibe alert e mantém dados intactos
  Alert.alert("Erro", "Não foi possível resetar...");
}
```

---

## 📊 Estrutura de Dados

### **Props da Tela**
```typescript
type MenuScreenProps = {};
// Nenhuma prop necessária (navegação stack padrão)
```

### **Estado Local**
```typescript
// Não há estado local (tela stateless)
// Toda lógica é síncrona ou delegada para modals
```

### **Navegação**
```typescript
type RootStackParamList = {
  Menu: undefined;
  PrevisaoGastoDiario: undefined;
  MetaEconomia: undefined;
  ConfiguracaoInicial: undefined;
  // ...
};
```

---

## 🧪 Casos de Uso

### **Caso 1: Editar Gastos Variáveis**
```
Situação: Usuário teve aumento de aluguel

1. Acessa MenuScreen
2. Clica em "Previsão de Gasto Diário"
3. Edita valor do aluguel: R$ 1.000 → R$ 1.200
4. Salva
5. Sistema recalcula gasto diário automaticamente
6. Saldos futuros refletem novo valor
```

### **Caso 2: Definir Meta de 20% de Economia**
```
Situação: Usuário quer economizar 20% do salário

1. Acessa MenuScreen
2. Clica em "Meta de Economia"
3. Sistema calcula média de entradas: R$ 5.000/mês
4. Usuário arrasta slider para 20%
5. Sistema mostra: "R$ 1.000,00 por mês"
6. Salva
7. TotaisScreen (futuro) usará esta meta para progresso
```

### **Caso 3: Reset por Erro de Cadastro**
```
Situação: Usuário cadastrou centenas de transações erradas

1. Acessa MenuScreen
2. Clica em "Reiniciar Panoramas"
3. Lê alert detalhado
4. Confirma "Sim, apagar tudo"
5. App reseta completamente
6. Volta para onboarding
7. Recomeça do zero com dados corretos
```

### **Caso 4: Reset Acidental (Cancelamento)**
```
Situação: Usuário clica em "Reiniciar" por engano

1. Acessa MenuScreen
2. Clica em "Reiniciar Panoramas" (acidente)
3. Alert aparece
4. Usuário lê e percebe o erro
5. Clica em "Cancelar"
6. Alert fecha
7. Nenhuma ação realizada
8. Dados permanecem intactos
```

---

## 🚀 Melhorias Futuras

### **Funcionalidades Planejadas**
- [ ] Exportar backup antes de resetar
- [ ] Importar dados de backup
- [ ] Histórico de configurações alteradas
- [ ] Mais opções de configuração:
  - [ ] Tema claro/escuro
  - [ ] Moeda padrão
  - [ ] Formato de data
  - [ ] Idioma
- [ ] Tutorial/ajuda integrada
- [ ] Sobre o app (licenças, créditos)
- [ ] Feedback/suporte
- [ ] Verificar atualizações

### **Melhorias de UX**
- [ ] Animação de transição suave entre telas
- [ ] Ícones animados ao passar o dedo
- [ ] Confirmação visual após salvar configs
- [ ] Undo do reset (backup temporário de 5 min)
- [ ] Preview de mudanças antes de salvar

---

## 🔗 Links Relacionados

- **Previsão de Gasto Diário:** `src/screens/PrevisaoGastoDiarioScreen/`
- **Meta de Economia:** `src/screens/MetaEconomiaScreen/`
- **Storage Service:** `src/services/storage.ts`
- **Navegação:** `src/navigation/AppNavigator.tsx`
- **Onboarding:** `src/screens/ConfiguracaoInicialScreen/`

---

## 🚩 Status

- **Implementação:** ✅ Completa
- **Versão:** 1.0.0
- **Última Atualização:** 25/12/2024
- **Funcionalidades:** 3/3 implementadas
- **Próximos Passos:** Adicionar mais opções de configuração

---

**Desenvolvido com 💜 pela equipe Panorama$**
```

