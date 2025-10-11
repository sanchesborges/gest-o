import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { DollarSign, CheckCircle, ShieldAlert, Clock } from 'lucide-react';
import { Pedido, StatusPagamento, MetodoPagamento, UserRole } from '../types';

const AddPaymentModal: React.FC<{ pedido: Pedido, onClose: () => void }> = ({ pedido, onClose }) => {
    const { addPagamento } = useAppData();
    const [metodo, setMetodo] = useState<MetodoPagamento>(MetodoPagamento.PIX);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addPagamento(pedido.id, pedido.valorTotal, metodo);
        onClose();
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Registrar Pagamento</h2>
                <p className="text-gray-600 mb-6">Pedido: {pedido.id.toUpperCase()} - Valor: R$ {pedido.valorTotal.toFixed(2)}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="metodo" className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
                        <select id="metodo" value={metodo} onChange={e => setMetodo(e.target.value as MetodoPagamento)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            {Object.values(MetodoPagamento).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const getPaymentStatusInfo = (status: StatusPagamento) => {
    switch(status) {
        case StatusPagamento.PENDENTE: return { text: 'Pendente', color: 'bg-yellow-200 text-yellow-800' };
        case StatusPagamento.ATRASADO: return { text: 'Atrasado', color: 'bg-red-200 text-red-800' };
        default: return { text: 'Pago', color: 'bg-green-200 text-green-800' };
    }
}

const SummaryCard: React.FC<{title: string; value: string; icon: React.ReactNode; colorClass: string}> = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg flex items-center">
        <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const FinancialCard: React.FC<{ pedido: Pedido, onRegisterPayment: (pedido: Pedido) => void }> = ({ pedido, onRegisterPayment }) => {
    const { clientes } = useAppData();
    const cliente = clientes.find(c => c.id === pedido.clienteId);
    const statusInfo = getPaymentStatusInfo(pedido.statusPagamento);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{cliente?.nome || 'Cliente não encontrado'}</h3>
                        <p className="text-sm text-gray-500">Pedido #{pedido.id.toUpperCase()}</p>
                    </div>
                    <span className={`${statusInfo.color} py-1 px-3 rounded-full text-xs font-bold`}>{statusInfo.text}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">R$ {pedido.valorTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Vencimento: <span className="font-medium">{pedido.dataVencimentoPagamento.toLocaleDateString('pt-BR')}</span></p>
                </div>
            </div>
            <button
                onClick={() => onRegisterPayment(pedido)}
                className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors mt-4"
            >
                <CheckCircle size={18} className="mr-2"/>
                Registrar Pagamento
            </button>
        </div>
    );
};

const FinancialsRow: React.FC<{ pedido: Pedido, onRegisterPayment: (pedido: Pedido) => void }> = ({ pedido, onRegisterPayment }) => {
  const { clientes } = useAppData();
  const cliente = clientes.find(c => c.id === pedido.clienteId);
  const statusInfo = getPaymentStatusInfo(pedido.statusPagamento);
  const isOverdue = pedido.statusPagamento === StatusPagamento.ATRASADO;

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-100 ${isOverdue ? 'bg-red-50' : ''}`}>
      <td className="py-3 px-6 text-left">{pedido.id.toUpperCase()}</td>
      <td className="py-3 px-6 text-left">{cliente?.nome || 'N/A'}</td>
      <td className="py-3 px-6 text-center">{pedido.dataVencimentoPagamento.toLocaleDateString('pt-BR')}</td>
      <td className="py-3 px-6 text-right font-mono">R$ {pedido.valorTotal.toFixed(2)}</td>
      <td className="py-3 px-6 text-center">
        <span className={`${statusInfo.color} py-1 px-3 rounded-full text-xs font-bold`}>{statusInfo.text}</span>
      </td>
       <td className="py-3 px-6 text-center">
        <button onClick={() => onRegisterPayment(pedido)} className="text-green-600 hover:text-green-900 flex items-center justify-center w-full" aria-label={`Registrar pagamento para o pedido ${pedido.id.toUpperCase()}`}>
            <CheckCircle size={20} />
        </button>
      </td>
    </tr>
  );
};


export const Financials: React.FC<{userRole: UserRole}> = ({userRole}) => {
  const { pedidos } = useAppData();
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);

  if (userRole !== UserRole.ADMIN) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
            <p className="text-gray-600 mt-2">Esta seção está disponível apenas para administradores.</p>
        </div>
    );
  }

  const pendingPayments = pedidos.filter(p => p.statusPagamento === StatusPagamento.PENDENTE || p.statusPagamento === StatusPagamento.ATRASADO)
    .sort((a,b) => a.dataVencimentoPagamento.getTime() - b.dataVencimentoPagamento.getTime());
  
  const totalReceber = pendingPayments.reduce((sum, p) => sum + p.valorTotal, 0);
  const totalAtrasado = pendingPayments.filter(p => p.statusPagamento === StatusPagamento.ATRASADO).reduce((sum, p) => sum + p.valorTotal, 0);

  const handleRegisterPayment = (pedido: Pedido) => {
      setSelectedOrder(pedido);
  }

  return (
    <div className="space-y-6 p-6 pt-8">
      {selectedOrder && <AddPaymentModal pedido={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      <h2 className="text-3xl font-bold text-gray-800 flex items-center"><DollarSign className="mr-3" size={32} /> Contas a Receber</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard title="Total a Receber" value={`R$ ${totalReceber.toFixed(2)}`} icon={<DollarSign className="text-white"/>} colorClass="bg-yellow-500" />
          <SummaryCard title="Total Vencido" value={`R$ ${totalAtrasado.toFixed(2)}`} icon={<Clock className="text-white"/>} colorClass="bg-red-500" />
      </div>

      {pendingPayments.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Tudo em dia!</h3>
            <p>Nenhum pagamento pendente no momento.</p>
        </div>
      ) : (
        <>
            {/* Mobile View - Cards */}
            <div className="md:hidden">
                {pendingPayments.map(p => <FinancialCard key={p.id} pedido={p} onRegisterPayment={handleRegisterPayment} />)}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">Pedido</th>
                            <th className="py-3 px-6 text-left">Cliente</th>
                            <th className="py-3 px-6 text-center">Vencimento</th>
                            <th className="py-3 px-6 text-right">Valor</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            <th className="py-3 px-6 text-center">Registrar Pagamento</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {pendingPayments.map(p => <FinancialsRow key={p.id} pedido={p} onRegisterPayment={handleRegisterPayment} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}
    </div>
  );
};