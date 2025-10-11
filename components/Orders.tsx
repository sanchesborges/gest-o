
import React, { useState, useEffect } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, ShoppingCart, Printer, Filter, Bike, X } from 'lucide-react';
import { Pedido, StatusPedido, StatusPagamento, UserRole } from '../types';
import { OrderForm } from './OrderForm';
import { DeliveryNote } from './DeliveryNote';
import { useParams } from 'react-router-dom';

const getStatusColor = (status: StatusPedido) => {
    switch(status) {
        case StatusPedido.PENDENTE: return 'bg-yellow-200 text-yellow-800';
        case StatusPedido.ENTREGUE: return 'bg-green-200 text-green-800';
        case StatusPedido.CANCELADO: return 'bg-red-200 text-red-800';
        default: return 'bg-gray-200 text-gray-800';
    }
}
const getPaymentStatusColor = (status: StatusPagamento) => {
    switch(status) {
        case StatusPagamento.PENDENTE: return 'bg-yellow-200 text-yellow-800';
        case StatusPagamento.PAGO: return 'bg-green-200 text-green-800';
        case StatusPagamento.ATRASADO: return 'bg-red-200 text-red-800';
        default: return 'bg-gray-200 text-gray-800';
    }
}

const AssignDriverModal: React.FC<{ pedido: Pedido; onClose: () => void }> = ({ pedido, onClose }) => {
    const { clientes, entregadores, assignEntregador, produtos } = useAppData();
    const cliente = clientes.find(c => c.id === pedido.clienteId);
    const [selectedEntregadorId, setSelectedEntregadorId] = useState<string>(pedido.entregadorId || (entregadores.length > 0 ? entregadores[0].id : ''));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEntregadorId) {
            alert("Por favor, selecione um entregador.");
            return;
        }

        // 1. Assign the driver to the order in the system
        assignEntregador(pedido.id, selectedEntregadorId);

        // 2. Prepare the message for WhatsApp
        const entregadorSelecionado = entregadores.find(e => e.id === selectedEntregadorId);

        const itemsText = pedido.itens.map(item => {
            const produto = produtos.find(p => p.id === item.produtoId);
            return `- ${item.quantidade}x ${produto?.nome || 'N/A'}`;
        }).join('%0A');

        const message = `*NOVA ENTREGA ATRIBUÍDA*%0A%0A` +
                        `Olá, ${entregadorSelecionado?.nome.split(' ')[0]}! Você tem uma nova entrega.%0A%0A` +
                        `*Cliente:* ${cliente?.nome}%0A` +
                        `*Endereço:* ${cliente?.endereco}%0A` +
                        `*Telefone Cliente:* ${cliente?.telefone}%0A%0A` +
                        `*Itens:*%0A${itemsText}%0A%0A` +
                        `*Valor Total a Receber:* R$ ${pedido.valorTotal.toFixed(2)}%0A`+
                        `*Condição de Pagamento:* ${cliente?.condicaoPagamento}%0A%0A` +
                        `_Por favor, confirme o recebimento desta mensagem._`;

        // 3. Create the share link (without a phone number) and open WhatsApp
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        // 4. Close the modal
        onClose();
    };


    if (!cliente) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center"><Bike className="mr-2 text-indigo-600" /> Atribuir Entregador</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                </div>
                <p className="text-gray-600 mb-4">Pedido <strong>{pedido.id.toUpperCase()}</strong> para <strong>{cliente.nome}</strong></p>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="entregador" className="block text-sm font-medium text-gray-700 mb-1">Entregador</label>
                        <select
                            id="entregador"
                            value={selectedEntregadorId}
                            onChange={e => setSelectedEntregadorId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="" disabled>Selecione...</option>
                            {entregadores.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Card component for mobile view
const OrderCard: React.FC<{ pedido: Pedido, onOpenNote: (pedido: Pedido) => void, onOpenAssign: (pedido: Pedido) => void, userRole: UserRole }> = ({ pedido, onOpenNote, onOpenAssign, userRole }) => {
  const { clientes, entregadores } = useAppData();
  const cliente = clientes.find(c => c.id === pedido.clienteId);
  const entregador = entregadores.find(e => e.id === pedido.entregadorId);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 transform hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{cliente?.nome || 'Cliente não encontrado'}</h3>
          <p className="text-sm text-gray-500">Pedido #{pedido.id.toUpperCase()}</p>
        </div>
        <p className="text-sm text-gray-600 font-medium">{pedido.data.toLocaleDateString('pt-BR')}</p>
      </div>
      
      <div className="mt-4 border-t pt-4 space-y-3">
         <div className="flex justify-between items-center">
            <p className="text-gray-500 font-medium">Valor Total:</p>
            <p className="text-xl font-bold text-gray-800">R$ {pedido.valorTotal.toFixed(2)}</p>
         </div>
         <div className="flex justify-between items-center">
            <p className="text-gray-500 font-medium">Status Entrega:</p>
            <span className={`${getStatusColor(pedido.status)} py-1 px-3 rounded-full text-xs font-bold`}>{pedido.status}</span>
         </div>
         <div className="flex justify-between items-center">
            <p className="text-gray-500 font-medium">Status Pagamento:</p>
            <span className={`${getPaymentStatusColor(pedido.statusPagamento)} py-1 px-3 rounded-full text-xs font-bold`}>{pedido.statusPagamento}</span>
         </div>
         <div className="flex justify-between items-center">
            <p className="text-gray-500 font-medium">Entregador:</p>
            <p className="font-semibold text-gray-800">{entregador?.nome || 'Não atribuído'}</p>
         </div>
      </div>

      <div className="mt-4 border-t pt-4 flex flex-col sm:flex-row gap-2">
        <button 
          onClick={() => onOpenNote(pedido)} 
          className="w-full bg-indigo-100 text-indigo-700 font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-200 transition-colors"
        >
            <Printer size={18} className="mr-2"/>
            Ver Romaneio
        </button>
        {userRole === UserRole.ADMIN && pedido.status === StatusPedido.PENDENTE && (
            <button
                onClick={() => onOpenAssign(pedido)}
                className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-yellow-600 transition-colors"
            >
                <Bike size={18} className="mr-2"/>
                {pedido.entregadorId ? 'Reatribuir' : 'Atribuir'}
            </button>
        )}
      </div>
    </div>
  );
};


const OrderRow: React.FC<{ pedido: Pedido, onOpenNote: (pedido: Pedido) => void, onOpenAssign: (pedido: Pedido) => void, userRole: UserRole }> = ({ pedido, onOpenNote, onOpenAssign, userRole }) => {
  const { clientes, entregadores } = useAppData();
  const cliente = clientes.find(c => c.id === pedido.clienteId);
  const entregador = entregadores.find(e => e.id === pedido.entregadorId);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-left">{pedido.id.toUpperCase()}</td>
      <td className="py-3 px-6 text-left">{cliente?.nome || 'N/A'}</td>
      <td className="py-3 px-6 text-center">{pedido.data.toLocaleDateString('pt-BR')}</td>
      <td className="py-3 px-6 text-right font-mono">R$ {pedido.valorTotal.toFixed(2)}</td>
      <td className="py-3 px-6 text-center">
        <span className={`${getStatusColor(pedido.status)} py-1 px-3 rounded-full text-xs font-bold`}>{pedido.status}</span>
      </td>
      <td className="py-3 px-6 text-center">
        <span className={`${getPaymentStatusColor(pedido.statusPagamento)} py-1 px-3 rounded-full text-xs font-bold`}>{pedido.statusPagamento}</span>
      </td>
      <td className="py-3 px-6 text-left">{entregador?.nome || 'N/A'}</td>
      <td className="py-3 px-6 text-center">
        <div className="flex items-center justify-center gap-2">
            <button onClick={() => onOpenNote(pedido)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100" aria-label="Ver Romaneio">
                <Printer size={20} />
            </button>
            {userRole === UserRole.ADMIN && pedido.status === StatusPedido.PENDENTE && (
                <button onClick={() => onOpenAssign(pedido)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100" aria-label="Atribuir Entrega">
                    <Bike size={20} />
                </button>
            )}
        </div>
      </td>
    </tr>
  );
};

export const Orders: React.FC<{userRole: UserRole}> = ({userRole}) => {
  const { pedidos, clientes } = useAppData();
  const { entregadorId } = useParams<{ entregadorId: string }>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<StatusPedido | 'Todos'>('Todos');
  const [clientFilter, setClientFilter] = useState<string>('Todos');

  const isEntregadorView = userRole === UserRole.ENTREGADOR;
  
  const initialPedidos = isEntregadorView && entregadorId
    ? pedidos.filter(p => p.entregadorId === entregadorId)
    : pedidos;

  const handleOpenNote = (pedido: Pedido) => {
      setSelectedOrder(pedido);
      setIsNoteOpen(true);
  }

  const handleOpenAssignModal = (pedido: Pedido) => {
      setSelectedOrder(pedido);
      setIsAssignModalOpen(true);
  }

  const handleCloseModals = () => {
    setIsNoteOpen(false);
    setIsAssignModalOpen(false);
    setSelectedOrder(null);
  }

  const filteredPedidos = initialPedidos.filter(pedido => {
      const statusMatch = statusFilter === 'Todos' || pedido.status === statusFilter;
      const clientMatch = clientFilter === 'Todos' || pedido.clienteId === clientFilter;
      return statusMatch && clientMatch;
  }).sort((a,b) => b.data.getTime() - a.data.getTime());

  return (
    <div className="space-y-6 p-6 pt-8">
      {isFormOpen && <OrderForm onClose={() => setIsFormOpen(false)} />}
      {isNoteOpen && selectedOrder && <DeliveryNote pedido={selectedOrder} onClose={handleCloseModals} />}
      {isAssignModalOpen && selectedOrder && userRole === UserRole.ADMIN && <AssignDriverModal pedido={selectedOrder} onClose={handleCloseModals} />}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center"><ShoppingCart className="mr-3" size={32} /> Gestão de Pedidos</h2>
        {userRole === UserRole.ADMIN && (
            <button onClick={() => setIsFormOpen(true)} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto">
              <PlusCircle className="mr-2" size={20} />
              Novo Pedido
            </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
            <Filter size={18} className="text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">Filtros</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Status</label>
                <select 
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusPedido | 'Todos')}
                    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                >
                    <option value="Todos">Todos</option>
                    {Object.values(StatusPedido).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="w-full sm:w-1/2">
                <label htmlFor="clientFilter" className="block text-sm font-medium text-gray-700">Cliente</label>
                <select 
                    id="clientFilter"
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    disabled={userRole === UserRole.ENTREGADOR}
                >
                    <option value="Todos">Todos</option>
                    {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

    {filteredPedidos.length === 0 ? (
         <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
            <p>Nenhum pedido encontrado com os filtros selecionados.</p>
        </div>
    ) : (
        <>
            {/* Mobile View - Cards */}
            <div className="md:hidden">
                {filteredPedidos.map(p => <OrderCard key={p.id} pedido={p} onOpenNote={handleOpenNote} onOpenAssign={handleOpenAssignModal} userRole={userRole} />)}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                        <th className="py-3 px-6 text-left">Pedido</th>
                        <th className="py-3 px-6 text-left">Cliente</th>
                        <th className="py-3 px-6 text-center">Data</th>
                        <th className="py-3 px-6 text-right">Valor Total</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Pagamento</th>
                        <th className="py-3 px-6 text-left">Entregador</th>
                        <th className="py-3 px-6 text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {filteredPedidos.map(p => <OrderRow key={p.id} pedido={p} onOpenNote={handleOpenNote} onOpenAssign={handleOpenAssignModal} userRole={userRole}/>)}
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )}
    </div>
  );
};
