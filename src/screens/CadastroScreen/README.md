# 📝 README do CadastroScreen - ATUALIZADO

---

## `src/screens/CadastroScreen/README.md`

```markdown
# Feature Documentation: Cadastro de Transações

## 📝 Visão Geral
Interface responsável pela entrada de dados do Panorama$. Suporta transações únicas, recorrentes e edições granulares (parciais ou totais). É a principal "escritora" de dados para a feature de **Saldos**.

---

## 🏗️ Arquitetura da Feature

### 1. CadastroScreen (`screens/CadastroScreen/`)
**Papel:** UI Layer (Coletora de Inputs).
- Renderiza o formulário, seletores de data e modais de decisão.
- **Regra de Ouro:** Não valida campos, não converte moedas e não decide lógica de recorrência. Apenas "dispara" o que o hook ordena.

### 2. useTransacaoForm (Form Controller) (`hooks/useTransacaoForm.ts`)
**Papel:** Controller de Formulário e Regras de Negócio.
- **Diferenciação:** Determina automaticamente o modo (Criação vs. Edição) via parâmetros da rota.
- **Normalização:** Converte valores formatados (String pt-BR) para numéricos (Number) antes da persistência.
- **Lógica de Conflito:** Gerencia o Modal de Decisão para recorrências (Editar apenas uma ocorrência vs. Todas).
- **Filtro de Tags por Categoria:** Carrega automaticamente apenas as tags da categoria selecionada. ← ✨ NOVO

---

## 📥 Contrato de Inicialização (Params)
A tela reage aos parâmetros recebidos via navegação:
- `transacaoId`: Ativa o **Modo Edição** e carrega os dados originais.
- `data` / `categoria`: Permite o pré-preenchimento vindo da planilha de Saldos (atalho).

```typescript
// Exemplo de navegação com pré-preenchimento
navigation.navigate("Cadastro", {
  data: "2024-12-25",
  categoria: "saidas"
});

// Exemplo de navegação para edição
navigation.navigate("Cadastro", {
  transacaoId: "uuid-da-transacao",
  data: "2024-12-25"
});
```

---

## 🛠️ Regras de Negócio e Validação

### **Sanitização de Valor**
- A UI exibe máscara de moeda (R$ 1.234,56)
- O hook centraliza `converterValorParaNumero()` para converter para Number
- Validação: Valor > 0 é obrigatório

### **Campos Obrigatórios**
- ✅ Valor > 0
- ✅ Data válida (YYYY-MM-DD)
- ✅ Descrição preenchida
- ✅ Categoria selecionada
- ⚠️ Tag é **opcional**

### **Persistência**
Utiliza exclusivamente o `services/storage.ts` para operações:
- `addTransacao()` - Nova transação
- `updateTransacao()` - Edição total da série
- `editarOcorrenciaRecorrente()` - Edição pontual

---

## 🏷️ Sistema de Tags por Categoria ← ✨ NOVO

### **Filtro Automático de Tags**
O CadastroScreen carrega apenas tags da categoria selecionada, garantindo que o usuário não veja tags irrelevantes.

```typescript
// Hook useTransacaoForm
useEffect(() => {
  const carregarTags = async () => {
    if (categoria) {
      const tags = await getTagsCategoria(categoria);
      setTagsDisponiveis(tags);
      
      // Limpa tag se não existe na nova categoria
      if (tagSelecionada && !tags.includes(tagSelecionada)) {
        setTagSelecionada("");
      }
    }
  };
  
  carregarTags();
}, [categoria]);
```

### **Comportamento de Troca de Categoria**
1. Usuário seleciona categoria "Saídas"
2. Sistema carrega tags: `["Supermercado", "Farmácia", "Combustível"]`
3. Usuário seleciona tag "Supermercado"
4. Usuário muda categoria para "Entradas"
5. Sistema carrega tags: `["Salário", "Freelance"]`
6. Tag "Supermercado" é **automaticamente limpa** (não existe em Entradas)

### **Exibição de Tags Vazias**
Quando a categoria não possui tags cadastradas:
```typescript
{tagsDisponiveis.length === 0 ? (
  <Text style={styles.semTagsTexto}>
    Nenhuma tag cadastrada para esta categoria
  </Text>
) : (
  // ScrollView com tags
)}
```

### **Integração com TagsScreen**
- Tags criadas na TagsScreen aparecem **imediatamente** no CadastroScreen
- Não é necessário recarregar a tela
- Tags removidas desaparecem do seletor
- Tags editadas mantêm a seleção se o usuário já tinha escolhido

---

## 🔄 Fluxo de Edição de Recorrência
Este é o ponto mais crítico da feature. Ao editar uma transação recorrente, o hook coordena:

### **1. Edição Pontual (Apenas Esta Ocorrência)**
```
Usuário edita transação recorrente
    ↓
Modal pergunta: "Editar apenas esta ou todas?"
    ↓
Usuário escolhe "Apenas esta"
    ↓
editarOcorrenciaRecorrente(id, data, novosDados)
    ↓
Sistema cria override em edicoesEspecificas[data]
    ↓
Série original permanece intacta
    ↓
Apenas a data específica mostra valores editados
```

**Exemplo de estrutura:**
```typescript
{
  id: "uuid-123",
  descricao: "Aluguel",
  valor: 1000,
  recorrencia: "mensal",
  edicoesEspecificas: {
    "2024-12-25": { valor: 1100, descricao: "Aluguel (com reajuste)" }
  }
}
```

### **2. Edição Total (Todas as Ocorrências)**
```
Usuário edita transação recorrente
    ↓
Modal pergunta: "Editar apenas esta ou todas?"
    ↓
Usuário escolhe "Todas as ocorrências"
    ↓
updateTransacao(id, novosDados)
    ↓
Sistema altera o registro mestre
    ↓
TODAS as ocorrências virtuais são afetadas
    ↓
Overrides pontuais (edicoesEspecificas) são mantidos
```

---

## 📊 Estados do Formulário

### **Estados Principais**
```typescript
// Dados da transação
valor: string;              // Formatado: "1.234,56"
categoria: Categoria;       // "entradas" | "saidas" | etc
tagSelecionada: string;     // Nome da tag ou ""
descricao: string;
recorrencia: Recorrencia;   // "unica" | "mensal" | etc

// Estado da UI
tagsDisponiveis: string[];  // ← ✨ NOVO: Tags filtradas
loading: boolean;
modalEdicaoVisible: boolean;
modalRecorrenciaVisible: boolean;
dataFormatada: string;      // Ex: "25 de dezembro"
isEdicao: boolean;          // true quando tem transacaoId
```

### **Fluxo de Carregamento (Modo Edição)**
```
CadastroScreen monta com transacaoId
    ↓
Hook busca transação: getTransacoes()
    ↓
Filtra por ID
    ↓
Popula estados do form:
  - setValor(formatado)
  - setCategoria(transacao.categoria)
  - setDescricao(transacao.descricao)
  - setRecorrencia(transacao.recorrencia)
  - setTagSelecionada(transacao.tag || "")
    ↓
useEffect carrega tags da categoria
    ↓
setTagsDisponiveis(await getTagsCategoria(categoria))
    ↓
Form pronto para edição
```

---

## 🎨 Interface Visual

### **Layout do Formulário**
```
┌─────────────────────────────────────┐
│ ← Editar Transação              ✕   │
├─────────────────────────────────────┤
│                                     │
│ [◀] 25 de dezembro de 2024 [▶]    │
│                                     │
│ Valor                               │
│ R$ [1.234,56_________________]     │
│                                     │
│ Categoria                           │
│ [💰] [💸] [🍽️] [💳] [💰]          │
│  ↑                                  │
│ selecionado                         │
│                                     │
│ Descrição                           │
│ [Supermercado XYZ___________]      │
│                                     │
│ Recorrência                         │
│ 🔁 Mensal                      ▶    │
│    Todo mês no mesmo dia            │
│                                     │
│ Tag (opcional)                      │
│ [Nenhuma] [Supermercado] [Farmácia] │
│           ↑                         │
│        selecionado                  │
│                                     │
│ [     Atualizar Transação     ]     │
└─────────────────────────────────────┘
```

### **Estado: Sem Tags Disponíveis**
```
┌─────────────────────────────────────┐
│ Tag (opcional)                      │
│ Nenhuma tag cadastrada para esta    │
│ categoria                           │
└─────────────────────────────────────┘
```

### **Modal de Recorrência**
```
┌─────────────────────────────────────┐
│ Selecione a Recorrência        ✕   │
├─────────────────────────────────────┤
│                                     │
│ ○ Única                            │
│   Não se repete                     │
│                                     │
│ ● Mensal                       ✓   │
│   Todo mês no mesmo dia            │
│                                     │
│ ○ Semanal                          │
│   A cada 7 dias                     │
│                                     │
└─────────────────────────────────────┘
```

---

## ⚙️ Integrações

### **Com Storage Service**
```typescript
// Criação
await addTransacao(novaTransacao);

// Edição total
await updateTransacao(id, dadosAtualizados);

// Edição pontual
await editarOcorrenciaRecorrente(id, data, override);

// Carregamento de tags
const tags = await getTagsCategoria(categoria);
```

### **Com SaldosScreen**
- Saldos navega com `data` e `categoria` pré-preenchidos
- Após salvar, SaldosScreen recalcula automaticamente
- Mudanças aparecem imediatamente na planilha

### **Com TagsScreen**
- Tags criadas lá aparecem aqui automaticamente
- Sistema usa `getTagsCategoria()` para filtrar
- Não há cache de tags (sempre busca do storage)

### **Com DetalhesScreen**
- Detalhes navega com `transacaoId` para edição
- Modo edição carrega dados existentes
- Botão "Salvar" atualiza transação original

---

## ⚠️ Pontos de Atenção & Manutenção

### **Integridade de Dados**
- Alterações nesta feature impactam diretamente os cálculos de **Saldos** e as futuras projeções de **Panoramas**
- Sempre validar que `Transacao` mantém estrutura correta antes de persistir
- **CRÍTICO:** Nunca salvar categoria como `"todas"` - apenas categorias específicas

### **Performance**
- A lista de tags é carregada do storage de forma assíncrona
- Garantir que o estado de `loading` cubra essa inicialização
- Evitar múltiplas chamadas ao storage durante mudanças rápidas de categoria ← ✨ ATUALIZADO

### **Estabilidade**
- Qualquer refatoração deve manter o contrato de saída do objeto `Transacao`
- Não adicionar campos novos sem atualizar `types/index.ts`
- Evitar corrupção do JSON no AsyncStorage

### **Consistência Temporal**
- Datas devem ser normalizadas via `formatDate` para evitar divergência com o motor de recorrência
- Sempre usar formato `YYYY-MM-DD` para persistência

### **Tags Órfãs** ← ✨ NOVO
- Transação pode referenciar tag que foi removida da TagsScreen
- Sistema não valida se tag existe no momento do cadastro (validação futura)
- Se tag não existir mais, transação mantém nome da tag (string)
- TransacaoCard exibe tag mesmo se ela não existir mais no sistema

---

## 🐛 Troubleshooting

### **"Tags não aparecem ao mudar categoria"**
**Causa:** `useEffect` não está sendo disparado ou categoria está `undefined`
**Solução:** Verificar dependências do `useEffect([categoria])` e garantir que categoria tem valor inicial

### **"Tag selecionada desaparece ao trocar categoria"**
**Comportamento Esperado:** Quando usuário troca de categoria, a tag é limpa se não existir na nova categoria
**Solução:** Documentar para o usuário que isso é intencional

### **"Edição de transação não carrega tag"**
**Causa:** Tag pode estar `undefined` na transação original
**Solução:** Garantir que `setTagSelecionada(transacao.tag || "")` usa fallback

### **"Modal de edição não abre em transação recorrente"**
**Causa:** Condição `isEdicao && recorrencia !== "unica"` pode estar falhando
**Solução:** Verificar se `isEdicao` está sendo setado corretamente ao detectar `transacaoId`

---

## 🧪 Casos de Teste

### **Teste 1: Criar Transação Única com Tag**
```
1. Abrir CadastroScreen
2. Selecionar categoria "Saídas"
3. Verificar que tags de saídas aparecem
4. Selecionar tag "Supermercado"
5. Preencher valor, descrição
6. Salvar
✅ Esperado: Transação criada com tag correta
```

### **Teste 2: Trocar Categoria Limpa Tag**
```
1. Selecionar categoria "Saídas"
2. Selecionar tag "Supermercado"
3. Mudar categoria para "Entradas"
✅ Esperado: Tag é limpa automaticamente
✅ Esperado: Novas tags (de entradas) aparecem
```

### **Teste 3: Editar Transação Mantém Tag**
```
1. Editar transação com tag "Farmácia" (categoria Saídas)
2. Verificar que tag "Farmácia" está selecionada
3. Alterar descrição
4. Salvar
✅ Esperado: Tag "Farmácia" é mantida
```

### **Teste 4: Categoria Sem Tags**
```
1. Selecionar categoria "Economia"
2. Não criar nenhuma tag em TagsScreen
3. Abrir CadastroScreen
✅ Esperado: Mensagem "Nenhuma tag cadastrada para esta categoria"
```

### **Teste 5: Edição Pontual de Recorrente**
```
1. Editar transação recorrente "Aluguel"
2. Modal pergunta: "Apenas esta ou todas?"
3. Escolher "Apenas esta"
4. Alterar valor e tag
5. Salvar
✅ Esperado: Apenas esta ocorrência muda
✅ Esperado: Próximas ocorrências mantêm dados originais
```

---

## 🚀 Roadmap e Melhorias Futuras

- [ ] **Validação de existência de tags:** Alertar se tag selecionada não existe mais
- [ ] **Sugestão de tags:** Autocompletar baseado em descrição similar
- [ ] **Tags favoritas:** Mostrar tags mais usadas no topo
- [ ] **Criação rápida de tags:** Botão "+" no seletor para criar tag sem sair da tela
- [ ] **Preview de impacto:** Mostrar quantas ocorrências serão afetadas antes de editar série
- [ ] **Histórico de edições:** Log de quem editou o quê e quando (em edicoesEspecificas)
- [ ] **Validação de valor máximo:** Alertar se valor é absurdamente alto (proteção contra erros)
- [ ] **Duplicação rápida:** Botão para duplicar transação existente

---

## 🚩 Status

- **Status:** ✅ Implementada e Estável
- **Versão:** 1.0.0
- **Última Atualização:** 25/12/2024
- **Integração com Tags por Categoria:** ✅ Completa
- **Próximo Passo:** Validação de existência de tags e sugestões inteligentes

---

## 📚 Links Relacionados

- **Hook Principal:** `src/hooks/useTransacaoForm.ts`
- **Storage Service:** `src/services/storage.ts`
- **Types:** `src/types/index.ts`
- **Integração com Tags:** `src/screens/TagsScreen/`
- **Exibição de Transações:** `src/components/TransacaoCard/`
- **Tela de Detalhes:** `src/screens/DetalhesScreen/`

---

**Desenvolvido com ❤️ pela equipe Panorama$**
```

