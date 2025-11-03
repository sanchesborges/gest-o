# 🎯 INSTRUÇÕES FINAIS - Resolver Erro de Duplicação

## 🐛 Problema

Ao adicionar estoque, a quantidade está duplicando E aparece erro:
```
❌ Erro ao buscar produto do Supabase: {message: 'TypeError: Failed to fetch'}
```

## ✅ SOLUÇÃO (Siga na Ordem)

### PASSO 1: Limpar Cache do Navegador

**Opção A - Automático (Recomendado):**

1. Abra o Console do Navegador (F12)
2. Copie TODO o conteúdo do arquivo `limpar-cache-navegador.js`
3. Cole no console e pressione Enter
4. Aguarde a página recarregar automaticamente

**Opção B - Manual:**

1. Abra DevTools (F12)
2. Vá em **Application** (ou Aplicativo)
3. No menu lateral, clique em **Clear storage**
4. Marque todas as opções
5. Clique em **Clear site data**
6. Feche e abra o navegador novamente

### PASSO 2: Reiniciar Servidor de Desenvolvimento

No terminal onde o servidor está rodando:

```bash
# 1. Parar o servidor (Ctrl+C)

# 2. Limpar cache do Vite
rmdir /s /q node_modules\.vite

# 3. Reiniciar
npm run dev
```

### PASSO 3: Testar Novamente

1. Acesse a aplicação
2. Abra o Console (F12)
3. Vá em **Controle de Estoque**
4. Clique em **Registrar Entrada**
5. Adicione 10 unidades de um produto
6. Observe os logs no console

## 📊 Logs Esperados (Sucesso)

```
📦 [INICIO] Salvando entrada de estoque...
   Produto ID: xxx
   Quantidade a ADICIONAR: 10
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

## 🔧 O Que Foi Corrigido

### 1. **lib/supabase.ts**
- Adicionadas configurações de headers e autenticação

### 2. **vite.config.ts**
- Service Worker configurado para NÃO cachear Supabase
- Requisições do Supabase sempre vão direto para a rede

### 3. **hooks/useAppData.ts**
- Função `addEntradaEstoque` refatorada
- Busca estoque do banco ANTES de atualizar
- Atualiza estado local com valor EXATO do banco
- Fallback completo para modo offline

### 4. **components/Stock.tsx**
- Logs detalhados para debug
- useMemo para evitar re-renders desnecessários

## ❓ Se Ainda Não Funcionar

### Teste 1: Verificar Supabase Diretamente

Abra uma nova aba e acesse:
```
https://bkwgowsumeylnwbintdz.supabase.co
```

Deve aparecer uma página do Supabase (não erro 404).

### Teste 2: Modo Anônimo

1. Abra uma janela anônima (Ctrl+Shift+N)
2. Acesse a aplicação
3. Teste adicionar estoque
4. Se funcionar → problema é cache
5. Se não funcionar → problema é rede/firewall

### Teste 3: Verificar Firewall/Antivírus

Alguns antivírus bloqueiam requisições fetch. Tente:
1. Desabilitar temporariamente o antivírus
2. Adicionar exceção para localhost
3. Verificar configurações de firewall

## 📞 Próximos Passos

Depois de seguir TODOS os passos acima:

1. Me envie os logs COMPLETOS do console
2. Diga se funcionou ou não
3. Se não funcionou, me envie:
   - Screenshot do erro
   - Resultado do teste em modo anônimo
   - Resultado de acessar o Supabase diretamente

## 🎯 Resumo Rápido

```
1. Limpar cache (limpar-cache-navegador.js)
2. Reiniciar servidor (Ctrl+C → npm run dev)
3. Testar adicionar estoque
4. Verificar logs no console
5. Me enviar resultado
```

Vamos resolver isso! 💪
