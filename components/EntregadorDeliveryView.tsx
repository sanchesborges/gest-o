import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import SignatureCanvas from 'react-signature-canvas';
import { ArrowLeft, CheckCircle, Trash2, Package, Send } from 'lucide-react';
import { StatusPedido } from '../types';

export const EntregadorDeliveryView: React.FC = () => {
  const { entregadorId, pedidoId } = useParams<{ entregadorId: string; pedidoId: string }>();
  const navigate = useNavigate();
  const { pedidos, clientes, produtos, updatePedidoStatus } = useAppData();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagamentoStatus, setPagamentoStatus] = useState<'nao_pago' | 'pago' | 'parcial'>('nao_pago');
  const [valorEntrada, setValorEntrada] = useState<string>('');

  console.log('📱 EntregadorDeliveryView carregado:', { entregadorId, pedidoId });

  // Corrigir dimensões do canvas de assinatura
  React.useEffect(() => {
    const resizeCanvas = () => {
      const canvas = sigCanvas.current?.getCanvas();
      if (canvas) {
        const container = canvas.parentElement;
        if (container) {
          // Definir dimensões reais do canvas
          const width = container.clientWidth;
          const height = 192; // h-48 = 12rem = 192px
          
          canvas.width = width;
          canvas.height = height;
          
          // Limpar canvas após redimensionar
          sigCanvas.current?.clear();
        }
      }
    };

    // Redimensionar ao carregar
    setTimeout(resizeCanvas, 100);

    // Redimensionar ao mudar orientação ou tamanho da tela
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

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

  const handleSendNoteToClient = () => {
    if (!cliente?.telefone) {
      alert("Cliente não possui telefone cadastrado.");
      return;
    }

    // Verificar se a entrega já foi confirmada
    if (pedido.status !== StatusPedido.ENTREGUE || !pedido.assinatura) {
      alert("A entrega precisa ser confirmada antes de enviar a nota ao cliente.");
      return;
    }

    // Preparar mensagem com informações da entrega
    const itemsText = pedido.itens.map(item => {
      const produto = produtos.find(p => p.id === item.produtoId);
      return `- ${produto?.nome || 'N/A'} (${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)}) = R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`;
    }).join('%0A');

    // Informações de pagamento
    let pagamentoInfo = '';
    if (pedido.statusPagamento === 'Pago') {
      pagamentoInfo = `%0A✅ *PAGAMENTO: PAGO INTEGRALMENTE*%0A` +
                     `💰 *Valor Pago: R$ ${pedido.valorTotal.toFixed(2)}*%0A`;
    } else if (pedido.pagamentoParcial && pedido.valorPago) {
      const saldoRestante = pedido.valorTotal;
      const valorOriginal = pedido.valorTotal + pedido.valorPago;
      pagamentoInfo = `%0A💵 *PAGAMENTO PARCIAL*%0A` +
                     `💰 *Entrada Recebida: R$ ${pedido.valorPago.toFixed(2)}*%0A` +
                     `💳 *Saldo Restante: R$ ${saldoRestante.toFixed(2)}*%0A` +
                     `📊 *Valor Original: R$ ${valorOriginal.toFixed(2)}*%0A`;
    } else {
      pagamentoInfo = `%0A⏳ *PAGAMENTO: PENDENTE*%0A` +
                     `💰 *Valor a Pagar: R$ ${pedido.valorTotal.toFixed(2)}*%0A`;
    }

    const message = `*COMPROVANTE DE ENTREGA - MANÁ*%0A%0A` +
                   `Olá, *${cliente.nome}*!%0A%0A` +
                   `Sua entrega foi realizada com sucesso! ✅%0A%0A` +
                   `📦 *DETALHES DO PEDIDO*%0A` +
                   `━━━━━━━━━━━━━━━━━━━━%0A` +
                   `*Pedido:* ${pedido.id.toUpperCase()}%0A` +
                   `*Data da Entrega:* ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}%0A%0A` +
                   `*Itens Entregues:*%0A${itemsText}%0A%0A` +
                   `━━━━━━━━━━━━━━━━━━━━%0A` +
                   `*VALOR TOTAL: R$ ${(pedido.valorTotal + (pedido.valorPago || 0)).toFixed(2)}*${pagamentoInfo}%0A` +
                   `━━━━━━━━━━━━━━━━━━━━%0A%0A` +
                   `✍️ *Assinatura coletada com sucesso!*%0A%0A` +
                   `Obrigado pela preferência! 🙏%0A%0A` +
                   `_MANÁ - Produtos Congelados_`;

    // Limpar telefone e abrir WhatsApp
    const phoneNumber = cliente.telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleConfirmDelivery = async () => {
    if (sigCanvas.current && sigCanvas.current.isEmpty()) {
      alert("Por favor, obtenha a assinatura do cliente.");
      return;
    }

    // Validar pagamento parcial
    if (pagamentoStatus === 'parcial') {
      const valorEntradaNum = parseFloat(valorEntrada);
      if (!valorEntrada || isNaN(valorEntradaNum) || valorEntradaNum <= 0) {
        alert("Por favor, informe o valor da entrada.");
        return;
      }
      if (valorEntradaNum >= pedido.valorTotal) {
        alert("O valor da entrada deve ser menor que o valor total. Use 'Pago' se o cliente pagou tudo.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const signature = sigCanvas.current!.toDataURL('image/png');
      const valorEntradaNum = pagamentoStatus === 'parcial' ? parseFloat(valorEntrada) : 0;
      
      // Calcular novo valor total se houver entrada
      const novoValorTotal = pagamentoStatus === 'parcial' 
        ? pedido.valorTotal - valorEntradaNum 
        : pedido.valorTotal;

      // 1. Gerar mensagem formatada para WhatsApp
      const itemsText = pedido.itens.map(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        return `- ${produto?.nome || 'N/A'} (${item.quantidade}x R$ ${item.precoUnitario.toFixed(2)}) = R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}`;
      }).join('%0A');

      let pagamentoInfo = '';
      if (pagamentoStatus === 'pago') {
        pagamentoInfo = `%0A✅ *PAGAMENTO: PAGO INTEGRALMENTE*%0A`;
      } else if (pagamentoStatus === 'parcial') {
        pagamentoInfo = `%0A💰 *ENTRADA: R$ ${valorEntradaNum.toFixed(2)}*%0A` +
                       `💳 *SALDO RESTANTE: R$ ${novoValorTotal.toFixed(2)}*%0A`;
      } else {
        pagamentoInfo = `%0A⏳ *PAGAMENTO: PENDENTE*%0A`;
      }

      const markdownMessage = `*ROMANEIO DE ENTREGA*%0A%0A` +
                              `*Pedido:* ${pedido.id.toUpperCase()}%0A` +
                              `*Cliente:* ${cliente?.nome}%0A` +
                              `*Data:* ${pedido.data.toLocaleDateString('pt-BR')}%0A` +
                              `%0A---%0A*Itens:*%0A${itemsText}%0A---%0A` +
                              `*VALOR TOTAL: R$ ${pedido.valorTotal.toFixed(2)}*${pagamentoInfo}%0A` +
                              `_Entrega confirmada._`;

      // 2. Atualizar status no sistema com informações de pagamento
      await updatePedidoStatus(
        pedido.id, 
        StatusPedido.ENTREGUE, 
        signature,
        pagamentoStatus === 'pago' ? pedido.valorTotal : (pagamentoStatus === 'parcial' ? valorEntradaNum : 0),
        pagamentoStatus === 'parcial',
        pagamentoStatus === 'pago'
      );
      
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

        {/* Informações de Pagamento */}
        {pedido.status !== StatusPedido.ENTREGUE && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">💰 Pagamento</h3>
            
            <div className="space-y-4">
              {/* Opções de Pagamento */}
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       style={{ borderColor: pagamentoStatus === 'nao_pago' ? '#4F46E5' : '#D1D5DB' }}>
                  <input
                    type="radio"
                    name="pagamento"
                    value="nao_pago"
                    checked={pagamentoStatus === 'nao_pago'}
                    onChange={(e) => setPagamentoStatus(e.target.value as any)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <span className="ml-3 font-medium text-gray-800">⏳ Não Pago (Pendente)</span>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       style={{ borderColor: pagamentoStatus === 'pago' ? '#10B981' : '#D1D5DB' }}>
                  <input
                    type="radio"
                    name="pagamento"
                    value="pago"
                    checked={pagamentoStatus === 'pago'}
                    onChange={(e) => setPagamentoStatus(e.target.value as any)}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="ml-3 font-medium text-gray-800">✅ Pago Integralmente</span>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       style={{ borderColor: pagamentoStatus === 'parcial' ? '#F59E0B' : '#D1D5DB' }}>
                  <input
                    type="radio"
                    name="pagamento"
                    value="parcial"
                    checked={pagamentoStatus === 'parcial'}
                    onChange={(e) => setPagamentoStatus(e.target.value as any)}
                    className="w-5 h-5 text-yellow-600"
                  />
                  <span className="ml-3 font-medium text-gray-800">💵 Pagamento Parcial (Entrada)</span>
                </label>
              </div>

              {/* Campo de Valor de Entrada */}
              {pagamentoStatus === 'parcial' && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                  <label htmlFor="valorEntrada" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor da Entrada (R$)
                  </label>
                  <input
                    type="number"
                    id="valorEntrada"
                    value={valorEntrada}
                    onChange={(e) => setValorEntrada(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    max={pedido.valorTotal - 0.01}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg font-bold"
                  />
                  {valorEntrada && parseFloat(valorEntrada) > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-yellow-400">
                      <p className="text-sm text-gray-600">Valor Total: <span className="font-bold">R$ {pedido.valorTotal.toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Entrada: <span className="font-bold text-green-600">R$ {parseFloat(valorEntrada).toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600 border-t mt-2 pt-2">Saldo Restante: <span className="font-bold text-red-600">R$ {(pedido.valorTotal - parseFloat(valorEntrada)).toFixed(2)}</span></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assinatura */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">✍️ Assinatura do Cliente</h3>
          
          {pedido.assinatura ? (
            <>
              <div className="border-2 rounded-lg bg-white p-2">
                <img src={pedido.assinatura} alt="Assinatura" className="w-full h-auto"/>
                <p className="text-center text-sm text-green-600 mt-2 font-semibold">
                  ✅ Entrega já confirmada
                </p>
              </div>
              
              {/* Botão para enviar nota ao cliente */}
              <button
                onClick={handleSendNoteToClient}
                className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Send size={20} className="mr-2" />
                Enviar Nota ao Cliente
              </button>
            </>
          ) : (
            <>
              <div className="relative w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm z-10">
                  Assine aqui com o dedo
                </p>
                <SignatureCanvas 
                  ref={sigCanvas} 
                  penColor='black'
                  backgroundColor='transparent'
                  canvasProps={{
                    className: 'w-full h-48 bg-transparent rounded-lg',
                    style: {
                      touchAction: 'none',
                      width: '100%',
                      height: '192px'
                    }
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
