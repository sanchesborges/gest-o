# Edição de Estoque Atual no Modal de Produto

## 📋 Resumo da Funcionalidade

Foi adicionada a capacidade de editar o **Estoque Atual** diretamente no modal de edição de produto na página de **Controle de Estoque**.

## ✨ O que foi implementado

### 1. Campo de Estoque Atual no Modal
- Adicionado campo editável para o estoque atual
- Botões de incremento (+) e decremento (-) para facilitar ajustes
- Visual destacado com fundo verde para identificação rápida
- Indicador visual mostrando o aumento ou redução de estoque em tempo real

### 2. Validação e Feedback
- Não permite valores negativos (mínimo 0)
- Mostra mensagem de confirmação informando a alteração:
  - "Estoque aumentado em X unidades" (quando aumenta)
  - "Estoque diminuído em X unidades" (quando diminui)
- Preview da alteração antes de salvar

## 🔄 Onde as mudanças refletem

### 1. **Banco de Dados (Supabase)**
A alteração é salva diretamente na tabela `produtos`:
```sql
UPDATE produtos 
SET estoque_atual = [novo_valor]
WHERE id = [produto_id]
```

### 2. **Controle de Estoque**
- A lista de produtos é atualizada imediatamente
- O status (BAIXO/OK) é recalculado automaticamente
- Os valores são sincronizados em tempo real

### 3. **Cadastro de Produtos**
- O estoque atualizado aparece na página de produtos
- Mantém consistência entre todas as visualizações

### 4. **Pedidos**
- Ao criar novos pedidos, o sistema usa o estoque atualizado
- Validação de estoque disponível considera o novo valor
- Previne pedidos com estoque insuficiente

### 5. **Relatórios**
- Relatórios de estoque mostram os valores atualizados
- Histórico de movimentações reflete as alterações

## ⚠️ Considerações Importantes

### Diferença entre Edição Manual e Entrada de Estoque

#### Edição Manual (Nova Funcionalidade)
- **Quando usar**: Para correções, ajustes de inventário, perdas, etc.
- **O que faz**: Altera diretamente o valor do estoque
- **Não registra**: Não cria entrada no histórico de entradas_estoque
- **Exemplo**: Produto com estoque 50, você edita para 45 (perda de 5 unidades)

#### Entrada de Estoque (Funcionalidade Existente)
- **Quando usar**: Para registrar recebimento de fornecedor
- **O que faz**: Adiciona quantidade ao estoque existente
- **Registra**: Cria registro em entradas_estoque com fornecedor e data
- **Exemplo**: Produto com estoque 50, você registra entrada de 20 = 70 total

### Impactos no Sistema

1. **Triggers do Banco**
   - A edição manual NÃO aciona triggers de entrada/saída
   - É uma atualização direta do campo estoque_atual
   - Triggers de pedidos continuam funcionando normalmente

2. **Histórico**
   - Alterações manuais não aparecem em "Entradas de Estoque"
   - Recomenda-se documentar grandes ajustes externamente
   - Para rastreabilidade completa, use "Registrar Entrada"

3. **Sincronização**
   - Mudanças são sincronizadas em tempo real
   - Todos os usuários veem o estoque atualizado
   - Cache local é atualizado automaticamente

## 🎯 Casos de Uso

### 1. Correção de Inventário
```
Situação: Contagem física encontrou 45 unidades, mas sistema mostra 50
Solução: Editar produto e ajustar estoque para 45
```

### 2. Perda de Produtos
```
Situação: 3 pacotes foram danificados e descartados
Solução: Editar produto e diminuir 3 unidades do estoque
```

### 3. Ajuste de Estoque Inicial
```
Situação: Produto cadastrado com estoque errado
Solução: Editar produto e corrigir o valor
```

### 4. Transferência entre Locais
```
Situação: Produtos movidos para outro depósito
Solução: Editar produto e ajustar quantidade
```

## 📊 Fluxo de Atualização

```
1. Usuário clica no lápis (Editar) no Controle de Estoque
2. Modal abre com todos os campos do produto
3. Usuário ajusta o Estoque Atual usando +/- ou digitando
4. Sistema mostra preview da alteração
5. Usuário clica em "Salvar Alterações"
6. Sistema atualiza o banco de dados
7. Sistema mostra mensagem de confirmação
8. Lista de produtos é atualizada automaticamente
9. Modal fecha
```

## 🔍 Verificação das Mudanças

### No Supabase
```sql
-- Ver estoque atual de todos os produtos
SELECT nome, estoque_atual, estoque_minimo 
FROM produtos 
WHERE oculto = false
ORDER BY nome;

-- Ver histórico de alterações (se houver auditoria)
SELECT * FROM audit_log 
WHERE table_name = 'produtos' 
AND column_name = 'estoque_atual'
ORDER BY created_at DESC;
```

### Na Interface
1. Abra "Controle de Estoque"
2. Clique no lápis de um produto
3. Altere o estoque atual
4. Salve e verifique se o valor foi atualizado na lista

## 🛡️ Segurança e Permissões

- Apenas usuários ADMIN podem editar produtos
- Alterações são validadas no frontend e backend
- Não permite valores negativos
- Mantém integridade referencial com pedidos

## 📝 Notas Técnicas

### Arquivo Modificado
- `components/Stock.tsx` - Componente EditProductModal

### Função Utilizada
- `updateProduto()` do hook `useAppData.ts`
- Já existia e suporta atualização de estoqueAtual

### Estado Local
```typescript
const [estoqueAtual, setEstoqueAtual] = useState(produto.estoqueAtual);
```

### Validação
```typescript
onChange={e => setEstoqueAtual(Math.max(0, parseInt(e.target.value) || 0))}
```

## 🎨 Interface

O campo de estoque atual possui:
- Fundo verde claro para destaque
- Ícone de pacote (Package)
- Botões grandes de +/- para facilitar uso
- Input centralizado com fonte grande
- Indicador de alteração em tempo real
- Mensagem de confirmação ao salvar

## ✅ Testes Recomendados

1. ✅ Editar estoque aumentando valor
2. ✅ Editar estoque diminuindo valor
3. ✅ Tentar definir valor negativo (deve bloquear)
4. ✅ Verificar se atualiza na lista
5. ✅ Verificar se persiste no banco
6. ✅ Criar pedido após alteração
7. ✅ Verificar em múltiplas abas/dispositivos
