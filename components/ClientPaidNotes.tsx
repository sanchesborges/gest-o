import React, { useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { FileText, ArrowLeft, Calendar } from 'lucide-react';
import { DeliveryNote } from './DeliveryNote';

export const ClientPaidNotes: React.FC = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  const startQuery = qs.get('start');
  const endQuery = qs.get('end');
  const ignoreQuery = qs.get('ignore') === '1';

  const { pedidos, clientes } = useAppData();
  const [selectedPedido, setSelectedPedido] = useState<any | null>(null);

  const cliente = clientes.find(c => c.id === clienteId);

  const startDate = startQuery ? new Date(startQuery) : (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();
  const endDate = endQuery ? new Date(endQuery) : new Date();
  endDate.setHours(23, 59, 59, 999);

  const notasPagas = useMemo(() => {
    const relevant = pedidos.filter(p => p.clienteId === clienteId && p.statusPagamento === 'Pago');
    if (ignoreQuery) return relevant.sort((a, b) => b.data.getTime() - a.data.getTime());
    return relevant.filter(p => p.data >= startDate && p.data <= endDate).sort((a, b) => b.data.getTime() - a.data.getTime());
  }, [pedidos, clienteId, startDate, endDate, ignoreQuery]);

  const periodText = ignoreQuery
    ? 'Período: Todos'
    : `Período: ${startDate.toLocaleDateString('pt-BR')} a ${endDate.toLocaleDateString('pt-BR')}`;

  return (
    <div className="space-y-6 p-6 pt-8">
      {selectedPedido && (
        <DeliveryNote pedido={selectedPedido} onClose={() => setSelectedPedido(null)} />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="mr-3" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Notas Pagas por Cliente</h2>
        </div>
        <Link to="/relatorios" className="inline-flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
          <ArrowLeft className="mr-2" size={18} /> Voltar
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="border-b-4 border-indigo-600 pb-4 mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">MANÁ</h1>
          <p className="text-center text-gray-600 mt-2">Notas Pagas • {cliente?.nome || 'Cliente'}</p>
          <p className="text-center text-sm text-gray-500 mt-1">{periodText}</p>
          {ignoreQuery && (
            <p className="text-center text-xs font-semibold text-indigo-700 mt-1">Histórico completo</p>
          )}
        </div>

        {notasPagas.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Nenhuma nota paga encontrada no período.</p>
        ) : (
          <div className="space-y-4">
            {notasPagas.map(p => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600"><Calendar size={14} className="inline mr-1" /> {p.data.toLocaleDateString('pt-BR')}</p>
                    <p className="text-sm text-gray-600">Pedido: <span className="font-mono">{p.id.toUpperCase()}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-800">R$ {p.valorTotal.toFixed(2)}</p>
                    <button
                      onClick={() => setSelectedPedido(p)}
                      className="bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-indigo-700"
                    >
                      Abrir Nota
                    </button>
                  </div>
                </div>
                <div className="mt-3 ml-1 text-sm text-gray-600">
                  {p.itens.map((item: any, idx: number) => (
                    <span key={idx} className="inline-block mr-3">• {item.quantidade}x</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};