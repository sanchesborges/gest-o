# 🧪 Como Testar a Edição de Clientes

## ✅ CHECKLIST DE TESTE

### 1. Verificar Interface
- [ ] Abrir página "Cadastro de Clientes"
- [ ] Verificar se o ícone de lápis aparece no canto superior direito de cada card
- [ ] Verificar se o ícone tem hover (fundo azul claro)

### 2. Abrir Modal de Edição
- [ ] Clicar no ícone de lápis de um cliente
- [ ] Verificar se o modal abre com título "Editar Cliente"
- [ ] Verificar se todos os campos estão pré-preenchidos com os dados atuais

### 3. Editar Informações
- [ ] Alterar o nome do cliente
- [ ] Alterar o endereço
- [ ] Alterar o telefone
- [ ] Alterar o tipo de cliente
- [ ] Alterar a condição de pagamento

### 4. Salvar Alterações
- [ ] Clicar em "Salvar"
- [ ] Verificar se o botão mostra "Salvando..."
- [ ] Verificar se o modal fecha após salvar
- [ ] Verificar se as alterações aparecem no card do cliente

### 5. Verificar Persistência
- [ ] Recarregar a página (F5)
- [ ] Verificar se as alterações foram mantidas
- [ ] Abrir o Supabase e verificar se os dados foram atualizados na tabela `clientes`

### 6. Testar Cancelamento
- [ ] Abrir modal de edição
- [ ] Fazer alterações
- [ ] Clicar em "Cancelar"
- [ ] Verificar se as alterações não foram salvas

### 7. Testar Validação
- [ ] Abrir modal de edição
- [ ] Tentar limpar o campo "Nome"
- [ ] Tentar salvar
- [ ] Verificar se aparece mensagem de campo obrigatório

## 🎯 CENÁRIOS DE TESTE

### Cenário 1: Correção de Telefone
1. Cliente: "Padaria do João"
2. Telefone atual: "94991234567"
3. Novo telefone: "94998765432"
4. Resultado esperado: Telefone atualizado no card e no banco

### Cenário 2: Mudança de Endereço
1. Cliente: "Mercado Central"
2. Endereço atual: "Rua A, 123"
3. Novo endereço: "Avenida B, 456"
4. Resultado esperado: Endereço atualizado

### Cenário 3: Alteração de Condição de Pagamento
1. Cliente: "Restaurante Bom Sabor"
2. Condição atual: "À vista"
3. Nova condição: "30 dias"
4. Resultado esperado: Condição atualizada

## 🐛 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema: Botão de editar não aparece
**Solução**: Verificar se está logado como ADMIN

### Problema: Alterações não são salvas
**Solução**: 
1. Verificar console do navegador (F12) para erros
2. Verificar conexão com Supabase
3. Verificar permissões da tabela `clientes` no Supabase

### Problema: Modal não abre
**Solução**: 
1. Verificar console para erros JavaScript
2. Recarregar a página
3. Limpar cache do navegador

## 📊 VERIFICAÇÃO NO SUPABASE

Execute esta query no Supabase SQL Editor para ver as alterações:

```sql
SELECT 
    id,
    nome,
    tipo,
    endereco,
    telefone,
    condicao_pagamento,
    updated_at
FROM clientes
ORDER BY updated_at DESC
LIMIT 10;
```

## ✅ RESULTADO ESPERADO

Após todas as alterações:
- ✅ Interface atualizada imediatamente
- ✅ Dados persistidos no Supabase
- ✅ Sem erros no console
- ✅ Experiência fluida e responsiva
