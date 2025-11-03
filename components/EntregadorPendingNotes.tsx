import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { DollarSign, X, CheckCircle, Clock } from 'lucide-react';
import { Pedido, StatusPagamento, MetodoPagamento } from '../types';

interface EntregadorPendingNotesProps {
  entregadorId: string;
}

const PaymentModal: React.FC<{ 
  pedido: Pedido; 
  onClose: () => void;
  onConfirm: (pedidoId: string, valorPago: number, metodo: MetodoPagamento) => void;
}> = ({ pedido, onClose, onConfirm }) => {
  const { clientes, produtos } = useAppData();
  const cliente = clientes.find(c => c.id === pedido.clienteId);
  const [valorPago, setValorPago] = useState<string>(pedido.valorTotal.toFixed(2));
  const [metodo, setMetodo] = useState<MetodoPagamento>(MetodoPagamento.DINHEIRO);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = parseFloat(valorPago);
    
    if (isNaN(valor) || valor <= 0) {
      alert('Por favor, informe um valor válido.');
      return;
    }

    if (valor > pedido.valorTotal) {
      alert('O valor pago não pode ser maior que o saldo devedor.');
      return;
    }

    onConfirm(pedido.id, valor, metodo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Receber Pagamento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <h3 className="font-bold text-lg text-indigo-900 mb-2">Cliente</h3>
            <p className="text-indigo-800 text-xl font-bold">{cliente?.nome}</p>
            <p className="text-indigo-600 text-sm">{cliente?.telefone}</p>
          </div>

          {/* Informações do Pedido */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">Pedido #{pedido.id.toUpperCase()}</h3>
            <p className="text-sm text-gray-600 mb-2">Data: {pedido.data.toLocaleDateString('pt-BR')}</p>
            
            <div className="space-y-2 mt-3">
              {pedido.itens.map(item => {
                const produto = produtos.find(p => p.id === item.produtoId);
                return (
                  <div key={item.produtoId} className="flex justify-between text-sm">
                    <span>{produto?.nome} ({item.quantidade}x)</span>
                    <span className="font-semibold">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Informações de Pagamento Anterior */}
          {pedido.pagamentoParcial && pedido.valorPago && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">💰 Pagamento Anterior</h3>
              <div className="space-y-1 text-sm">
                <p className="text-yellow-800">
                  Valor Original: <span className="font-bold">R$ {(pedido.valorTotal + pedido.valorPago).toFixed(2)}</span>
                </p>
                <p className="text-green-700">
                  Entrada Recebida: <span className="font-bold">R$ {pedido.valorPago.toFixed(2)}</span>
                </p>
                <p className="text-red-700 text-lg font-bold border-t border-yellow-300 pt-2 mt-2">
                  Saldo Devedor: R$ {pedido.valorTotal.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Formulário de Pagamento */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="valorPago" className="block text-sm font-medium text-gray-700 mb-2">
                Valor Recebido (R$)
              </label>
              <input
                type="number"
                id="valorPago"
                value={valorPago}
                onChange={(e) => setValorPago(e.target.value)}
                step="0.01"
                min="0.01"
                max={pedido.valorTotal}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg font-bold focus:border-indigo-500 focus:outline-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Máximo: R$ {pedido.valorTotal.toFixed(2)}
              </p>
            </div>

            <div>
              <label htmlFor="metodo" className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pagamento
              </label>
              <select
                id="metodo"
                value={metodo}
                onChange={(e) => setMetodo(e.target.value as MetodoPagamento)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                {Object.values(MetodoPagamento).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Resumo */}
            {valorPago && parseFloat(valorPago) > 0 && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-2">Resumo do Pagamento</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">
                    Saldo Atual: <span className="font-bold">R$ {pedido.valorTotal.toFixed(2)}</span>
                  </p>
                  <p className="text-green-700">
                    Valor a Receber: <span className="font-bold">R$ {parseFloat(valorPago).toFixed(2)}</span>
                  </p>
                  <p className="text-gray-700 border-t border-green-300 pt-2 mt-2">
                    Novo Saldo: <span className="font-bold text-lg">
                      R$ {(pedido.valorTotal - parseFloat(valorPago)).toFixed(2)}
                    </span>
                  </p>
                  {parseFloat(valorPago) >= pedido.valorTotal && (
                    <p className="text-green-700 font-bold text-lg">
                      ✅ Pedido será marcado como PAGO!
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <CheckCircle size={20} className="mr-2" />
                Confirmar Pagamento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const EntregadorPendingNotes: React.FC<EntregadorPendingNotesProps> = ({ entregadorId }) => {
  const { pedidos, clientes, addPagamento, updatePedidoStatus } = useAppData();
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  // Debug: Log dos pedidos
  console.log('🔍 EntregadorPendingNotes - Todos os pedidos:', pedidos.length);
  console.log('🔍 Pedidos do entregador:', pedidos.filter(p => p.entregadorId === entregadorId).length);
  console.log('🔍 Pedidos entregues:', pedidos.filter(p => p.status === 'Entregue').length);
  console.log('🔍 Pedidos pendentes:', pedidos.filter(p => p.statusPagamento === StatusPagamento.PENDENTE).length);

  // Filtrar pedidos pendentes ou com pagamento parcial do entregador
  // Inclui pedidos ENTREGUES com pagamento pendente ou parcial
  const pendingNotes = pedidos.filter(p => {
    const match = p.entregadorId === entregadorId &&
      p.status === 'Entregue' && // Apenas pedidos já entregues
      (p.statusPagamento === StatusPagamento.PENDENTE || p.statusPagamento === StatusPagamento.ATRASADO) &&
      p.valorTotal > 0;
    
    if (p.entregadorId === entregadorId) {
      console.log('📋 Pedido do entregador:', {
        id: p.id,
        status: p.status,
        statusPagamento: p.statusPagamento,
        valorTotal: p.valorTotal,
        valorPago: p.valorPago,
        pagamentoParcial: p.pagamentoParcial,
        match
      });
    }
    
    return match;
  }).sort((a, b) => b.data.getTime() - a.data.getTime());

  console.log('✅ Notas pendentes encontradas:', pendingNotes.length);

  const handleConfirmPayment = async (pedidoId: string, valorPago: number, metodo: MetodoPagamento) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    try {
      // Se o valor pago é igual ou maior que o saldo, marca como pago
      if (valorPago >= pedido.valorTotal) {
        await addPagamento(pedidoId, pedido.valorTotal, metodo);
        alert('✅ Pagamento confirmado! Pedido marcado como PAGO.');
      } else {
        // Pagamento parcial adicional
        await updatePedidoStatus(
          pedidoId,
          pedido.status,
          pedido.assinatura,
          (pedido.valorPago || 0) + valorPago,
          true,
          false
        );
        alert(`✅ Pagamento parcial confirmado! Novo saldo: R$ ${(pedido.valorTotal - valorPago).toFixed(2)}`);
      }
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      alert('❌ Erro ao confirmar pagamento. Tente novamente.');
    }
  };

  if (pendingNotes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Tudo em dia!</h3>
        <p className="text-gray-600">Nenhuma nota pendente de pagamento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedPedido && (
        <PaymentModal
          pedido={selectedPedido}
          onClose={() => setSelectedPedido(null)}
          onConfirm={handleConfirmPayment}
        />
      )}

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
        <div className="flex items-center">
          <Clock className="text-yellow-600 mr-3" size={24} />
          <div>
            <h3 className="font-bold text-yellow-900">Notas Pendentes de Pagamento</h3>
            <p className="text-sm text-yellow-700">
              {pendingNotes.length} {pendingNotes.length === 1 ? 'nota pendente' : 'notas pendentes'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingNotes.map(pedido => {
          const cliente = clientes.find(c => c.id === pedido.clienteId);
          const isOverdue = pedido.statusPagamento === StatusPagamento.ATRASADO;
          
          return (
            <div
              key={pedido.id}
              className={`bg-white rounded-xl shadow-lg p-5 border-2 ${
                isOverdue ? 'border-red-300 bg-red-50' : 'border-yellow-300'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{cliente?.nome}</h3>
                  <p className="text-sm text-gray-500">Pedido #{pedido.id.toUpperCase()}</p>
                  <p className="text-xs text-gray-400">
                    Entrega: {pedido.data.toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {isOverdue && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ATRASADO
                  </span>
                )}
              </div>

              {pedido.pagamentoParcial && pedido.valorPago && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-3">
                  <p className="text-xs text-yellow-800 font-semibold mb-1">💰 Pagamento Parcial</p>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-700">
                      Valor Original: <span className="font-bold">R$ {(pedido.valorTotal + pedido.valorPago).toFixed(2)}</span>
                    </p>
                    <p className="text-green-700">
                      Entrada: <span className="font-bold">R$ {pedido.valorPago.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Saldo Devedor:</span>
                <span className="text-2xl font-bold text-red-600">
                  R$ {pedido.valorTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => setSelectedPedido(pedido)}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <DollarSign size={20} className="mr-2" />
                Receber Pagamento
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
