import React, { useRef, useState } from 'react';
import { Pedido, StatusPedido } from '../types';
import { useAppData } from '../hooks/useAppData';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { Download, Trash2, X, FileText, Send, Share2, Image as ImageIcon } from 'lucide-react';

export const DeliveryNote: React.FC<{ pedido: Pedido; onClose: () => void }> = ({ pedido, onClose }) => {
  const { clientes, produtos, updatePedidoStatus } = useAppData();
  const cliente = clientes.find(c => c.id === pedido.clienteId);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const isSignatureCanvasEmpty = () => {
    return !sigCanvas.current || sigCanvas.current.isEmpty();
  }

  const generatePdfInstance = (): jsPDF => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Romaneio de Entrega", 105, 20, { align: 'center' });

    // Client Info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Pedido: ${pedido.id.toUpperCase()}`, 20, 40);
    pdf.text(`Data: ${pedido.data.toLocaleDateString('pt-BR')}`, 140, 40);
    pdf.text(`Cliente: ${cliente?.nome}`, 20, 50);
    pdf.text(`Endereço: ${cliente?.endereco}`, 20, 60);
    pdf.text(`Telefone: ${cliente?.telefone}`, 20, 70);

    // Table Header
    pdf.line(20, 80, 190, 80);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Produto", 22, 85);
    pdf.text("Qtd.", 120, 85);
    pdf.text("Preço Unit.", 140, 85);
    pdf.text("Subtotal", 170, 85);
    pdf.line(20, 88, 190, 88);
    
    // Table Body
    let y = 95;
    pdf.setFont('helvetica', 'normal');
    pedido.itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        pdf.text(produto?.nome || 'N/A', 22, y);
        pdf.text(item.quantidade.toString(), 122, y);
        pdf.text(`R$ ${item.precoUnitario.toFixed(2)}`, 142, y);
        pdf.text(`R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`, 172, y);
        y += 7;
    });

    // Total
    pdf.line(20, y, 190, y);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Valor Total:", 140, y + 7);
    pdf.text(`R$ ${pedido.valorTotal.toFixed(2)}`, 172, y + 7);

    // Signature
    if (pedido.assinatura) {
      pdf.text("Assinatura do Cliente:", 20, y + 30);
      pdf.addImage(pedido.assinatura, 'PNG', 20, y + 35, 80, 40);
    } else if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureImage = sigCanvas.current.toDataURL('image/png');
      pdf.text("Assinatura do Cliente:", 20, y + 30);
      pdf.addImage(signatureImage, 'PNG', 20, y + 35, 80, 40);
    }
    
    return pdf;
  };

  const handleGeneratePdf = () => {
    const pdf = generatePdfInstance();
    pdf.save(`romaneio_${pedido.id}.pdf`);
  };

  const captureAsImage = async (): Promise<string> => {
    if (!noteRef.current) return '';
    
    setIsGeneratingImage(true);
    
    try {
      // Encontrar o container pai com scroll
      const scrollContainer = noteRef.current.parentElement;
      
      // Salvar estados originais
      const originalOverflow = noteRef.current.style.overflow;
      const originalHeight = noteRef.current.style.height;
      const originalMaxHeight = noteRef.current.style.maxHeight;
      const originalContainerOverflow = scrollContainer?.style.overflow;
      const originalContainerMaxHeight = scrollContainer?.style.maxHeight;
      
      // Remover restrições de altura e overflow
      noteRef.current.style.overflow = 'visible';
      noteRef.current.style.height = 'auto';
      noteRef.current.style.maxHeight = 'none';
      
      if (scrollContainer) {
        scrollContainer.style.overflow = 'visible';
        scrollContainer.style.maxHeight = 'none';
      }
      
      // Aguardar o DOM atualizar
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Capturar com html2canvas
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(noteRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
      });
      
      // Restaurar estados originais
      noteRef.current.style.overflow = originalOverflow;
      noteRef.current.style.height = originalHeight;
      noteRef.current.style.maxHeight = originalMaxHeight;
      
      if (scrollContainer) {
        scrollContainer.style.overflow = originalContainerOverflow || '';
        scrollContainer.style.maxHeight = originalContainerMaxHeight || '';
      }
      
      const imageData = canvas.toDataURL('image/png', 1.0);
      setIsGeneratingImage(false);
      return imageData;
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
      setIsGeneratingImage(false);
      alert('Erro ao gerar imagem. Tente novamente.');
      return '';
    }
  };

  const handleShareAsImage = async () => {
    const imageData = await captureAsImage();
    if (!imageData) {
      alert('Erro ao gerar imagem da nota');
      return;
    }

    // Converter base64 para blob
    const blob = await (await fetch(imageData)).blob();
    const file = new File([blob], `nota_${pedido.id}.png`, { type: 'image/png' });

    // Tentar usar a API de compartilhamento nativa
    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Nota de Entrega - ${cliente?.nome}`,
          text: `Nota de Entrega - Pedido ${pedido.id}`,
          files: [file],
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: baixar a imagem
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `nota_${pedido.id}.png`;
      link.click();
    }
  };

  const handleShareWhatsApp = async () => {
    const telefone = cliente?.telefone?.replace(/\D/g, '');
    
    const itemsText = pedido.itens.map(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      return `${produto?.nome || 'N/A'} - ${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)} = R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`;
    }).join('%0A');

    const message = `*NOTA DE ENTREGA - MANÁ*%0A%0A` +
                    `*Pedido:* ${pedido.id.toUpperCase()}%0A` +
                    `*Cliente:* ${cliente?.nome}%0A` +
                    `*Data:* ${pedido.data.toLocaleDateString('pt-BR')}%0A` +
                    `*Endereço:* ${cliente?.endereco}%0A%0A` +
                    `*ITENS:*%0A${itemsText}%0A%0A` +
                    `*VALOR TOTAL: R$ ${pedido.valorTotal.toFixed(2)}*%0A%0A` +
                    `_Obrigado pela preferência!_`;

    const whatsappUrl = telefone 
      ? `https://wa.me/55${telefone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  const handleConfirmAndSend = () => {
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
        alert("Por favor, obtenha a assinatura do cliente.");
        return;
    }
    
    // Generate WhatsApp message
    const itemsText = pedido.itens.map(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        return `- ${produto?.nome || 'N/A'} (${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)}) = R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`;
    }).join('\n');

    const markdownMessage = `*ROMANEIO DE ENTREGA*%0A%0A` +
                            `*Pedido:* ${pedido.id.toUpperCase()}%0A` +
                            `*Cliente:* ${cliente?.nome}%0A` +
                            `*Data:* ${pedido.data.toLocaleDateString('pt-BR')}%0A` +
                            `%0A---%0A*Itens:*%0A${itemsText}%0A---%0A` +
                            `*VALOR TOTAL: R$ ${pedido.valorTotal.toFixed(2)}*%0A%0A` +
                            `_Entrega confirmada._`;

    const encodedMessage = markdownMessage; // No double encoding
    
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    
    // Update status in app
    const signature = sigCanvas.current!.toDataURL('image/png');
    updatePedidoStatus(pedido.id, StatusPedido.ENTREGUE, signature);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl relative">
            <div className="flex items-center">
                <FileText className="text-indigo-600 mr-3" size={28}/>
                <h2 className="text-2xl font-bold text-gray-800">Nota de Entrega</h2>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800 absolute top-4 right-4 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto bg-gray-100 p-4" id="note-scroll-container">
            <div ref={noteRef} className="space-y-4 bg-white p-6 rounded-lg shadow-lg min-h-full">
                {/* Cabeçalho da Nota */}
                <div className="text-center border-b-2 border-indigo-600 pb-4 mb-4">
                    <h1 className="text-3xl font-bold text-indigo-600">MANÁ</h1>
                    <p className="text-sm text-gray-600">Produtos Congelados</p>
                    <p className="text-xs text-gray-500 mt-1">NOTA DE ENTREGA</p>
                </div>

            <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Pedido</p>
                        <p className="font-bold text-gray-800">{pedido.id.toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Data</p>
                        <p className="font-bold text-gray-800">{pedido.data.toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                <div className="border-t pt-2">
                    <p className="text-xs text-gray-500 uppercase">Cliente</p>
                    <p className="font-bold text-gray-800">{cliente?.nome}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Endereço</p>
                    <p className="text-gray-700">{cliente?.endereco}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase">Telefone</p>
                    <p className="text-gray-700">{cliente?.telefone}</p>
                </div>
            </div>
            
            {/* Mobile Items View */}
            <div className="md:hidden space-y-3">
              <h4 className="font-semibold text-gray-800">Itens do Pedido:</h4>
              {pedido.itens.map(item => {
                const produto = produtos.find(p => p.id === item.produtoId);
                return (
                  <div key={item.produtoId} className="bg-white border rounded-lg p-3">
                    <p className="font-semibold text-gray-900">{produto?.nome}</p>
                    <p className="text-sm text-gray-600">Qtd: {item.quantidade} x R$ {item.precoUnitario.toFixed(2)}</p>
                    <p className="text-right font-bold text-gray-800 mt-1">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</p>
                  </div>
                );
              })}
               <div className="font-semibold text-gray-900 bg-gray-100 p-3 rounded-lg flex justify-between items-center mt-3">
                  <span className="text-base">TOTAL:</span>
                  <span className="text-lg">R$ {pedido.valorTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Desktop Items Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Produto</th>
                            <th scope="col" className="px-6 py-3 text-center">Qtd</th>
                            <th scope="col" className="px-6 py-3 text-right">Preço Unit.</th>
                            <th scope="col" className="px-6 py-3 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedido.itens.map(item => {
                            const produto = produtos.find(p => p.id === item.produtoId);
                            return (
                                <tr key={item.produtoId} className="bg-white border-b odd:bg-white even:bg-slate-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{produto?.nome}</th>
                                    <td className="px-6 py-4 text-center">{item.quantidade}</td>
                                    <td className="px-6 py-4 text-right">R$ {item.precoUnitario.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="font-semibold text-gray-900 bg-gray-100">
                            <td colSpan={3} className="px-6 py-3 text-right text-base">TOTAL:</td>
                            <td className="px-6 py-3 text-right text-base">R$ {pedido.valorTotal.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="mt-6 pb-4">
                <h4 className="font-semibold mb-3 text-gray-800">Assinatura do Cliente:</h4>
                {pedido.assinatura ? (
                    <div className="border-2 rounded-lg bg-white p-2 w-full sm:w-1/2">
                        <img src={pedido.assinatura} alt="Assinatura" className="w-full h-auto"/>
                    </div>
                ) : (
                    <>
                        <div className="relative w-full border-2 border-dashed rounded-lg bg-gray-50">
                             <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">Assine aqui</p>
                             <SignatureCanvas ref={sigCanvas} penColor='black' canvasProps={{className: 'w-full h-40 bg-transparent rounded-lg'}} />
                        </div>
                         <div className="flex space-x-2 mt-2">
                            <button onClick={clearSignature} className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"><Trash2 size={14} className="mr-1"/> Limpar</button>
                        </div>
                    </>
                )}
            </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col gap-3 flex-shrink-0 p-6 bg-gray-50 rounded-b-xl border-t">
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <button 
              onClick={handleShareAsImage} 
              disabled={isGeneratingImage}
              className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors disabled:bg-purple-300"
            >
              <ImageIcon size={18} className="mr-2"/> 
              {isGeneratingImage ? 'Gerando...' : 'Compartilhar Imagem'}
            </button>
            <button 
              onClick={handleShareWhatsApp} 
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
            >
              <Share2 size={18} className="mr-2"/> WhatsApp
            </button>
            <button 
              onClick={handleGeneratePdf} 
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <Download size={18} className="mr-2"/> PDF
            </button>
          </div>
          
          {pedido.status !== StatusPedido.ENTREGUE && (
            <button 
              onClick={handleConfirmAndSend} 
              className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors text-base w-full"
            >
              <Send size={20} className="mr-2"/> Confirmar Entrega
            </button>
          )}
          
          <button 
            onClick={onClose} 
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 w-full"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
