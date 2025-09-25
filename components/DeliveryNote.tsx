import React, { useRef } from 'react';
import { Pedido, StatusPedido } from '../types';
import { useAppData } from '../hooks/useAppData';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { Download, Edit, Trash2, X, FileText, Send } from 'lucide-react';

export const DeliveryNote: React.FC<{ pedido: Pedido; onClose: () => void }> = ({ pedido, onClose }) => {
  const { clientes, produtos, updatePedidoStatus } = useAppData();
  const cliente = clientes.find(c => c.id === pedido.clienteId);
  const sigCanvas = useRef<SignatureCanvas>(null);
  
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
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="p-4 border rounded-lg bg-slate-50 space-y-2">
                <p><strong>Cliente:</strong><span className="text-gray-700 block">{cliente?.nome}</span></p>
                <p><strong>Pedido:</strong><span className="text-gray-700 block">{pedido.id.toUpperCase()}</span></p>
                <p><strong>Endereço:</strong><span className="text-gray-700 block">{cliente?.endereco}</span></p>
                <p><strong>Data:</strong><span className="text-gray-700 block">{pedido.data.toLocaleDateString('pt-BR')}</span></p>
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

            <div>
                <h4 className="font-semibold mb-2 text-gray-800">Assinatura do Cliente:</h4>
                {pedido.assinatura ? (
                    <img src={pedido.assinatura} alt="Assinatura" className="border-2 rounded-lg bg-white p-2 w-full sm:w-1/2"/>
                ) : (
                    <>
                        <div className="relative w-full border-2 border-dashed rounded-lg">
                             <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">Assine aqui</p>
                             <SignatureCanvas ref={sigCanvas} penColor='black' canvasProps={{className: 'w-full h-40 bg-transparent rounded-lg'}} />
                        </div>
                         <div className="flex space-x-2 mt-2">
                            <button onClick={clearSignature} className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"><Trash2 size={14} className="mr-1"/> Limpar</button>
                        </div>
                    </>
                )}
            </div>
        </div>
        
        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center flex-shrink-0 p-6 bg-gray-50 rounded-b-xl border-t">
          <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 w-full mt-2 sm:w-auto sm:mt-0">Fechar</button>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <button onClick={handleGeneratePdf} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"><Download size={18} className="mr-2"/> Baixar PDF</button>
            {pedido.status !== StatusPedido.ENTREGUE && (
                <button onClick={handleConfirmAndSend} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors text-base"><Send size={18} className="mr-2"/> Confirmar e Enviar</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
