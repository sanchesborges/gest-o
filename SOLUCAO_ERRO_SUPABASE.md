# 🔧 Solução: Erro de Conexão com Supabase

## 🐛 Erro Identificado

```
❌ Erro ao buscar produto: {
  message: 'TypeError: Failed to fetch',
  code: ''
}
```

## 🔍 Causa

O erro **"Failed to fetch"** indica que o navegador não consegue se conectar ao Supabase. Possíveis causas:

1. **Projeto Supabase pausado** (inatividade)
2. **Problema de rede/firewall**
3. **CORS bloqueado**
4. **Servidor Supabase offline**

## ✅ Soluções

### Solução 1: Verificar Status do Projeto Supabase

1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto: `bkwgowsumeylnwbintdz`
4. Verifique se o projeto está **ATIVO** (não pausado)
5. Se estiver pausado, clique em **"Resume Project"**

### Solução 2: Testar Conexão

1. Abra o arquivo `test-supabase-now.html` no navegador
2. Clique em **"1. Testar Conexão"**
3. Se aparecer ✅ "CONEXÃO OK", o Supabase está funcionando
4. Se aparecer ❌ erro, veja as soluções abaixo

### Solução 3: Verificar Configuração de CORS

No painel do Supabase:

1. Vá em **Settings** → **API**
2. Role até **CORS Configuration**
3. Adicione: `http://localhost:5173` (ou a porta que você está usando)
4. Salve as alterações

### Solução 4: Modo Offline (Temporário)

Se o Supabase continuar offline, o sistema agora funciona em **modo offline**:

- ✅ Dados são salvos no **localStorage**
- ⚠️ Ao recarregar a página, os dados podem ser perdidos
- 💡 Quando o Supabase voltar, recarregue a página

## 🔄 Correções Aplicadas

### Arquivo: `hooks/useAppData.ts`

Agora a função `addEntradaEstoque` tem **fallback completo**:

```typescript
// Se Supabase falhar, salva localmente
if (fetchError) {
  console.warn('⚠️ MODO OFFLINE: Atualizando apenas localmente');
  
  setProdutos(prevProdutos => {
    return prevProdutos.map(p => {
      if (p.id === entradaData.produtoId) {
        return { ...p, estoqueAtual: p.estoqueAtual + entradaData.quantidade };
      }
      return p;
    });
  });
  
  // Salva no localStorage
  setEntradasEstoque(prev => [...prev, newEntrada]);
  saveToStorage('entradasEstoque', [...prev, newEntrada]);
  
  return;
}
```

## 🧪 Como Testar

### Teste 1: Com Supabase Online

1. Certifique-se que o Supabase está ativo
2. Abra a aplicação
3. Vá em **Controle de Estoque**
4. Adicione 10 unidades de um produto
5. Verifique que o estoque aumentou corretamente
6. Recarregue a página (F5)
7. Verifique que o estoque permanece correto

### Teste 2: Com Supabase Offline

1. Desconecte a internet (ou pause o projeto Supabase)
2. Abra a aplicação
3. Vá em **Controle de Estoque**
4. Adicione 10 unidades
5. Você verá: **"⚠️ Supabase offline! A entrada foi salva localmente."**
6. O estoque será atualizado na tela
7. ⚠️ Ao recarregar, os dados podem ser perdidos

## 📊 Logs Esperados

### Com Supabase Online:

```
📦 [INICIO] Salvando entrada de estoque...
   🔍 Buscando estoque atual do banco...
   📊 Estoque no BANCO: 10
   ➕ Quantidade: 10
   🎯 Novo estoque: 20
   💾 Atualizando banco...
   ✅ Banco atualizado com sucesso!
   📝 Salvando registro de entrada...
   ✅ Entrada registrada!
   🔄 Atualizando estado local...
   📦 Produto X: 10 → 20
✅ [FIM] Entrada de estoque concluída com sucesso!
```

### Com Supabase Offline:

```
📦 [INICIO] Salvando entrada de estoque...
   🔍 Buscando estoque atual do banco...
❌ Erro ao buscar produto do Supabase: {message: 'Failed to fetch'}
⚠️ MODO OFFLINE: Atualizando apenas localmente
   📦 Produto X: 10 + 10 = 20
✅ [FIM] Entrada salva LOCALMENTE (Supabase offline)
```

## 🚀 Próximos Passos

1. **Verifique o status do Supabase** no dashboard
2. **Teste a conexão** com `test-supabase-now.html`
3. **Se estiver online**, teste adicionar estoque novamente
4. **Observe os logs** no console do navegador (F12)
5. **Me envie os logs** se o problema persistir

## 📁 Arquivos Modificados

- ✅ `hooks/useAppData.ts` - Adicionado fallback offline completo
- ✅ `test-supabase-now.html` - Ferramenta de teste de conexão
- ✅ `SOLUCAO_ERRO_SUPABASE.md` - Esta documentação
