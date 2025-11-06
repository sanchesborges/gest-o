# Edição de Custo Unitário em Produtos Existentes

## 📋 Resumo

Funcionalidade de edição de produtos na página **Cadastro de Produtos**, permitindo atualizar o **Custo Unitário** de produtos já cadastrados.

## ✨ O que foi implementado

### 1. Botão de Edição
- ✅ Ícone de lápis (Edit) em cada produto
- ✅ Disponível na visualização mobile (cards)
- ✅ Disponível na visualização desktop (tabela)
- ✅ Apenas para usuários ADMIN

### 2. Modal de Edição
- ✅ Formulário completo de edição
- ✅ Campos editáveis:
  - Nome do Produto
  - Preço de Venda
  - **Custo Unitário** (novo campo)
  - Estoque Mínimo
- ✅ Campos não editáveis (apenas visualização):
  - Tipo
  - Tamanho do Pacote
- ✅ Preview de lucro em tempo real
- ✅ Dica para cadastrar custo se estiver zerado

### 3. Coluna de Custo na Tabela
- ✅ Nova coluna "Custo" na visualização desktop
- ✅ Mostra o custo unitário ou "-" se não cadastrado
- ✅ Formatação em reais (R$)

### 4. Integração com Banco
- ✅ Atualização direta no Supabase
- ✅ Sincronização automática
- ✅ Validação de dados

## 🎯 Como Usar

### Editar Produto Existente

#### Na Visualização Mobile (Cards)
1. Acesse **Cadastro de Produtos**
2. Localize o produto desejado
3. Clique no ícone de **lápis** (canto superior direito do card)
4. Edite os campos necessários
5. Clique em **"Salvar Alterações"**

#### Na Visualização Desktop (Tabela)
1. Acesse **Cadastro de Produtos**
2. Localize o produto na tabela
3. Clique no ícone de **lápis** na coluna "Ações"
4. Edite os campos necessários
5. Clique em **"Salvar Alterações"**

### Cadastrar Custo em Produtos Antigos

**Cenário**: Você tem produtos cadastrados sem custo

**Solução**:
1. Acesse **Cadastro de Produtos**
2. Para cada produto:
   - Clique no ícone de edição (lápis)
   - Preencha o campo **"Custo Unitário (R$)"**
   - Veja o preview do lucro
   - Salve as alterações
3. Repita para todos os produtos

**Dica**: Priorize produtos mais vendidos primeiro!

## 📊 Interface do Modal de Edição

```
┌─────────────────────────────────────────┐
│ ✏️ Editar Produto                    ✕ │
├─────────────────────────────────────────┤
│                                         │
│ Nome do Produto                         │
│ [Pão de Queijo Tradicional 5kg     ]   │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Tipo: Pão de Queijo                 │ │
│ │ Pacote: 5kg                         │ │
│ │ Tipo e tamanho não podem ser editados│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Preço de Venda (R$)  │ Custo Unit. (R$)│
│ [16.00            ]  │ [13.50        ] │
│                                         │
│ Estoque Mínimo       │ Lucro por unid. │
│ [10               ]  │ R$ 2.50         │
│                      │ 15.6% margem    │
│                                         │
│ 💡 Dica: Cadastre o custo unitário...  │
│                                         │
│              [Cancelar] [Salvar]        │
└─────────────────────────────────────────┘
```

## 🔄 Fluxo de Atualização

```
1. Usuário clica no ícone de edição (lápis)
   ↓
2. Modal abre com dados atuais do produto
   ↓
3. Usuário edita os campos desejados
   ↓
4. Sistema calcula lucro em tempo real
   ↓
5. Usuário clica em "Salvar Alterações"
   ↓
6. Sistema valida os dados
   ↓
7. Atualiza no banco de dados (Supabase)
   ↓
8. Atualiza estado local (React)
   ↓
9. Mostra mensagem de sucesso
   ↓
10. Fecha o modal
   ↓
11. Lista de produtos é atualizada
```

## 💡 Exemplos de Uso

### Exemplo 1: Cadastrar Custo em Produto Antigo
```
Produto: Biscoito de Queijo 1kg
Status Atual: Sem custo cadastrado

Ação:
1. Clicar em editar
2. Preencher "Custo Unitário": R$ 8,50
3. Ver preview: Lucro R$ 3,50 (29.2% margem)
4. Salvar

Resultado:
✅ Custo cadastrado
✅ Aparece no Relatório de Vendas
✅ Cálculo de lucro disponível
```

### Exemplo 2: Atualizar Preço e Custo
```
Produto: Pão de Queijo 5kg
Preço Atual: R$ 15,00
Custo Atual: R$ 12,00

Fornecedor aumentou o preço!

Ação:
1. Clicar em editar
2. Atualizar "Custo Unitário": R$ 13,50
3. Atualizar "Preço de Venda": R$ 17,00
4. Ver preview: Lucro R$ 3,50 (20.6% margem)
5. Salvar

Resultado:
✅ Preço atualizado
✅ Custo atualizado
✅ Margem mantida saudável
```

### Exemplo 3: Ajustar Estoque Mínimo
```
Produto: Biscoito Polvilho 5kg
Estoque Mínimo Atual: 10

Produto vende muito!

Ação:
1. Clicar em editar
2. Atualizar "Estoque Mínimo": 20
3. Salvar

Resultado:
✅ Alerta de estoque baixo ajustado
✅ Melhor controle de reposição
```

## 📋 Campos Editáveis vs Não Editáveis

### ✅ Editáveis
- **Nome do Produto**: Pode corrigir erros de digitação
- **Preço de Venda**: Ajustar conforme mercado
- **Custo Unitário**: Atualizar quando fornecedor mudar preço
- **Estoque Mínimo**: Ajustar conforme demanda

### ❌ Não Editáveis
- **Tipo**: Definido na criação (ex: Pão de Queijo)
- **Tamanho do Pacote**: Definido na criação (ex: 5kg)

**Por quê?** Tipo e tamanho são características fundamentais do produto. Se precisar mudar, é melhor criar um novo produto.

## 🎨 Melhorias Visuais

### Tabela Desktop
```
┌──────────────────────────────────────────────────────────────┐
│ Nome              │ Tipo  │ Pacote │ Preço │ Custo │ Ações  │
├──────────────────────────────────────────────────────────────┤
│ Pão de Queijo 5kg │ Pão   │ 5kg    │ 16.00 │ 13.50 │ ✏️     │
│ Biscoito 1kg      │ Bisc. │ 1kg    │ 12.00 │   -   │ ✏️     │
└──────────────────────────────────────────────────────────────┘
```

### Card Mobile
```
┌─────────────────────────────────────┐
│ ☑️  Pão de Queijo Tradicional 5kg ✏️│
│     Pão de Queijo                   │
│                                     │
│ Preço: R$ 16.00                     │
│ Custo: R$ 13.50                     │
│ Pacote: 5kg                         │
│ Estoque Mínimo: 10 un.              │
└─────────────────────────────────────┘
```

## ⚠️ Avisos Importantes

### 1. Tipo e Tamanho Não Podem Ser Editados
Se você precisa mudar o tipo ou tamanho:
- Crie um novo produto
- Transfira o estoque (se necessário)
- Oculte o produto antigo

### 2. Custo Zerado
Se o custo estiver zerado (R$ 0,00):
- O Relatório de Vendas não calculará lucro corretamente
- Aparecerá um aviso amarelo no modal
- Cadastre o custo para análise precisa

### 3. Produtos em Pedidos
Editar o preço ou custo NÃO afeta pedidos já criados:
- Pedidos antigos mantêm o preço original
- Apenas novos pedidos usarão o novo preço
- Custos são usados apenas para relatórios

## 🔍 Verificação no Banco

### Ver produtos com custo cadastrado
```sql
SELECT 
  nome,
  preco_padrao,
  custo_unitario,
  preco_padrao - custo_unitario AS lucro_unitario
FROM produtos
WHERE custo_unitario > 0
ORDER BY nome;
```

### Ver produtos SEM custo cadastrado
```sql
SELECT nome, preco_padrao
FROM produtos
WHERE custo_unitario = 0 OR custo_unitario IS NULL
ORDER BY nome;
```

### Atualizar custo em massa (se necessário)
```sql
-- Exemplo: Atualizar todos os Pães de Queijo 5kg
UPDATE produtos
SET custo_unitario = 13.50
WHERE nome LIKE '%Pão de Queijo%5kg%'
  AND (custo_unitario = 0 OR custo_unitario IS NULL);
```

## 📁 Arquivos Modificados

### components/Products.tsx
- ✅ Adicionado `EditProductModal`
- ✅ Adicionado botão de edição nos cards
- ✅ Adicionado botão de edição na tabela
- ✅ Adicionada coluna "Custo" na tabela
- ✅ Estados para controlar modal de edição
- ✅ Função `handleEditProduct`
- ✅ Integração com `updateProduto`

## 🚀 Benefícios

### Para Produtos Antigos
✅ Não precisa recriar produtos  
✅ Atualização rápida e fácil  
✅ Mantém histórico de pedidos  
✅ Cadastro de custo retroativo

### Para Gestão
✅ Análise de lucro completa  
✅ Relatório de Vendas preciso  
✅ Controle de margem  
✅ Decisões baseadas em dados reais

### Para Operação
✅ Interface intuitiva  
✅ Preview de lucro em tempo real  
✅ Validação de dados  
✅ Feedback imediato

## ✅ Checklist de Implementação

- [x] Modal de edição criado
- [x] Campo de custo unitário adicionado
- [x] Preview de lucro em tempo real
- [x] Botão de edição nos cards mobile
- [x] Botão de edição na tabela desktop
- [x] Coluna de custo na tabela
- [x] Integração com updateProduto
- [x] Validação de dados
- [x] Mensagens de feedback
- [x] Dica para cadastrar custo
- [x] Documentação completa

## 🎉 Pronto para Usar!

Agora você pode:
1. ✅ Editar produtos existentes
2. ✅ Cadastrar custo em produtos antigos
3. ✅ Atualizar preços e custos
4. ✅ Ver lucro em tempo real
5. ✅ Usar o Relatório de Vendas com dados completos

---

**Próximo passo**: Cadastre o custo de todos os seus produtos para ter análise completa de lucratividade!
