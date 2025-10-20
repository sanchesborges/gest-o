# Implementation Plan

- [x] 1. Criar componente OrderConfirmationModal


  - Criar novo arquivo `components/OrderConfirmationModal.tsx`
  - Definir interfaces TypeScript (OrderConfirmationModalProps, PedidoFabrica, ProdutoPedido)
  - Implementar estrutura básica do componente com props e state
  - Adicionar ref para captura de conteúdo (orderRef)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_


- [ ] 1.1 Implementar layout do modal
  - Criar header com ícone de sucesso e título
  - Criar seção de informações (data, hora, fornecedor)
  - Criar área de lista de produtos
  - Criar seção de totais
  - Criar footer com botões de ação
  - _Requirements: 6.1, 6.2, 6.3, 6.7_


- [ ] 1.2 Implementar OrderSummary (lista de produtos)
  - Buscar dados dos produtos do contexto useAppData
  - Ordenar produtos alfabeticamente
  - Renderizar card para cada produto com nome, tamanho e quantidade
  - Calcular e exibir total de produtos

  - Calcular e exibir total de unidades
  - _Requirements: 6.4, 6.5, 6.6, 6.7_

- [ ] 2. Implementar função generateWhatsAppText
  - Formatar data e hora (dd/mm/aaaa HH:mm)
  - Criar cabeçalho com título e separador
  - Adicionar informações de data e fornecedor
  - Iterar sobre produtos e formatar cada um
  - Adicionar totais no final
  - Usar %0A para quebras de linha

  - Usar formatação Markdown (negrito com *)
  - Retornar string formatada
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 3. Implementar função shareViaWhatsApp

  - Chamar generateWhatsAppText()
  - Construir URL do WhatsApp (https://wa.me/?text=)
  - Abrir em nova aba com window.open()
  - _Requirements: 2.2_

- [ ] 4. Implementar função exportAsImage
  - Adicionar estado isExporting e exportType
  - Verificar se orderRef.current existe
  - Usar html2canvas para capturar conteúdo (scale: 2, backgroundColor: white)
  - Converter canvas para blob
  - Criar link de download com nome "pedido-fabrica-mana-[timestamp].png"

  - Fazer download automático
  - Limpar URL após download
  - Mostrar feedback de sucesso/erro
  - Gerenciar estado de loading
  - _Requirements: 2.3, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ] 5. Implementar função exportAsPDF
  - Adicionar estado isExporting e exportType
  - Verificar se orderRef.current existe
  - Usar html2canvas para capturar conteúdo
  - Converter canvas para dataURL
  - Criar documento jsPDF (formato A4, portrait)

  - Calcular dimensões da imagem
  - Adicionar imagem ao PDF
  - Fazer download com nome "pedido-fabrica-mana-[timestamp].pdf"
  - Mostrar feedback de sucesso/erro
  - Gerenciar estado de loading
  - _Requirements: 2.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 6. Implementar botões de exportação
  - Criar botão WhatsApp (verde) com ícone Share2

  - Criar botão Salvar Imagem (azul) com ícone Download
  - Criar botão Exportar PDF (vermelho) com ícone Download
  - Adicionar onClick handlers para cada botão
  - Mostrar loading state durante exportação
  - Desabilitar botões durante exportação
  - Adicionar aria-labels para acessibilidade
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.2_



- [ ] 7. Implementar botão Fechar
  - Criar botão Fechar/Concluir no footer
  - Adicionar onClick para chamar onClose()
  - Adicionar botão X no header
  - Permitir fechar clicando fora do modal
  - Adicionar animação de saída

  - _Requirements: 2.5, 7.1, 7.5, 7.6_


- [ ] 8. Modificar AddStockModal para integração
  - Adicionar estado showConfirmation (boolean)
  - Adicionar estado registeredItems (ItemEntrada[])
  - Adicionar estado registeredDate (Date)
  - Adicionar estado registeredFornecedor (string)
  - _Requirements: 9.1, 9.2, 9.3_


- [ ] 8.1 Modificar função handleSubmit
  - Salvar itens antes de registrar (itemsToRegister)
  - Salvar data de registro (new Date())
  - Salvar fornecedor

  - Registrar entradas no sistema (loop forEach)
  - Atualizar estados (setRegisteredItems, setRegisteredDate, setRegisteredFornecedor)
  - Abrir modal de confirmação (setShowConfirmation(true))
  - NÃO fechar modal de entrada ainda
  - _Requirements: 9.1, 9.4_


- [ ] 8.2 Adicionar função handleCloseAll
  - Fechar modal de confirmação (setShowConfirmation(false))
  - Fechar modal de entrada (onClose())
  - Resetar estados
  - _Requirements: 9.2, 9.3_

- [x] 8.3 Renderizar OrderConfirmationModal condicionalmente

  - Adicionar condicional {showConfirmation && ...}
  - Passar props: produtos, fornecedor, dataRegistro, onClose
  - Posicionar após o modal de entrada
  - _Requirements: 1.2, 9.5_

- [ ] 9. Implementar validações e edge cases
  - Validar se há produtos antes de abrir modal (length > 0)
  - Tratar fornecedor vazio (mostrar "Não informado")

  - Usar singular/plural corretamente (1 produto vs X produtos)
  - Tratar erros de exportação com try/catch
  - Mostrar mensagens de erro amigáveis
  - Permitir tentar novamente após erro
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 10. Implementar responsividade
  - Usar classes Tailwind responsivas (sm:, md:, lg:)

  - Modal full-screen em mobile
  - Modal com max-width em desktop
  - Botões empilhados em mobile, lado a lado em desktop
  - Texto adaptado para mobile (abreviações)
  - Grid responsivo para lista de produtos
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 11. Adicionar feedback visual e UX

  - Adicionar animação de entrada do modal (fade + scale)
  - Adicionar loading spinner durante exportação
  - Adicionar mensagens de sucesso (alert ou toast)
  - Adicionar mensagens de erro (alert ou toast)
  - Adicionar hover effects nos botões
  - Adicionar disabled state nos botões durante loading
  - _Requirements: 7.1, 7.2, 7.3, 7.4_


- [ ] 12. Adicionar acessibilidade
  - Adicionar aria-labels em todos os botões
  - Adicionar role="dialog" no modal
  - Adicionar aria-modal="true"
  - Implementar trap de foco no modal
  - Permitir fechar com tecla Esc
  - Adicionar aria-live para anúncios de sucesso/erro
  - _Requirements: 7.6_

- [ ] 13. Estilizar componente
  - Aplicar cores do design (verde, azul, vermelho, cinza)

  - Adicionar sombras e bordas
  - Adicionar espaçamentos consistentes
  - Usar gradientes nos botões principais
  - Adicionar transições suaves
  - Garantir contraste adequado para acessibilidade
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 14. Testar integração completa
  - Testar fluxo completo: entrada → confirmação → exportação
  - Testar com 1 produto
  - Testar com múltiplos produtos
  - Testar WhatsApp em diferentes dispositivos
  - Testar download de imagem
  - Testar download de PDF
  - Testar fechamento dos modais
  - Testar em diferentes navegadores
  - Verificar se estoque foi atualizado corretamente
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 15. Documentar funcionalidade
  - Criar arquivo ENVIO_PEDIDO_FABRICA.md com guia de uso
  - Adicionar exemplos de mensagens WhatsApp
  - Adicionar screenshots (se possível)
  - Documentar casos de uso
  - Adicionar troubleshooting
  - _Requirements: todos_
