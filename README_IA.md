# Contexto do Projeto: Panorama$

## 📌 Objetivo
Aplicação de controle financeiro pessoal focada em fornecer um panorama da saúde financeira futura. A visualização principal é em formato de planilha, baseada em transações únicas e recorrentes (entradas, saídas e cartões).

## 🛠 Stack Tecnológica
- **Framework:** Expo ~54 (Bare Workflow)
- **Mobile:** React Native 0.81
- **Core:** React 19  
  - Uso criterioso de novos hooks (`use`) apenas quando fizer sentido arquitetural.
- **Linguagem:** TypeScript
- **Navegação:** React Navigation (native-stack + bottom-tabs)
- **Persistência:** AsyncStorage (local, sem backend)
- **Segurança:** Expo Local Authentication (Biometria)

## 🏗 Arquitetura (src/)
- `components/`: Componentes reutilizáveis e "burros" (sem lógica de negócio).
- `hooks/`: Lógica de negócio, estado e regras financeiras.
- `navigation/`: Configuração das rotas.
- `screens/`: Pastas por tela (ex: `Home/index.tsx` e `Home/styles.ts`).
- `services/`: Acesso a dados e persistência (centralizado no `storage.ts`).
- `theme/`: Design tokens (cores, tipografia, espaçamento).
- `types/`: Interfaces e tipos globais.
- `utils/`: Funções puras (datas, formatação, cálculos).

## ⚖️ Regras e Decisões Globais
1. **Separação de Preocupações:** Proibido calcular regras financeiras diretamente na camada de UI.
2. **Lógica de Negócio:** Deve residir estritamente em `hooks` ou `utils`.
3. **Estado Global:** Atualmente gerenciado via Props/Hooks; React Context será introduzido se necessário; Zustand apenas em caso de extrema complexidade.
4. **Performance:** Foco total em evitar re-renders desnecessários, especialmente na visualização de planilha.
5. **Idioma:** Código misto (Português/Inglês), respeitando o estado atual do projeto.
6. **Persistência:** Nenhuma lógica de cálculo deve depender do formato físico do AsyncStorage.
   - O domínio opera sempre sobre entidades (`Transacao`, `Config`, `SaldoDia`).


## 🚀 Status das Features
- [x] Login / Biometria
- [x] Onboarding / Cadastro Inicial
- [x] Gestão de Saldos
- [x] CRUD de Transações (Únicas e Recorrentes)
- [ ] Totais e Agrupamentos
- [ ] **Panorama (Projeção Trimestral)** <- *Foco Atual*
- [ ] Gestão de Tags
- [ ] Menu e Configurações

---

## 📂 Estrutura de Arquivos Atual (Contexto de Desenvolvimento)

Para facilitar a navegação e a criação de novas features, a estrutura atual do projeto está organizada conforme abaixo:

### ⚛️ Componentes (`src/components/`)
Componentes de interface reutilizáveis e modais de regra de negócio e todas as pastas tem um arquivo index.tsx e um styles.ts:
* **Navegação & Header:** `HeaderMesNavegação`, `TabelaHeader`.
* **Cards & Listas:** `TransacaoCard`, `GastoVariavelCard`, `DialListItem`, `Divider`.
* **Feedback & Estados:** `LoadingScreen`, `EmptyState`.
* **Modais de Regra:** `ModalEdicaoRecorrente`, `ModalExclusaoRecorrente` (gerenciam a lógica de exceção na recorrência virtual).
* **Filtros:** `FiltrosCategorias`.

### 🧠 Lógica & Regras (`src/hooks/`)
Hooks customizados que encapsulam o estado e cálculos financeiros:
* `useSaldos.ts`: Gerencia o cálculo e exibição dos saldos da planilha.
* `useTransacoesData.ts`: Manipula a busca e formatação das transações para a UI.
* `useTransacaoForm.ts`: Lógica de validação e submissão para criação/edição.
* `useSaldoStyles.ts`: Encapsula lógicas de estilização condicional (cores de saldo positivo/negativo).

### 📱 Telas (`src/screens/`)
* `LoginScreen`: Autenticação biométrica.
* `ConfiguracaoInicialScreen`: Setup do saldo e data inicial (Onboarding).
* `SaldosScreen`: Visualização principal em formato de planilha.
* `DetalhesScreen`: Detalhamento de transações e instâncias de recorrência.
* `PanoramasScreen`: (Em desenvolvimento) Projeção futura de 90 dias.
* `TotaisScreen` & `TagsScreen`: Agrupamentos e gestão de categorias.

### ⚙️ Serviços & Tipagem (`src/services/` & `src/types/`)
* `storage.ts`: Motor de persistência centralizado (Snapshot Model).
* `README_STORAGE.md`: Documentação técnica do motor de persistência.
* `index.ts` (types): Definições globais de `Transacao`, `Config`, `Categoria` e `Recorrencia`.

## 🚩 Bloco de Trabalho Atual
**Objetivo:** Implementar a lógica de 'Panoramas' (projeção trimestral).
**Tarefa:** Criar lógica na pasta `utils/` para calcular o saldo futuro baseando-se no `saldoInicial` (config) e na projeção de transações recorrentes e parceladas para os próximos 3 meses.