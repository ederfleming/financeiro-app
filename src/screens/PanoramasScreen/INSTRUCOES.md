## 📊 Estrutura da Tabela — Panorama

### 🎯 Objetivo da Tabela
Exibir uma **projeção financeira diária** para um bloco fixo de **3 meses**, mantendo consistência visual e semântica com a tela de **Saldos**.

---

## 🧱 Estrutura Visual

### Cabeçalho de Colunas (Meses)
- Cada mês é exibido como **cabeçalho independente**
- Formato:

Dez/25 | Jan/26 | Fev/26

- O cabeçalho representa apenas o **contexto mensal**, não é interativo
- A troca de meses ocorre **exclusivamente** via header principal do Panorama

---

### Linhas (Dias do Mês)
- Cada coluna lista os **dias sequencialmente**:

1
2
3
4
...


- Dias inexistentes em meses menores (ex: 31 em fevereiro) devem:
- **Não ser renderizados**

---

### Célula de Conteúdo
Cada célula representa:

Dia X → Saldo projetado daquele dia

- O valor exibido é o **saldo acumulado até o final do dia**
- Não exibe detalhamento de transações
- O foco é **leitura rápida** e **comparação visual**

---

## 🎨 Regras Visuais (Herdadas da Tela de Saldos)

### 1️⃣ Destaque de Finais de Semana
Dias que caem em:
- **Sábado**
- **Domingo**

Devem ser destacados visualmente, seguindo o padrão já existente em **Saldos**.

Possíveis diferenciações:
- Background mais suave
- Opacidade reduzida
- Tom alternativo da mesma paleta

> 📌 **Nota:** A identificação de fim de semana deve ser **puramente utilitária** (`utils/dateUtils`), nunca implementada diretamente na UI.

---

### 2️⃣ Esquema de Cores por Valor de Saldo
O saldo diário deve respeitar **exatamente o mesmo critério cromático** da tela de **Saldos**:

- Saldo positivo saudável → tons de **verde**
- Saldo neutro / atenção → tons de **amarelo**
- Saldo negativo → tons de **vermelho**
- Casos intermediários seguem os **mesmos thresholds já definidos**

> 📌 **Regra obrigatória:**  
> O Panorama **não define novas cores nem novos thresholds**.  
> Ele **reutiliza integralmente** a lógica já consolidada em **Saldos**.

---

## 🧠 Regras de Negócio Importantes
A tabela:
- ❌ Não calcula saldo
- ❌ Não interpreta recorrência
- ❌ Não conhece transações

Ela apenas **renderiza dados já projetados**.

Toda inteligência financeira vive em:
- `utils/` → cálculo
- `hooks/` → orquestração

---

## 🔒 Consistência de Produto
Essas decisões garantem que:
- O usuário reconheça o padrão instantaneamente
- A leitura do Panorama seja tão natural quanto a de **Saldos**
- Não exista divergência visual entre **saldo real** e **saldo projetado**
