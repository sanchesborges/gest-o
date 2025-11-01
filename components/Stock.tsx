import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, Package, TrendingUp, TrendingDown, Box, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { Produto, UserRole } from '../types';
import { Link } from 'react-router-dom';
import { OrderConfirmationModal } from './OrderConfirmationModal';

// Card component for mobile view
const StockCard: React.FC<{ 
  produto: Produto; 
  isSelected: boolean; 
  onToggleSelect: (id: string) => void;
}> = ({ produto, isSelected, onToggleSelect }) => {
  const isLowStock = produto.estoqueAtual < produto.estoqueMinimo;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 transform hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(produto.id)}
            className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-800">{produto.nome}</h3>
            <p className="text-sm text-gray-500">{produto.tamanhoPacote}</p>
          </div>
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
const StockRow: React.FC<{ 
  produto: Produto; 
  isSelected: boolean; 
  onToggleSelect: (id: string) => void;
}> = ({ produto, isSelected, onToggleSelect }) => {
  const isLowStock = produto.estoqueAtual < produto.estoqueMinimo;
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(produto.id)}
          className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
        />
      </td>
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


interface ItemEntrada {
    id: string;
    produtoId: string;
    quantidade: number;
}

const AddStockModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { produtos, addEntradaEstoque } = useAppData();
    const [produtoId, setProdutoId] = useState(produtos[0]?.id || '');
    const [quantidade, setQuantidade] = useState(1);
    const [fornecedor, setFornecedor] = useState('Fábrica Matriz');
    const [itensEntrada, setItensEntrada] = useState<ItemEntrada[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [registeredItems, setRegisteredItems] = useState<ItemEntrada[]>([]);
    const [registeredDate, setRegisteredDate] = useState<Date>(new Date());
    const [registeredFornecedor, setRegisteredFornecedor] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Buscar produto selecionado sempre que produtos ou produtoId mudar
    const produtoSelecionado = React.useMemo(() => {
        return produtos.find(p => p.id === produtoId);
    }, [produtos, produtoId]);
    
    // Log para debug
    console.log('📦 Produto selecionado:', produtoSelecionado?.nome, 'Estoque:', produtoSelecionado?.estoqueAtual);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prevenir múltiplos cliques
        if (isSubmitting) {
            console.log('⚠️ Já está processando uma entrada de estoque...');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Preparar itens para registro
            const itemsToRegister = itensEntrada.length > 0 ? itensEntrada : [{
                id: Date.now().toString(),
                produtoId,
                quantidade
            }];
            
            const registrationDate = new Date();
            
            console.log('🚀 Iniciando registro de entrada de estoque...');
            console.log('   Itens a registrar:', itemsToRegister.length);
            
            // Registrar no sistema
            for (const item of itemsToRegister) {
                const produtoAntes = produtos.find(p => p.id === item.produtoId);
                console.log(`   📦 Antes: ${produtoAntes?.nome} - Estoque: ${produtoAntes?.estoqueAtual}`);
                
                await addEntradaEstoque({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    fornecedor,
                    dataRecebimento: registrationDate
                });
                
                console.log(`   ✅ Entrada registrada para ${produtoAntes?.nome}`);
            }
            
            console.log('✅ Registro concluído!');
            
            // Preparar dados para confirmação
            setRegisteredItems(itemsToRegister);
            setRegisteredDate(registrationDate);
            setRegisteredFornecedor(fornecedor);
            setShowConfirmation(true);
        } catch (error) {
            console.error('❌ Erro ao registrar entrada:', error);
            alert('Erro ao registrar entrada de estoque. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseAll = () => {
        setShowConfirmation(false);
        onClose();
    };

    const handleAddToList = () => {
        // Verificar se o produto já está na lista
        const produtoJaAdicionado = itensEntrada.find(item => item.produtoId === produtoId);
        
        if (produtoJaAdicionado) {
            // Se já existe, atualizar a quantidade
            setItensEntrada(itensEntrada.map(item => 
                item.produtoId === produtoId 
                    ? { ...item, quantidade: item.quantidade + quantidade }
                    : item
            ));
        } else {
            // Se não existe, adicionar novo item
            setItensEntrada([...itensEntrada, {
                id: Date.now().toString(),
                produtoId,
                quantidade
            }]);
        }
        
        // Resetar quantidade para 1
        setQuantidade(1);
    };

    const handleRemoveFromList = (id: string) => {
        setItensEntrada(itensEntrada.filter(item => item.id !== id));
    };

    const handleIncrement = () => setQuantidade(prev => prev + 1);
    const handleDecrement = () => setQuantidade(prev => prev > 1 ? prev - 1 : 1);

    const totalItens = itensEntrada.reduce((sum, item) => sum + item.quantidade, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start sm:items-center z-50 p-4 pt-8 sm:pt-4 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] flex flex-col my-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-xl mr-2 sm:mr-3">
                            <TrendingUp className="text-white" size={24}/>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Entrada no Estoque</h2>
                            <p className="text-white text-opacity-80 text-xs sm:text-sm">Registre novos produtos</p>
                        </div>
                    </div>
                </div>
                
                {/* Form Content */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
                    {/* Produto Selection */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-5 rounded-xl border border-blue-100">
                        <label htmlFor="produto" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs mr-2">1</span>
                            Selecione o Produto
                        </label>
                        <select 
                            id="produto" 
                            value={produtoId} 
                            onChange={e => setProdutoId(e.target.value)} 
                            className="w-full p-2 sm:p-3 border-2 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 font-medium text-sm sm:text-lg"
                        >
                            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} - {p.tamanhoPacote}</option>)}
                        </select>
                        
                        {/* Info do Produto Selecionado */}
                        {produtoSelecionado && (
                            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-white rounded-lg border border-blue-200">
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <div>
                                        <span className="text-gray-500 font-medium text-xs">Estoque Atual:</span>
                                        <p className="text-base sm:text-lg font-bold text-gray-800">{produtoSelecionado.estoqueAtual}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 font-medium text-xs">Estoque Mínimo:</span>
                                        <p className="text-base sm:text-lg font-bold text-gray-800">{produtoSelecionado.estoqueMinimo}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quantidade */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-5 rounded-xl border border-green-100">
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs mr-2">2</span>
                            Quantidade Recebida
                        </label>
                        <div className="flex items-center justify-center gap-2 sm:gap-4">
                            <button 
                                type="button" 
                                onClick={handleDecrement}
                                className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-3 sm:p-4 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                                aria-label="Diminuir quantidade"
                            >
                                <Minus size={24} strokeWidth={3}/>
                            </button>
                            <div className="flex-1 text-center bg-white p-3 sm:p-4 rounded-xl border-2 border-green-600 shadow-md">
                                <input 
                                    type="number" 
                                    id="quantidade" 
                                    value={quantidade} 
                                    onChange={e => setQuantidade(Math.max(1, parseInt(e.target.value, 10) || 1))} 
                                    min="1" 
                                    className="w-full text-center text-3xl sm:text-4xl font-bold text-green-600 focus:outline-none bg-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">unidades</p>
                            </div>
                            <button 
                                type="button" 
                                onClick={handleIncrement}
                                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-3 sm:p-4 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                                aria-label="Aumentar quantidade"
                            >
                                <Plus size={24} strokeWidth={3}/>
                            </button>
                        </div>
                        
                        {/* Preview do Novo Estoque */}
                        {produtoSelecionado && (
                            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-white rounded-lg border border-green-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                                    <span className="text-xs sm:text-sm text-gray-600">Novo estoque:</span>
                                    <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                                        <span className="font-medium text-gray-400">{produtoSelecionado.estoqueAtual}</span>
                                        <span className="text-green-600 font-bold text-xs sm:text-sm">+{quantidade}</span>
                                        <span className="font-bold text-green-600">= {produtoSelecionado.estoqueAtual + quantidade}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botão Adicionar à Lista */}
                        <button
                            type="button"
                            onClick={handleAddToList}
                            className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={18} />
                            Adicionar à Lista
                        </button>
                    </div>

                    {/* Lista de Produtos Adicionados */}
                    {itensEntrada.length > 0 && (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-3 sm:p-5 rounded-xl border border-yellow-200">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm sm:text-base font-bold text-gray-800 flex items-center">
                                    <ShoppingCart size={18} className="mr-2" />
                                    Produtos na Lista ({itensEntrada.length})
                                </h3>
                                <span className="text-xs sm:text-sm font-semibold text-gray-600">
                                    Total: {totalItens} unidades
                                </span>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {itensEntrada.map(item => {
                                    const produto = produtos.find(p => p.id === item.produtoId);
                                    return (
                                        <div key={item.id} className="bg-white p-3 rounded-lg border border-yellow-300 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 text-sm">{produto?.nome}</p>
                                                <p className="text-xs text-gray-600">{produto?.tamanhoPacote}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-green-600 text-lg">{item.quantidade}x</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFromList(item.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                                                    aria-label="Remover item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Fornecedor */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-5 rounded-xl border border-purple-100">
                        <label htmlFor="fornecedor" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-green-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs mr-2">3</span>
                            Fornecedor
                        </label>
                        <input 
                            type="text" 
                            id="fornecedor" 
                            value={fornecedor} 
                            onChange={e => setFornecedor(e.target.value)} 
                            placeholder="Ex: Fábrica Matriz..."
                            className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-gray-900 font-medium text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl border-t-2 border-gray-200">
                    <div className="flex flex-row justify-end items-center gap-2 sm:gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="bg-white border-2 border-gray-300 text-gray-700 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-50 transition-colors flex-1 sm:flex-initial text-sm sm:text-base"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSubmit}
                            disabled={isSubmitting || (itensEntrada.length === 0 && quantidade < 1)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex-1 sm:flex-initial flex items-center justify-center text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusCircle className="mr-1 sm:mr-2" size={18} />
                            <span className="hidden sm:inline">
                                {isSubmitting ? 'Registrando...' : itensEntrada.length > 0 ? `Registrar ${itensEntrada.length} ${itensEntrada.length === 1 ? 'Produto' : 'Produtos'}` : 'Registrar Entrada'}
                            </span>
                            <span className="sm:hidden">{isSubmitting ? 'Aguarde...' : 'Registrar'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmação */}
            {showConfirmation && (
                <OrderConfirmationModal
                    produtos={registeredItems}
                    fornecedor={registeredFornecedor}
                    dataRegistro={registeredDate}
                    onClose={handleCloseAll}
                />
            )}
        </div>
    )
}

export const Stock: React.FC<{userRole: UserRole}> = ({userRole}) => {
  const { produtos, deleteProduto } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    <div className="space-y-6 p-6 pt-8">
        {isModalOpen && <AddStockModal onClose={() => setIsModalOpen(false)} />}
        
        {/* Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir {selectedProducts.size} {selectedProducts.size === 1 ? 'produto' : 'produtos'}? 
                Esta ação não pode ser desfeita.
              </p>
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
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center"><Package className="mr-3" size={32} /> Controle de Estoque</h2>
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
            {produtos.map(p => (
              <StockCard 
                key={p.id} 
                produto={p} 
                isSelected={selectedProducts.has(p.id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                        <th className="py-3 px-6 text-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.size === produtos.length && produtos.length > 0}
                            onChange={handleSelectAll}
                            className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                          />
                        </th>
                        <th className="py-3 px-6 text-left">Produto</th>
                        <th className="py-3 px-6 text-center">Pacote</th>
                        <th className="py-3 px-6 text-center">Estoque Atual</th>
                        <th className="py-3 px-6 text-center">Estoque Mínimo</th>
                        <th className="py-3 px-6 text-center">Status</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                    {produtos.map(p => (
                      <StockRow 
                        key={p.id} 
                        produto={p} 
                        isSelected={selectedProducts.has(p.id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};