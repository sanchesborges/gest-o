#!/bin/bash

# Script para commit da funcionalidade Pagamento na Entrega
# Execute: bash commit-pagamento.sh

echo "🚀 Preparando commit: Pagamento na Entrega"
echo ""

# Ver status atual
echo "📋 Status atual:"
git status
echo ""

# Perguntar se quer continuar
read -p "Deseja adicionar todos os arquivos? (s/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]
then
    echo "➕ Adicionando arquivos..."
    
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
    
    echo "✅ Arquivos adicionados!"
    echo ""
    
    # Mostrar status
    echo "📋 Arquivos que serão commitados:"
    git status
    echo ""
    
    # Perguntar se quer fazer o commit
    read -p "Deseja fazer o commit? (s/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]
    then
        echo "💾 Fazendo commit..."
        git commit -m "feat: Implementar pagamento na entrega com suporte a entradas parciais

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

Arquivos: 4 modificados, 14 criados"
        
        echo "✅ Commit realizado!"
        echo ""
        
        # Mostrar último commit
        echo "📝 Último commit:"
        git log -1 --oneline
        echo ""
        
        # Perguntar se quer fazer push
        read -p "Deseja fazer push para o repositório? (s/n) " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Ss]$ ]]
        then
            echo "🚀 Enviando para o repositório..."
            git push origin main
            echo "✅ Push realizado!"
        else
            echo "⏸️  Push cancelado. Execute 'git push origin main' quando estiver pronto."
        fi
    else
        echo "⏸️  Commit cancelado."
    fi
else
    echo "⏸️  Operação cancelada."
fi

echo ""
echo "🎉 Processo finalizado!"
