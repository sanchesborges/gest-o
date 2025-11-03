import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import SignatureCanvas from 'react-signature-canvas';
import { ArrowLeft, CheckCircle, Trash2, Package } from 'lucide-react';
import { StatusPedido } from '../types';

export const EntregadorDeliveryView: React.FC = () => {
  const { entregadorId, pedidoId } = useParams<{ entregadorId: string; pedidoId: string }>();
  const navigate = useNavigate();
  const { pedidos, clientes, produtos, updatePedidoStatus } = useAppData();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('📱 EntregadorDeliveryView carregado:', { entregadorId, pedidoId });

  const pedido = pedidos.find(p => p.id === pedidoId);
  const cliente = pedido ? clientes.find(c => c.id === pedido.clienteId) : null;

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pedido não encontrado</h2>
          <p className="text-gray-600 mb-4">O pedido solicitado não existe ou já foi entregue.</p>
          <button
            onClick={() => navigate(`/entregador/${entregadorId}`)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Voltar para Pedidos
          </button>
        </div>
      </div>
    );
  }

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleConfirmDelivery = async () => {
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      alert("Por favor, obtenha a assinatura do cliente.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Gerar mensagem formatada para WhatsApp
      const itemsText = pedido.itens.map(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        return `- ${produto?.nome || 'N/A'} (${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)}) = R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`;
      }).join('%0A');

      const markdownMessage = `*ROMANEIO DE ENTREGA*%0A%0A` +
                              `*Pedido:* ${pedido.id.toUpperCase()}%0A` +
                              `*Cliente:* ${cliente?.nome}%0A` +
                              `*Data:* ${pedido.data.toLocaleDateString('pt-BR')}%0A` +
                              `%0A---%0A*Itens:*%0A${itemsText}%0A---%0A` +
                              `*VALOR TOTAL: R$ ${pedido.valorTotal.toFixed(2)}*%0A%0A` +
                              `_Entrega confirmada._`;

      // 2. Atualizar status no sistema
      const signature = sigCanvas.current!.toDataURL('image/png');
      await updatePedidoStatus(pedido.id, StatusPedido.ENTREGUE, signature);
      
      // 3. Abrir WhatsApp com a mensagem
      window.open(`https://wa.me/?text=${markdownMessage}`, '_blank');
      
      // 4. Mostrar confirmação e voltar
      alert('✅ Entrega confirmada com sucesso!');
      navigate(`/entregador/${entregadorId}`);
    } catch (error) {
      console.error('Erro ao confirmar entrega:', error);
      alert('❌ Erro ao confirmar entrega. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => navigate(`/entregador/${entregadorId}`)}
            className="flex items-center text-white hover:text-indigo-200"
          >
            <ArrowLeft size={24} className="mr-2" />
            Voltar
          </button>
          <h1 className="text-xl font-bold">Confirmar Entrega</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Cabeçalho da Nota */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center border-b-2 border-indigo-600 pb-4 mb-4">
            <h1 className="text-3xl font-bold text-indigo-600">MANÁ</h1>
            <p className="text-sm text-gray-600">Produtos Congelados</p>
            <p className="text-xs text-gray-500 mt-1">NOTA DE ENTREGA</p>
          </div>

          {/* Informações do Pedido */}
          <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 space-y-3">
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
              <p className="font-bold text-gray-800 text-lg">{cliente?.nome}</p>
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
        </div>

        {/* Itens do Pedido */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Itens do Pedido</h3>
          <div className="space-y-3">
            {pedido.itens.map(item => {
              const produto = produtos.find(p => p.id === item.produtoId);
              return (
                <div key={item.produtoId} className="bg-gray-50 border rounded-lg p-4">
                  <p className="font-semibold text-gray-900 text-lg">{produto?.nome}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">
                      {item.quantidade} x R$ {item.precoUnitario.toFixed(2)}
                    </p>
                    <p className="font-bold text-gray-800 text-lg">
                      R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Total */}
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
              <span className="text-lg font-bold text-gray-800">VALOR TOTAL:</span>
              <span className="text-2xl font-bold text-indigo-600">
                R$ {pedido.valorTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Assinatura */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Assinatura do Cliente</h3>
          
          {pedido.assinatura ? (
            <div className="border-2 rounded-lg bg-white p-2">
              <img src={pedido.assinatura} alt="Assinatura" className="w-full h-auto"/>
              <p className="text-center text-sm text-green-600 mt-2 font-semibold">
                ✅ Entrega já confirmada
              </p>
            </div>
          ) : (
            <>
              <div className="relative w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                  Assine aqui com o dedo
                </p>
                <SignatureCanvas 
                  ref={sigCanvas} 
                  penColor='black' 
                  canvasProps={{
                    className: 'w-full h-48 bg-transparent rounded-lg touch-action-none'
                  }} 
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={clearSignature} 
                  className="flex-1 flex items-center justify-center text-sm text-gray-600 hover:text-red-600 transition-colors font-medium border border-gray-300 rounded-lg py-2"
                >
                  <Trash2 size={16} className="mr-1"/> Limpar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Botão de Confirmar */}
        {pedido.status !== StatusPedido.ENTREGUE && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <button
              onClick={handleConfirmDelivery}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors text-lg disabled:bg-gray-400"
            >
              <CheckCircle size={24} className="mr-2" />
              {isSubmitting ? 'Confirmando...' : 'Confirmar Entrega'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
