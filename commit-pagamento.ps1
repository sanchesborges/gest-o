# Script PowerShell para commit da funcionalidade Pagamento na Entrega
# Execute: .\commit-pagamento.ps1

Write-Host "🚀 Preparando commit: Pagamento na Entrega" -ForegroundColor Cyan
Write-Host ""

# Ver status atual
Write-Host "📋 Status atual:" -ForegroundColor Yellow
git status
Write-Host ""

# Perguntar se quer continuar
$resposta = Read-Host "Deseja adicionar todos os arquivos? (s/n)"

if ($resposta -eq "s" -or $resposta -eq "S") {
    Write-Host "➕ Adicionando arquivos..." -ForegroundColor Green
    
    # Adicionar arquivos principais
    git add types.ts
    git add components/EntregadorDeliveryView.tsx
    git add components/Financials.tsx
    git add hooks/useAppData.ts
    
    # Adicionar scripts SQL
    git add add-payment-fields.sql
    git add consultas-essenciais-pagamento.sql
    git add consultas-pagamento-entrega-corrigido.sql
    git add consultas-pagamento-entrega.sql
    
    # Adicionar documentação
    git add README_PAGAMENTO_ENTREGA.md
    git add INDICE_PAGAMENTO_ENTREGA.md
    git add RESUMO_FUNCIONALIDADE_PAGAMENTO.md
    git add IMPLEMENTACAO_PAGAMENTO_ENTREGADOR.md
    git add INSTALAR_PAGAMENTO_ENTREGA.md
    git add GUIA_RAPIDO_PAGAMENTO_ENTREGA.md
    git add FLUXO_PAGAMENTO_ENTREGA.md
    git add CORRECAO_ERRO_UUID.md
    git add CORRECAO_TOTAL_PAGO.md
    git add SOLUCAO_FINAL_CONSULTAS_SQL.md
    git add RESUMO_IMPLEMENTACAO_COMPLETA.md
    git add COMMIT_PAGAMENTO_ENTREGA.md
    
    Write-Host "✅ Arquivos adicionados!" -ForegroundColor Green
    Write-Host ""
    
    # Mostrar status
    Write-Host "📋 Arquivos que serão commitados:" -ForegroundColor Yellow
    git status
    Write-Host ""
    
    # Perguntar se quer fazer o commit
    $resposta2 = Read-Host "Deseja fazer o commit? (s/n)"
    
    if ($resposta2 -eq "s" -or $resposta2 -eq "S") {
        Write-Host "💾 Fazendo commit..." -ForegroundColor Green
        
        $commitMessage = @"
feat: Implementar pagamento na entrega com suporte a entradas parciais

✨ Funcionalidades:
- Entregador pode registrar pagamento na entrega
- Suporte a pagamento parcial (entradas)
- Abatimento automático de entradas do valor total
- Total Pago soma pedidos pagos + entradas parciais
- Mensagem WhatsApp com informações de pagamento

🗄️ Banco de Dados:
- Adicionados campos: valor_pago, pagamento_parcial, data_pagamento, metodo_pagamento_entrega

📱 Interface:
- Seção de pagamento na nota do entregador
- 3 opções: Não Pago, Pago Integralmente, Pagamento Parcial
- Cálculo automático de saldo restante
- Validações de valores

💰 Contas a Receber:
- Total Pago agora soma entradas parciais
- Total a Receber mostra saldo atualizado
- Lista de pendentes correta

📊 Consultas SQL:
- 10 consultas essenciais para relatórios
- 16 consultas completas para análises
- Todas testadas e funcionando

📚 Documentação:
- 11 arquivos de documentação completa
- Guias de instalação e uso
- Exemplos práticos e fluxos visuais

🐛 Correções:
- Resolvido erro de tipo UUID em consultas SQL
- Corrigido cálculo de Total Pago em Contas a Receber

Arquivos: 4 modificados, 14 criados
"@
        
        git commit -m $commitMessage
        
        Write-Host "✅ Commit realizado!" -ForegroundColor Green
        Write-Host ""
        
        # Mostrar último commit
        Write-Host "📝 Último commit:" -ForegroundColor Yellow
        git log -1 --oneline
        Write-Host ""
        
        # Perguntar se quer fazer push
        $resposta3 = Read-Host "Deseja fazer push para o repositório? (s/n)"
        
        if ($resposta3 -eq "s" -or $resposta3 -eq "S") {
            Write-Host "🚀 Enviando para o repositório..." -ForegroundColor Green
            git push origin main
            Write-Host "✅ Push realizado!" -ForegroundColor Green
        } else {
            Write-Host "⏸️  Push cancelado. Execute 'git push origin main' quando estiver pronto." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⏸️  Commit cancelado." -ForegroundColor Yellow
    }
} else {
    Write-Host "⏸️  Operação cancelada." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Processo finalizado!" -ForegroundColor Cyan
