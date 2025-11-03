# 🚀 Como Fazer o Commit

## 🎯 Opções Disponíveis

Você tem 3 formas de fazer o commit:

### 1️⃣ Usando Script Automático (RECOMENDADO)

#### No Windows (PowerShell):
```powershell
.\commit-pagamento.ps1
```

#### No Linux/Mac (Bash):
```bash
bash commit-pagamento.sh
```

O script vai:
- ✅ Mostrar status dos arquivos
- ✅ Adicionar todos os arquivos automaticamente
- ✅ Fazer o commit com mensagem completa
- ✅ Perguntar se quer fazer push

### 2️⃣ Comandos Manuais (Passo a Passo)

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer o commit
git commit -m "feat: Implementar pagamento na entrega com suporte a entradas parciais"

# 4. Enviar para o repositório
git push origin main
```

### 3️⃣ Usando o Guia Completo

Abra o arquivo `COMMIT_PAGAMENTO_ENTREGA.md` e siga as instruções detalhadas.

## ⚡ Início Rápido (Mais Simples)

### Windows:
```powershell
# Abra o PowerShell na pasta do projeto e execute:
.\commit-pagamento.ps1
```

### Linux/Mac:
```bash
# Abra o terminal na pasta do projeto e execute:
bash commit-pagamento.sh
```

### Ou manualmente:
```bash
git add .
git commit -m "feat: Pagamento na entrega com entradas parciais"
git push origin main
```

## 📋 O Que Será Commitado

### Arquivos Modificados (4):
- `types.ts` - Interface Pedido atualizada
- `components/EntregadorDeliveryView.tsx` - Interface de pagamento
- `components/Financials.tsx` - Total Pago corrigido
- `hooks/useAppData.ts` - Lógica de atualização

### Arquivos Novos (14):
- `add-payment-fields.sql` - Script de instalação
- `consultas-essenciais-pagamento.sql` - Consultas principais
- `consultas-pagamento-entrega-corrigido.sql` - Consultas completas
- `README_PAGAMENTO_ENTREGA.md` - README principal
- `INDICE_PAGAMENTO_ENTREGA.md` - Índice
- `RESUMO_FUNCIONALIDADE_PAGAMENTO.md` - Resumo executivo
- `IMPLEMENTACAO_PAGAMENTO_ENTREGADOR.md` - Detalhes técnicos
- `INSTALAR_PAGAMENTO_ENTREGA.md` - Guia de instalação
- `GUIA_RAPIDO_PAGAMENTO_ENTREGA.md` - Guia para entregadores
- `FLUXO_PAGAMENTO_ENTREGA.md` - Fluxos visuais
- `CORRECAO_ERRO_UUID.md` - Solução erro UUID
- `CORRECAO_TOTAL_PAGO.md` - Correção Total Pago
- `SOLUCAO_FINAL_CONSULTAS_SQL.md` - Guia de consultas
- `RESUMO_IMPLEMENTACAO_COMPLETA.md` - Resumo completo

**Total: 18 arquivos**

## ✅ Checklist Antes de Commitar

- [ ] Código testado e funcionando
- [ ] Script SQL executado no Supabase
- [ ] Interface do entregador testada
- [ ] Total Pago mostrando valor correto
- [ ] Consultas SQL funcionando
- [ ] Sem erros de compilação

## 🎯 Mensagem do Commit

A mensagem do commit inclui:
- ✨ Funcionalidades implementadas
- 🗄️ Mudanças no banco de dados
- 📱 Mudanças na interface
- 💰 Correções em Contas a Receber
- 📊 Consultas SQL criadas
- 📚 Documentação adicionada
- 🐛 Bugs corrigidos

## 🚀 Após o Commit

### Verificar se foi enviado:
```bash
git log -1
```

### Ver arquivos do commit:
```bash
git show --name-only
```

### Ver no GitHub/GitLab:
Acesse seu repositório e veja o último commit.

## 🆘 Problemas Comuns

### Erro: "Permission denied"
**Solução (Windows):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\commit-pagamento.ps1
```

### Erro: "Not a git repository"
**Solução:**
```bash
# Certifique-se de estar na pasta do projeto
cd caminho/do/projeto
git status
```

### Erro: "Nothing to commit"
**Solução:**
```bash
# Verifique se há mudanças
git status

# Se houver mudanças não salvas
git add .
git commit -m "feat: Pagamento na entrega"
```

### Erro ao fazer push
**Solução:**
```bash
# Puxar mudanças primeiro
git pull origin main

# Depois fazer push
git push origin main
```

## 📚 Documentação Adicional

- **Guia Completo:** `COMMIT_PAGAMENTO_ENTREGA.md`
- **Comandos Git:** `GIT_COMMANDS.md`
- **Resumo da Implementação:** `RESUMO_IMPLEMENTACAO_COMPLETA.md`

## 🎉 Pronto!

Escolha uma das opções acima e faça o commit da sua funcionalidade!

---

**Recomendação:** Use o script automático (`commit-pagamento.ps1` ou `commit-pagamento.sh`) para facilitar o processo.
