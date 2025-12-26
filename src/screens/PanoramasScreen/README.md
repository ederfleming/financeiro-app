# Feature Documentation: Panoramas (Projeção Trimestral)

## 📝 Visão Geral
A tela **Panoramas** fornece uma visão de **3 meses consecutivos** em formato de colunas lado a lado, exibindo apenas o **dia** e o **saldo acumulado** de cada dia, permitindo uma análise rápida da evolução financeira trimestral.

## 🎯 Objetivo
Permitir que o usuário visualize rapidamente a projeção futura (ou histórico passado) de forma compacta e visual, navegando entre trimestres através de **swipe horizontal** ou botões de navegação no header.

---

## 🏗️ Divisão de Responsabilidades

### 1. PanoramasScreen (`screens/PanoramasScreen/`)
**Papel:** Interface Pura (Declarativa).
- Renderiza 3 colunas lado a lado (layout horizontal com ScrollView).
- Cada coluna possui lista vertical de dias com scroll independente.
- Encaminha eventos do usuário (swipe, navegação) para o hook.
- Usa `GestureDetector` para swipe entre trimestres.
- Aplica estilos condicionais (fim de semana, cores de saldo).

### 2. usePanoramas (`hooks/usePanoramas.ts`)
**Papel:** Orquestrador de Estado e Efeitos.
- **Estado:** Controla `primeiroMesTrimestre` e array de `colunasTrimestre`.
- **Dados:** Consome `services/storage.ts` e `utils/calculoSaldo.ts`.
- **Navegação:** Muda trimestre em blocos de 3 meses (anterior/próximo).
- **Formatação:** Gera título do trimestre para o header (ex: "Jan/25 - Mar/25").
- **Computed Values:** Calcula `mesesExibidos` para uso no header.

### 3. calcularSaldosTrimestre (`utils/calculoSaldo.ts`)
**Papel:** Engine de Cálculo Trimestral (Pure Function).
- **Inputs:** Ano, Mês, Transações, Dias Conciliados, Config.
- **Output:** `SaldoDia[]` (array de saldos diários do mês).
- **Lógica:** Idêntica à `calcularSaldosMes`, mas sem filtros de categoria.
- **Performance:** Reutiliza `calcularSaldoMesAnterior` para cálculo recursivo.

---

## 🛠️ Fluxo de Dados

```
useFocusEffect → carregarDados()
      ↓
getTransacoes() + getDiasConciliados() + getConfig()
      ↓
Loop 3 meses → calcularSaldosTrimestre(year, month, ...)
      ↓
setColunasTrimestre([{ mes: Date, saldos: SaldoDia[] }])
      ↓
formatarTituloTrimestre(mesesExibidos)
      ↓
PanoramasScreen renderiza 3 colunas + header customizado
```

---

## 💰 Lógica de Cálculo

### Regras de Negócio (implementadas em `calcularTotaisDia`)
A lógica é **idêntica** à tela de Saldos, respeitando todas as categorias:

- **Dias passados:** Apenas transações reais cadastradas (se não gastou = R$ 0,00).
- **Dia atual:** 
  - Se tem gasto diário real → usa o valor real
  - Senão → usa `gastoDiarioPadrao` (estimativa)
- **Dias futuros:** Sempre usa `gastoDiarioPadrao` para projeção.
- **Todas as categorias:** Considera entradas, saídas, cartão e economias (reais).
- **Saldo inicial:** Sempre começa do saldo final do mês anterior (recursivo até `dataInicial`).

### Fórmula de Saldo Acumulado
```typescript
saldoAcumulado = saldoAnterior + entradas - saidas - diarios - cartao - economia
```

### Exemplo Visual

**Trimestre exibido:** Jan/25 - Mar/25

```
┌──────────────────────────────────────────────────────────────┐
│                    Jan/25 - Mar/25                           │ ← Header
├──────────────────┬──────────────────┬──────────────────────┤
│     Jan/25       │     Fev/25       │      Mar/25          │ ← Headers das colunas
├──────────────────┼──────────────────┼──────────────────────┤
│  01 │ R$ 5,0 mil │  01 │ R$ 4,2 mil │  01 │ R$ 3,8 mil   │
│  02 │ R$ 4,9 mil │  02 │ R$ 4,1 mil │  02 │ R$ 3,7 mil   │
│  03 │ R$ 4,8 mil │  03 │ R$ 4,0 mil │  03 │ R$ 3,6 mil   │
│ ... │ ...        │ ... │ ...        │ ... │ ...          │
│  31 │ R$ 4,3 mil │  28 │ R$ 3,9 mil │  31 │ R$ 3,2 mil   │
└──────────────────┴──────────────────┴──────────────────────┘
```

---

## 🎨 Design e UX

### Layout Estrutural
```
PanoramasScreen
├── SafeAreaView (container)
│   ├── HeaderMesNavegacao (reutilizado)
│   │   ├── CalendarTodayIcon (botão "Atual")
│   │   ├── Navegação (chevrons anterior/próximo)
│   │   └── Menu (ícone menu)
│   └── GestureDetector (swipe horizontal)
│       └── ScrollView (vertical, outer)
│           └── trimestreContainer (flexDirection: row)
│               ├── Coluna 1 (Mês 1)
│               │   ├── colunaHeader (Jan/25)
│               │   └── colunaScroll (dias 1-31)
│               ├── Coluna 2 (Mês 2)
│               └── Coluna 3 (Mês 3)
```

### Características Visuais

#### 1. **Cores de Saldo (via `useSaldoStyles`)**
```typescript
// Positivo acima de R$ 2.000
backgroundColor: colors.green[50]
textColor: colors.green[700]

// Negativo
backgroundColor: colors.red[50]
textColor: colors.red[700]

// Zero ou neutro
backgroundColor: colors.gray[50]
textColor: colors.gray[700]
```

#### 2. **Destaque de Fim de Semana**
```typescript
// Dias úteis
backgroundColor: colors.gray[200]
textColor: colors.gray[800]

// Sábado/Domingo
backgroundColor: colors.purple[300]
textColor: colors.white
borderLeftWidth: 4
borderLeftColor: colors.purple[700]
```

#### 3. **Formatação de Valores**
Usa `formatarMoedaAbreviada` para economia de espaço:
```typescript
R$ 5.000,00  → R$ 5,0 mil
R$ 12.345,67 → R$ 12,3 mil
R$ 500,00    → R$ 500
```

### Tokens de Design Utilizados
```typescript
// Spacing
spacing.md   // Padding horizontal/vertical
spacing.sm   // Gap entre colunas
spacing.xs   // Padding interno de células

// Colors
colors.gray[50]    // Background container
colors.purple[50]  // Header de coluna
colors.purple[700] // Texto header + borda weekend
colors.gray[200]   // Bordas e separadores

// Typography
fontSize.md  // Texto padrão (dias, saldos, headers)
fontWeight.600/700  // Headers e valores
```

---

## ⚡ Comportamentos Críticos

### 1. **Navegação por Swipe**
```typescript
const swipeGesture = Gesture.Pan()
  .activeOffsetX([-50, 50])  // Só ativa com movimento horizontal
  .onEnd((event) => {
    const SWIPE_THRESHOLD = 50;
    
    if (event.translationX > 50) {
      mudarTrimestre("anterior");  // Swipe direita → 3 meses antes
    } else if (event.translationX < -50) {
      mudarTrimestre("proximo");   // Swipe esquerda → 3 meses depois
    }
  });
```

### 2. **Feedback Haptic**
Vibração leve (`ImpactFeedbackStyle.Light`) ao mudar de trimestre.

### 3. **Botão "Ir para Hoje"**
- Reseta para o trimestre que contém o mês atual.
- Reutiliza `CalendarTodayIcon` para consistência visual.
- Label de acessibilidade: "Ir para trimestre atual".

### 4. **Header Customizado**
```typescript
// Título dinâmico gerado pelo hook
tituloTrimestre = "Jan/25 - Mar/25"

// Props passadas para HeaderMesNavegacao
<HeaderMesNavegacao
  tituloCustom={tituloTrimestre}
  onMudarMes={mudarTrimestre}
  onIrParaHoje={irParaTrimestreAtual}
  todayButtonAccessibilityLabel="Ir para trimestre atual"
/>
```

### 5. **Scroll Independente**
- Cada coluna possui seu próprio `ScrollView` vertical.
- ScrollView externo (horizontal) permite rolagem em telas pequenas.
- **Sem scroll sincronizado** entre colunas (by design, para independência).

### 6. **Loading State**
```typescript
loading ? (
  <LoadingScreen message="Carregando panorama..." />
) : (
  <View style={styles.trimestreContainer}>...</View>
)
```

---

## 🔗 Integração com Outras Features

### SaldosScreen
- **Engine compartilhada:** Ambas usam `calcularSaldosTrimestre`/`calcularSaldosMes`.
- **Lógica idêntica:** Gasto diário inteligente (real vs estimado).
- **Estilos compartilhados:** `useSaldoStyles` para cores de saldo.
- **Diferença:** Panoramas não tem filtros de categoria, exibe apenas saldo final.

### Configuração Inicial
- **Dependência:** `gastoDiarioPadrao` alimenta as projeções futuras.
- **Validação:** `dataInicial` impede exibição de saldos antes da configuração.

### HeaderMesNavegacao
- **Reutilização:** Componente adaptado com props opcionais.
- **Props customizadas:**
  - `tituloCustom` (sobrescreve formatação padrão)
  - `todayButtonAccessibilityLabel` (semântica de acessibilidade)

### utils/dateUtils
- **`isFimDeSemana(dia, mes)`:** Identifica sábados/domingos.
- **`getMonthName(month)`:** Formata nomes de meses abreviados.

### utils/calculoSaldo
- **`formatarMoedaAbreviada(valor)`:** Formata valores para economia de espaço.
- **`calcularSaldosTrimestre()`:** Engine principal de cálculo.

---

## 📊 Estrutura de Dados

### Interface `SaldoTrimestreColuna`
```typescript
interface SaldoTrimestreColuna {
  mes: Date;        // Data do primeiro dia do mês
  saldos: SaldoDia[]; // Array de saldos diários
}
```

### Interface `SaldoDia` (reutilizada)
```typescript
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
```

### Estado do Hook
```typescript
const [colunasTrimestre, setColunasTrimestre] = useState<SaldoTrimestreColuna[]>([]);
const [primeiroMesTrimestre, setPrimeiroMesTrimestre] = useState(new Date());
const [loading, setLoading] = useState(true);
```

---

## 🚀 Performance e Otimizações

### Cálculo Eficiente
- **Volume:** ~90 dias por carregamento (3 meses × 30 dias).
- **Recursão:** Reutiliza `calcularSaldoMesAnterior` (já otimizado).
- **Cache implícito:** `useFocusEffect` recarrega apenas ao focar na tela.

### Re-renders Minimizados
```typescript
// useMemo para computed values
const mesesExibidos = useMemo(() => 
  colunasTrimestre.map((col) => col.mes), 
  [colunasTrimestre]
);

// useCallback para funções
const mudarTrimestre = useCallback((direcao) => {...}, [primeiroMesTrimestre]);
```

### Gestão de Memória
- Mantém apenas **1 trimestre** em estado (descarta anteriores).
- Não persiste histórico de navegação.

---

## 🧪 Casos de Uso

### Caso 1: Visualizar Projeção Futura
```
Usuário: Swipe esquerda várias vezes
Resultado: Avança 3, 6, 9 meses no futuro
Uso: Planejar gastos de longo prazo
```

### Caso 2: Analisar Histórico Passado
```
Usuário: Swipe direita várias vezes
Resultado: Retrocede 3, 6, 9 meses no passado
Uso: Revisar evolução financeira
```

### Caso 3: Comparar Meses Lado a Lado
```
Usuário: Observa 3 colunas simultaneamente
Resultado: Identifica padrões (ex: "sempre caio no 3º mês")
Uso: Ajustar planejamento mensal
```

### Caso 4: Voltar para Trimestre Atual
```
Usuário: Toca ícone de calendário (CalendarTodayIcon)
Resultado: Reseta para trimestre que contém o mês atual
Uso: Reorientação rápida
```

---

## 🚩 Status e Próximos Passos

### ✅ Implementado
- [x] Hook `usePanoramas` com estado trimestral
- [x] Função `calcularSaldosTrimestre` 
- [x] Layout de 3 colunas responsivo
- [x] Swipe horizontal com haptic feedback
- [x] Header customizado com título trimestral
- [x] Formatação abreviada de moeda
- [x] Destaque de fim de semana
- [x] Cores dinâmicas de saldo (positivo/negativo)
- [x] Loading state com mensagem
- [x] Scroll independente por coluna

### 🔮 Melhorias Futuras (Roadmap)

#### Alta Prioridade
- [ ] **Scroll sincronizado entre colunas:** Ao rolar uma coluna, as outras acompanham.
- [ ] **Highlight do dia atual:** Borda ou cor diferente no dia de hoje em todas as colunas.
- [ ] **Tap no dia para detalhes:** Modal ou navegação para `DetalhesScreen` com contexto do dia.

#### Média Prioridade
- [ ] **Indicador de conciliação:** Ícone/cor diferente para dias conciliados.
- [ ] **Toggle 3/6 meses:** Botão no header para alternar visualização.
- [ ] **Suavização de transições:** Animação ao mudar trimestre (fade/slide).
- [ ] **Loading skeleton:** Placeholder enquanto calcula (melhor UX).

#### Baixa Prioridade
- [ ] **Exportação de dados:** Salvar trimestre como imagem/PDF.
- [ ] **Gráfico resumido:** Linha de tendência no topo das colunas.
- [ ] **Filtro por categoria:** Opção de ver apenas entradas/saídas no panorama.
- [ ] **Comparação de trimestres:** View especial comparando 2 trimestres diferentes.

---

## ⚠️ Pontos de Atenção

### Limitações Atuais
1. **Sem indicação de dias conciliados:** Campo `conciliado` é calculado mas não exibido visualmente.
2. **Scroll não sincronizado:** Cada coluna rola independentemente (pode ser confuso para alguns usuários).
3. **Sem feedback de loading parcial:** Carrega os 3 meses de uma vez (pode ser lento em dispositivos antigos).
4. **Dia atual não destacado:** Difícil identificar "onde estou agora" ao navegar meses futuros/passados.

### Considerações Técnicas
- **Header customizado:** Requer `tituloCustom` prop no `HeaderMesNavegacao`.
- **Formatação abreviada:** Requer `formatarMoedaAbreviada` em `utils/calculoSaldo.ts`.
- **Fim de semana:** Requer `isFimDeSemana` em `utils/dateUtils.ts`.

### Dependências Críticas
```typescript
// Hook
usePanoramas → calcularSaldosTrimestre → calcularSaldoMesAnterior

// Componentes
PanoramasScreen → HeaderMesNavegacao (com props customizadas)
               → LoadingScreen
               → useSaldoStyles (para cores)

// Utils
formatarMoedaAbreviada
getMonthName
isFimDeSemana
```

---

## 📚 Documentação Relacionada

- **`hooks/usePanoramas.ts`** - Lógica de estado e navegação trimestral
- **`utils/calculoSaldo.ts`** - Engine financeira compartilhada
- **`screens/SaldosScreen/README.md`** - Feature similar (mensal)
- **`components/HeaderMesNavegacao/README.md`** - Componente reutilizado
- **`services/README.md`** - Motor de persistência (storage)

---

## 🎯 Como Usar (Para Desenvolvedores)

### Adicionar a rota no AppNavigator
```typescript
<Stack.Screen 
  name="Panoramas" 
  component={PanoramasScreen}
  options={{ headerShown: false }}
/>
```

### Navegar para a tela
```typescript
navigation.navigate("Panoramas");
```

### Customizar comportamento
```typescript
// Alterar limiar de swipe
const SWIPE_THRESHOLD = 100; // Mais difícil de ativar

// Mudar quantidade de meses exibidos (requer refatoração)
for (let i = 0; i < 6; i++) { // 6 meses ao invés de 3
  // ...
}
```

---

**Última atualização:** 22/12/2024  
**Versão:** 1.0.0  
**Status:** ✅ Implementada e Funcional