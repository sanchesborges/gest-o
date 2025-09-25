import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { Produto, UserRole } from '../types';

// Card component for mobile view
const StockCard: React.FC<{ produto: Produto }> = ({ produto }) => {
  const isLowStock = produto.estoqueAtual < produto.estoqueMinimo;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 transform hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{produto.nome}</h3>
          <p className="text-sm text-gray-500">{produto.tamanhoPacote}</p>
        </div>
        <span className={`py-1 px-3 rounded-full text-xs font-bold ${isLowStock ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
          {isLowStock ? 'BAIXO' : 'OK'}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Estoque Atual</p>
          <p className={`text-3xl font-bold ${isLowStock ? 'text-red-600' : 'text-gray-800'}`}>
            {produto.estoqueAtual}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Mínimo</p>
          <p className="text-3xl font-bold text-gray-500">{produto.estoqueMinimo}</p>
        </div>
      </div>
    </div>
  );
};

// Table row for desktop view
const StockRow: React.FC<{ produto: Produto }> = ({ produto }) => {
  const isLowStock = produto.estoqueAtual < produto.estoqueMinimo;
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-left">{produto.nome}</td>
      <td className="py-3 px-6 text-center">{produto.tamanhoPacote}</td>
      <td className={`py-3 px-6 text-center font-bold text-lg ${isLowStock ? 'text-red-600' : 'text-gray-800'}`}>{produto.estoqueAtual}</td>
      <td className="py-3 px-6 text-center">{produto.estoqueMinimo}</td>
      <td className="py-3 px-6 text-center">
        {isLowStock ? (
          <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-xs font-bold inline-flex items-center justify-center">
            <TrendingDown size={14} className="mr-1" /> BAIXO
          </span>
        ) : (
          <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs font-bold inline-flex items-center justify-center">
            <TrendingUp size={14} className="mr-1" /> OK
          </span>
        )}
      </td>
    </tr>
  );
};


const AddStockModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { produtos, addEntradaEstoque } = useAppData();
    const [produtoId, setProdutoId] = useState(produtos[0]?.id || '');
    const [quantidade, setQuantidade] = useState(1);
    const [fornecedor, setFornecedor] = useState('Fábrica Matriz');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addEntradaEstoque({
            produtoId,
            quantidade,
            fornecedor,
            dataRecebimento: new Date()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Entrada no Estoque</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="produto" className="block text-sm font-medium text-gray-700">Produto</label>
                        <select id="produto" value={produtoId} onChange={e => setProdutoId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">Quantidade</label>
                        <input type="number" id="quantidade" value={quantidade} onChange={e => setQuantidade(parseInt(e.target.value, 10))} min="1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="fornecedor" className="block text-sm font-medium text-gray-700">Fornecedor</label>
                        <input type="text" id="fornecedor" value={fornecedor} onChange={e => setFornecedor(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const Stock: React.FC<{userRole: UserRole}> = ({userRole}) => {
  const { produtos } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
        {isModalOpen && <AddStockModal onClose={() => setIsModalOpen(false)} />}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center"><Package className="mr-3" size={32} /> Controle de Estoque</h2>
            {userRole === UserRole.ADMIN && (
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                    <PlusCircle className="mr-2" size={20} />
                    Registrar Entrada
                </button>
            )}
        </div>
        
        {/* Mobile View - Cards */}
        <div className="md:hidden">
            {produtos.map(p => <StockCard key={p.id} produto={p} />)}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                        <th className="py-3 px-6 text-left">Produto</th>
                        <th className="py-3 px-6 text-center">Pacote</th>
                        <th className="py-3 px-6 text-center">Estoque Atual</th>
                        <th className="py-3 px-6 text-center">Estoque Mínimo</th>
                        <th className="py-3 px-6 text-center">Status</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                    {produtos.map(p => <StockRow key={p.id} produto={p} />)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};