import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, Package, X, Box } from 'lucide-react';
import { Produto, TipoProduto, TamanhoPacote, UserRole } from '../types';

const AddProductModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addProduto } = useAppData();
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<TipoProduto>(TipoProduto.PAO_DE_QUEIJO);
    const [tamanhoPacote, setTamanhoPacote] = useState<TamanhoPacote>(TamanhoPacote.UM_KG);
    const [precoPadrao, setPrecoPadrao] = useState(0);
    const [estoqueMinimo, setEstoqueMinimo] = useState(10);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim() || precoPadrao <= 0 || estoqueMinimo < 0) {
            alert("Por favor, preencha todos os campos corretamente. O preço e o estoque mínimo não podem ser negativos.");
            return;
        }
        
        const finalNome = `${nome} ${tamanhoPacote}`;
        addProduto({
            nome: finalNome,
            tipo,
            tamanhoPacote,
            precoPadrao,
            estoqueMinimo,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                    <div className="flex items-center">
                        <Package className="text-indigo-600 mr-3" size={28}/>
                        <h2 className="text-2xl font-bold text-gray-800">Novo Produto</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Produto (Ex: Pão de Queijo Tradicional)</label>
                        <input id="nome" type="text" placeholder="Pão de Queijo Tradicional" value={nome} onChange={e => setNome(e.target.value)} required className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoProduto)} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                                {Object.values(TipoProduto).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tamanhoPacote" className="block text-sm font-medium text-gray-700">Kilo / Pacote</label>
                            <select id="tamanhoPacote" value={tamanhoPacote} onChange={e => setTamanhoPacote(e.target.value as TamanhoPacote)} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                                {Object.values(TamanhoPacote).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="precoPadrao" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                            <input id="precoPadrao" type="number" step="0.01" min="0" placeholder="25.00" value={precoPadrao} onChange={e => setPrecoPadrao(parseFloat(e.target.value))} required className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="estoqueMinimo" className="block text-sm font-medium text-gray-700">Estoque Mínimo</label>
                            <input id="estoqueMinimo" type="number" min="0" placeholder="10" value={estoqueMinimo} onChange={e => setEstoqueMinimo(parseInt(e.target.value, 10))} required className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Salvar Produto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProductCard: React.FC<{ produto: Produto }> = ({ produto }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-bold text-indigo-700">{produto.nome}</h3>
        <p className="text-sm font-medium text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded-md my-2">{produto.tipo}</p>
        <div className="text-gray-600 mt-4 space-y-2">
            <p className="flex items-center"><strong>Preço:</strong> <span className="ml-2 text-lg font-semibold text-green-600">R$ {produto.precoPadrao.toFixed(2)}</span></p>
            <p><strong>Pacote:</strong> {produto.tamanhoPacote}</p>
            <p><strong>Estoque Mínimo:</strong> {produto.estoqueMinimo} un.</p>
        </div>
    </div>
);

const ProductRow: React.FC<{ produto: Produto }> = ({ produto }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 text-left">{produto.nome}</td>
        <td className="py-3 px-6 text-left">{produto.tipo}</td>
        <td className="py-3 px-6 text-center">{produto.tamanhoPacote}</td>
        <td className="py-3 px-6 text-right font-mono">R$ {produto.precoPadrao.toFixed(2)}</td>
        <td className="py-3 px-6 text-center">{produto.estoqueMinimo}</td>
    </tr>
);

export const Products: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const { produtos } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center"><Box className="mr-3" size={32} /> Cadastro de Produtos</h2>
        {userRole === UserRole.ADMIN && (
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto"
            >
            <PlusCircle className="mr-2" size={20} />
            Novo Produto
            </button>
        )}
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 md:hidden gap-6">
        {produtos.map(produto => <ProductCard key={produto.id} produto={produto} />)}
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                    <th className="py-3 px-6 text-left">Nome</th>
                    <th className="py-3 px-6 text-left">Tipo</th>
                    <th className="py-3 px-6 text-center">Pacote</th>
                    <th className="py-3 px-6 text-right">Preço Padrão</th>
                    <th className="py-3 px-6 text-center">Estoque Mínimo</th>
                </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {produtos.map(p => <ProductRow key={p.id} produto={p} />)}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};