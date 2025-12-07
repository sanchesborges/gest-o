import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, Package, X, Box, Trash2, Edit } from 'lucide-react';
import { Produto, TipoProduto, TamanhoPacote, UserRole } from '../types';

const AddProductModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addProduto } = useAppData();
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<TipoProduto>(TipoProduto.PAO_DE_QUEIJO);
    const [tamanhoPacote, setTamanhoPacote] = useState<TamanhoPacote>(TamanhoPacote.UM_KG);
    const [gramatura, setGramatura] = useState<string>('25g');
    const [precoPadrao, setPrecoPadrao] = useState(0);
    const [custoUnitario, setCustoUnitario] = useState(0);
    const [estoqueMinimo, setEstoqueMinimo] = useState(10);

    const handleTamanhoPacoteChange = (novoTamanho: TamanhoPacote) => {
        setTamanhoPacote(novoTamanho);
        // Resetar gramatura para o padrão quando mudar o tamanho
        if (novoTamanho === TamanhoPacote.CINCO_KG) {
            setGramatura('25g');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim() || precoPadrao <= 0 || estoqueMinimo < 0) {
            alert("Por favor, preencha todos os campos corretamente. O preço e o estoque mínimo não podem ser negativos.");
            return;
        }
        
        // Se for 5kg, adicionar a gramatura ao tamanho do pacote (se houver)
        const tamanhoFinal = tamanhoPacote === TamanhoPacote.CINCO_KG && gramatura
            ? `${tamanhoPacote} (${gramatura})` 
            : tamanhoPacote;
        
        const finalNome = `${nome} ${tamanhoFinal}`;
        await addProduto({
            nome: finalNome,
            tipo,
            tamanhoPacote: tamanhoFinal,
            precoPadrao,
            custoUnitario,
            estoqueMinimo,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
                    <div className="flex items-center">
                        <Package className="text-indigo-600 mr-3" size={28}/>
                        <h2 className="text-2xl font-bold text-gray-800">Novo Produto</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Produto (Ex: Pão de Queijo Tradicional)</label>
                        <input id="nome" type="text" placeholder="Pão de Queijo Tradicional" value={nome} onChange={e => setNome(e.target.value)} required className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select id="tipo" value={tipo} onChange={e => setTipo(e.target.value as TipoProduto)} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                                {Object.values(TipoProduto).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tamanhoPacote" className="block text-sm font-medium text-gray-700">Kilo / Pacote</label>
                            <select 
                                id="tamanhoPacote" 
                                value={tamanhoPacote} 
                                onChange={e => handleTamanhoPacoteChange(e.target.value as TamanhoPacote)} 
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {Object.values(TamanhoPacote).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {/* Campo de Gramatura - aparece apenas quando 5kg é selecionado */}
                    {tamanhoPacote === TamanhoPacote.CINCO_KG && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <label htmlFor="gramatura" className="block text-sm font-medium text-gray-700 mb-2">
                                Gramatura (para pacote de 5kg)
                            </label>
                            <select 
                                id="gramatura" 
                                value={gramatura} 
                                onChange={e => setGramatura(e.target.value)} 
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Sem gramatura</option>
                                <option value="25g">25 Gramas</option>
                                <option value="30g">30 Gramas</option>
                                <option value="40g">40 Gramas</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                Selecione o peso individual de cada unidade no pacote de 5kg
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="precoPadrao" className="block text-sm font-medium text-gray-700">Preço de Venda (R$)</label>
                            <input id="precoPadrao" type="number" step="0.01" min="0" placeholder="25.00" value={precoPadrao} onChange={e => setPrecoPadrao(parseFloat(e.target.value))} required className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="custoUnitario" className="block text-sm font-medium text-gray-700">Custo Unitário (R$)</label>
                            <input id="custoUnitario" type="number" step="0.01" min="0" placeholder="13.50" value={custoUnitario} onChange={e => setCustoUnitario(parseFloat(e.target.value))} className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="estoqueMinimo" className="block text-sm font-medium text-gray-700">Estoque Mínimo</label>
                            <input id="estoqueMinimo" type="number" min="0" placeholder="10" value={estoqueMinimo} onChange={e => setEstoqueMinimo(parseInt(e.target.value, 10))} required className="w-full p-2 mt-1 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    {custoUnitario > 0 && precoPadrao > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                            <p className="text-xs text-gray-600">Lucro por unidade:</p>
                            <p className="text-lg font-bold text-green-600">R$ {(precoPadrao - custoUnitario).toFixed(2)}</p>
                            <p className="text-xs text-gray-500">{((precoPadrao - custoUnitario) / precoPadrao * 100).toFixed(1)}% margem</p>
                        </div>
                    )}
                    <div className="sticky bottom-0 -mx-6 px-6 bg-white border-t pt-4 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Salvar Produto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditProductModal: React.FC<{ produto: Produto; onClose: () => void }> = ({ produto, onClose }) => {
    const { updateProduto } = useAppData();
    const [nome, setNome] = useState(produto.nome);
    const [precoPadrao, setPrecoPadrao] = useState(produto.precoPadrao);
    const [custoUnitario, setCustoUnitario] = useState(produto.custoUnitario || 0);
    const [estoqueMinimo, setEstoqueMinimo] = useState(produto.estoqueMinimo);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim() || precoPadrao <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        try {
            await updateProduto(produto.id, {
                nome: nome.trim(),
                precoPadrao,
                custoUnitario,
                estoqueMinimo,
            });

            alert('Produto atualizado com sucesso!');
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            alert('Erro ao atualizar produto. Tente novamente.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                    <div className="flex items-center">
                        <Edit className="text-blue-600 mr-3" size={28}/>
                        <h2 className="text-2xl font-bold text-gray-800">Editar Produto</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="edit-nome" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                        <input 
                            id="edit-nome" 
                            type="text" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            required 
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md" 
                        />
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600"><strong>Tipo:</strong> {produto.tipo}</p>
                        <p className="text-sm text-gray-600 mt-1"><strong>Pacote:</strong> {produto.tamanhoPacote}</p>
                        <p className="text-xs text-gray-500 mt-2">Tipo e tamanho não podem ser editados</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-precoPadrao" className="block text-sm font-medium text-gray-700">Preço de Venda (R$)</label>
                            <input 
                                id="edit-precoPadrao" 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                value={precoPadrao} 
                                onChange={e => setPrecoPadrao(parseFloat(e.target.value))} 
                                required 
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md" 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-custoUnitario" className="block text-sm font-medium text-gray-700">Custo Unitário (R$)</label>
                            <input 
                                id="edit-custoUnitario" 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                value={custoUnitario} 
                                onChange={e => setCustoUnitario(parseFloat(e.target.value))} 
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-estoqueMinimo" className="block text-sm font-medium text-gray-700">Estoque Mínimo</label>
                            <input 
                                id="edit-estoqueMinimo" 
                                type="number" 
                                min="0" 
                                value={estoqueMinimo} 
                                onChange={e => setEstoqueMinimo(parseInt(e.target.value))} 
                                required 
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md" 
                            />
                        </div>
                        {custoUnitario > 0 && precoPadrao > 0 && (
                            <div className="flex items-end">
                                <div className="bg-green-50 border border-green-200 rounded-md p-2 w-full">
                                    <p className="text-xs text-gray-600">Lucro por unidade:</p>
                                    <p className="text-lg font-bold text-green-600">
                                        R$ {(precoPadrao - custoUnitario).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {((precoPadrao - custoUnitario) / precoPadrao * 100).toFixed(1)}% margem
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {custoUnitario === 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                            <p className="text-sm text-yellow-800">
                                💡 <strong>Dica:</strong> Cadastre o custo unitário para acompanhar o lucro real no Relatório de Vendas.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProductCard: React.FC<{ 
    produto: Produto;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onEdit: (produto: Produto) => void;
    userRole: UserRole;
}> = ({ produto, isSelected, onToggleSelect, onEdit, userRole }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start gap-3">
            {userRole === UserRole.ADMIN && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(produto.id)}
                    className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                />
            )}
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-indigo-700">{produto.nome}</h3>
                        <p className="text-sm font-medium text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded-md my-2">{produto.tipo}</p>
                    </div>
                    {userRole === UserRole.ADMIN && (
                        <button
                            onClick={() => onEdit(produto)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                            aria-label="Editar Produto"
                        >
                            <Edit size={20} />
                        </button>
                    )}
                </div>
                <div className="text-gray-600 mt-4 space-y-2">
                    <p className="flex items-center"><strong>Preço:</strong> <span className="ml-2 text-lg font-semibold text-green-600">R$ {produto.precoPadrao.toFixed(2)}</span></p>
                    {produto.custoUnitario && produto.custoUnitario > 0 && (
                        <p className="flex items-center"><strong>Custo:</strong> <span className="ml-2 text-sm text-gray-600">R$ {produto.custoUnitario.toFixed(2)}</span></p>
                    )}
                    <p><strong>Pacote:</strong> {produto.tamanhoPacote}</p>
                    <p><strong>Estoque Mínimo:</strong> {produto.estoqueMinimo} un.</p>
                </div>
            </div>
        </div>
    </div>
);

const ProductRow: React.FC<{ 
    produto: Produto;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onEdit: (produto: Produto) => void;
    userRole: UserRole;
}> = ({ produto, isSelected, onToggleSelect, onEdit, userRole }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
        {userRole === UserRole.ADMIN && (
            <td className="py-3 px-6 text-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(produto.id)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                />
            </td>
        )}
        <td className="py-3 px-6 text-left">{produto.nome}</td>
        <td className="py-3 px-6 text-left">{produto.tipo}</td>
        <td className="py-3 px-6 text-center">{produto.tamanhoPacote}</td>
        <td className="py-3 px-6 text-right font-mono">R$ {produto.precoPadrao.toFixed(2)}</td>
        <td className="py-3 px-6 text-right font-mono text-sm text-gray-600">
            {produto.custoUnitario && produto.custoUnitario > 0 ? `R$ ${produto.custoUnitario.toFixed(2)}` : '-'}
        </td>
        <td className="py-3 px-6 text-center">{produto.estoqueMinimo}</td>
        {userRole === UserRole.ADMIN && (
            <td className="py-3 px-6 text-center">
                <button
                    onClick={() => onEdit(produto)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                    aria-label="Editar Produto"
                >
                    <Edit size={20} />
                </button>
            </td>
        )}
    </tr>
);

export const Products: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const { produtos, deleteProduto } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoToEdit, setProdutoToEdit] = useState<Produto | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditProduct = (produto: Produto) => {
    setProdutoToEdit(produto);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProdutoToEdit(null);
  };

  const handleToggleSelect = (produtoId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(produtoId)) {
        newSet.delete(produtoId);
      } else {
        newSet.add(produtoId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === produtos.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(produtos.map(p => p.id)));
    }
  };

  const handleDeleteSelected = async () => {
    for (const produtoId of selectedProducts) {
      await deleteProduto(produtoId);
    }
    setSelectedProducts(new Set());
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
      {isEditModalOpen && produtoToEdit && <EditProductModal produto={produtoToEdit} onClose={handleCloseEditModal} />}
      
      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
              <span className="bg-red-100 p-2 rounded-full mr-3">⚠️</span>
              Excluir Permanentemente
            </h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja excluir permanentemente {selectedProducts.size} {selectedProducts.size === 1 ? 'produto' : 'produtos'} do sistema? 
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ ATENÇÃO: Esta ação é irreversível!
              </p>
              <p className="text-xs text-red-700 mt-1">
                O produto será removido completamente do banco de dados e não poderá ser recuperado.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSelected}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center"><Box className="mr-3" size={32} /> Cadastro de Produtos</h2>
        <div className="flex flex-col sm:flex-row-reverse gap-2 w-full sm:w-auto">
          {userRole === UserRole.ADMIN && selectedProducts.size > 0 && (
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors w-full sm:w-auto"
            >
              <Trash2 className="mr-2" size={20} />
              Excluir ({selectedProducts.size})
            </button>
          )}
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
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 md:hidden gap-6">
        {produtos.map(produto => (
          <ProductCard 
            key={produto.id} 
            produto={produto}
            isSelected={selectedProducts.has(produto.id)}
            onToggleSelect={handleToggleSelect}
            onEdit={handleEditProduct}
            userRole={userRole}
          />
        ))}
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                    {userRole === UserRole.ADMIN && (
                      <th className="py-3 px-6 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.size === produtos.length && produtos.length > 0}
                          onChange={handleSelectAll}
                          className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                        />
                      </th>
                    )}
                    <th className="py-3 px-6 text-left">Nome</th>
                    <th className="py-3 px-6 text-left">Tipo</th>
                    <th className="py-3 px-6 text-center">Pacote</th>
                    <th className="py-3 px-6 text-right">Preço Venda</th>
                    <th className="py-3 px-6 text-right">Custo</th>
                    <th className="py-3 px-6 text-center">Estoque Mín.</th>
                    {userRole === UserRole.ADMIN && (
                      <th className="py-3 px-6 text-center">Ações</th>
                    )}
                </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {produtos.map(p => (
                      <ProductRow 
                        key={p.id} 
                        produto={p}
                        isSelected={selectedProducts.has(p.id)}
                        onToggleSelect={handleToggleSelect}
                        onEdit={handleEditProduct}
                        userRole={userRole}
                      />
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
