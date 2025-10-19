import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, Package, TrendingUp, TrendingDown, Box } from 'lucide-react';
import { Produto, UserRole } from '../types';
import { Link } from 'react-router-dom';

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

    const produtoSelecionado = produtos.find(p => p.id === produtoId);

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

    const handleIncrement = () => setQuantidade(prev => prev + 1);
    const handleDecrement = () => setQuantidade(prev => prev > 1 ? prev - 1 : 1);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl">
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-3">
                            <TrendingUp className="text-white" size={28}/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Entrada no Estoque</h2>
                            <p className="text-white text-opacity-80 text-sm">Registre novos produtos recebidos</p>
                        </div>
                    </div>
                </div>
                
                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
                    {/* Produto Selection */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                        <label htmlFor="produto" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                            Selecione o Produto
                        </label>
                        <select 
                            id="produto" 
                            value={produtoId} 
                            onChange={e => setProdutoId(e.target.value)} 
                            className="w-full p-3 border-2 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 font-medium text-lg"
                        >
                            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} - {p.tamanhoPacote}</option>)}
                        </select>
                        
                        {/* Info do Produto Selecionado */}
                        {produtoSelecionado && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-500 font-medium">Estoque Atual:</span>
                                        <p className="text-lg font-bold text-gray-800">{produtoSelecionado.estoqueAtual}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 font-medium">Estoque Mínimo:</span>
                                        <p className="text-lg font-bold text-gray-800">{produtoSelecionado.estoqueMinimo}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quantidade */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                            Quantidade Recebida
                        </label>
                        <div className="flex items-center justify-center gap-4">
                            <button 
                                type="button" 
                                onClick={handleDecrement}
                                className="bg-white border-2 border-gray-300 text-gray-700 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-md"
                            >
                                <TrendingDown size={24}/>
                            </button>
                            <div className="flex-1 text-center bg-white p-4 rounded-xl border-2 border-green-600 shadow-md">
                                <input 
                                    type="number" 
                                    id="quantidade" 
                                    value={quantidade} 
                                    onChange={e => setQuantidade(Math.max(1, parseInt(e.target.value, 10) || 1))} 
                                    min="1" 
                                    className="w-full text-center text-4xl font-bold text-green-600 focus:outline-none bg-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">unidades</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleIncrement}
                                className="bg-white border-2 border-gray-300 text-gray-700 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-md"
                            >
                                <TrendingUp size={24}/>
                            </button>
                        </div>
                        
                        {/* Preview do Novo Estoque */}
                        {produtoSelecionado && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Novo estoque será:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-medium text-gray-400">{produtoSelecionado.estoqueAtual}</span>
                                        <span className="text-green-600 font-bold">+{quantidade}</span>
                                        <span className="text-lg font-bold text-green-600">= {produtoSelecionado.estoqueAtual + quantidade}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fornecedor */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
                        <label htmlFor="fornecedor" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                            Fornecedor
                        </label>
                        <input 
                            type="text" 
                            id="fornecedor" 
                            value={fornecedor} 
                            onChange={e => setFornecedor(e.target.value)} 
                            placeholder="Ex: Fábrica Matriz, Distribuidor XYZ..."
                            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 font-medium"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="flex-shrink-0 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl border-t-2 border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg w-full sm:w-auto flex items-center justify-center"
                        >
                            <PlusCircle className="mr-2" size={20} />
                            Registrar Entrada
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Stock: React.FC<{userRole: UserRole}> = ({userRole}) => {
  const { produtos } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-6 pt-8">
        {isModalOpen && <AddStockModal onClose={() => setIsModalOpen(false)} />}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center"><Package className="mr-3" size={32} /> Controle de Estoque</h2>
            <div className="flex flex-col sm:flex-row-reverse gap-2 w-full sm:w-auto">
                {userRole === UserRole.ADMIN && (
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                    >
                        <PlusCircle className="mr-2" size={20} />
                        Registrar Entrada
                    </button>
                )}
                <Link 
                    to="/produtos"
                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors w-full sm:w-auto"
                >
                    <Box className="mr-2" size={20} />
                    Produtos
                </Link>
            </div>
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