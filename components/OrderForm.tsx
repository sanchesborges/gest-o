import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { ItemPedido, StatusPedido, StatusPagamento } from '../types';
import { Plus, Trash2, X, ShoppingCart, Minus } from 'lucide-react';

export const OrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { clientes, produtos, addPedido } = useAppData();
    const [clienteId, setClienteId] = useState<string>(clientes[0]?.id || '');
    const [itens, setItens] = useState<ItemPedido[]>([]);
    const [precoInputs, setPrecoInputs] = useState<{ [key: number]: string }>({});
    const [dataPedido, setDataPedido] = useState<string>(new Date().toISOString().split('T')[0]);

    const handleAddItem = () => {
        const defaultProduct = produtos.find(p => !itens.some(i => i.produtoId === p.id));
        if (defaultProduct) {
            console.log('🛒 Adicionando produto:', defaultProduct);
            console.log('💰 Preço padrão:', defaultProduct.precoPadrao);

            const newIndex = itens.length;
            const preco = defaultProduct.precoPadrao || 0;

            setItens([...itens, {
                produtoId: defaultProduct.id,
                quantidade: 1,
                precoUnitario: preco
            }]);
            setPrecoInputs({ ...precoInputs, [newIndex]: preco.toFixed(2) });

            console.log('✅ Item adicionado com preço:', preco);
        } else {
            alert("Todos os produtos já foram adicionados.");
        }
    };

    const handleItemChange = (index: number, field: keyof ItemPedido, value: string | number) => {
        const newItens = [...itens];

        if (field === 'produtoId' && typeof value === 'string') {
            newItens[index].produtoId = value;
            const produto = produtos.find(p => p.id === value);
            if (produto) {
                newItens[index].precoUnitario = produto.precoPadrao;
                setPrecoInputs({ ...precoInputs, [index]: produto.precoPadrao.toFixed(2) });
            }
        } else if ((field === 'quantidade' || field === 'precoUnitario') && typeof value === 'number') {
            (newItens[index] as any)[field] = value;
        }

        setItens(newItens);
    };

    const handlePrecoChange = (index: number, value: string) => {
        // Permitir apenas números e ponto decimal
        const sanitized = value.replace(/[^\d.]/g, '');
        setPrecoInputs({ ...precoInputs, [index]: sanitized });
        const numValue = parseFloat(sanitized);
        if (!isNaN(numValue) && numValue >= 0) {
            handleItemChange(index, 'precoUnitario', numValue);
        } else if (sanitized === '' || sanitized === '.') {
            // Se vazio ou apenas ponto, definir como 0
            handleItemChange(index, 'precoUnitario', 0);
        }
    };

    const handlePrecoBlur = (index: number) => {
        const currentValue = precoInputs[index];
        const numValue = parseFloat(currentValue);
        if (!isNaN(numValue) && numValue >= 0) {
            setPrecoInputs({ ...precoInputs, [index]: numValue.toFixed(2) });
        } else {
            setPrecoInputs({ ...precoInputs, [index]: itens[index].precoUnitario.toFixed(2) });
        }
    };

    const handleQuantityChange = (index: number, delta: number) => {
        const newItens = [...itens];
        const newQuantity = newItens[index].quantidade + delta;
        if (newQuantity >= 1) {
            newItens[index].quantidade = newQuantity;
            setItens(newItens);
        }
    };

    const handleRemoveItem = (index: number) => {
        setItens(itens.filter((_, i) => i !== index));
        const newPrecoInputs = { ...precoInputs };
        delete newPrecoInputs[index];
        // Reindexar os preços
        const reindexed: { [key: number]: string } = {};
        Object.keys(newPrecoInputs).forEach(key => {
            const oldIndex = parseInt(key);
            if (oldIndex > index) {
                reindexed[oldIndex - 1] = newPrecoInputs[oldIndex];
            } else {
                reindexed[oldIndex] = newPrecoInputs[oldIndex];
            }
        });
        setPrecoInputs(reindexed);
    };

    const calculateTotal = () => {
        return itens.reduce((total, item) => {
            const quantidade = item.quantidade || 0;
            const preco = item.precoUnitario || 0;
            return total + (quantidade * preco);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clienteId || itens.length === 0) {
            alert("Selecione um cliente e adicione pelo menos um item.");
            return;
        }

        const cliente = clientes.find(c => c.id === clienteId);
        if (!cliente) {
            alert("Cliente não encontrado.");
            return;
        }

        const isCashPayment = cliente.condicaoPagamento?.toString().toLowerCase().includes('vista') || false;

        const dataSelecionada = new Date(dataPedido + 'T12:00:00');

        try {
            await addPedido({
                clienteId,
                itens,
                data: dataSelecionada,
                valorTotal: calculateTotal(),
                status: StatusPedido.PENDENTE,
                statusPagamento: StatusPagamento.PENDENTE,
                dataVencimentoPagamento: new Date(new Date(dataSelecionada).setDate(dataSelecionada.getDate() + 7))
            });
            onClose();
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
            alert('Erro ao salvar pedido. Verifique o console para mais detalhes.');
        }
    };

    const availableProducts = (currentItemId?: string) =>
        produtos.filter(p => !itens.some(i => i.produtoId === p.id) || p.id === currentItemId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[calc(100vh-120px)] max-h-[85vh] flex flex-col mb-20" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gradient-to-r from-[#5B6B9E] to-[#4A5A8D] rounded-t-2xl relative flex-shrink-0">
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-xl mr-2 sm:mr-3">
                            <ShoppingCart className="text-white" size={24} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Novo Pedido</h2>
                            <input
                                type="date"
                                id="dataPedido"
                                value={dataPedido}
                                onChange={e => setDataPedido(e.target.value)}
                                className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md px-2 py-1 text-white text-xs sm:text-sm font-bold focus:outline-none focus:bg-opacity-30 transition-all cursor-pointer w-fit"
                            />
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-white text-opacity-80 rounded-full hover:bg-white hover:bg-opacity-20 hover:text-white absolute top-3 sm:top-4 right-3 sm:right-4 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content - Com scroll */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-0">
                    {/* Cliente Selection */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                        <label htmlFor="cliente" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <span className="bg-[#5B6B9E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                            Selecione o Cliente
                        </label>
                        <select
                            id="cliente"
                            value={clienteId}
                            onChange={e => setClienteId(e.target.value)}
                            className="w-full p-3 border-2 border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5B6B9E] focus:border-transparent text-gray-900 font-medium text-lg"
                        >
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>

                    {/* Items Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                            <label className="block text-xs sm:text-sm font-bold text-gray-700 flex items-center">
                                <span className="bg-[#5B6B9E] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs mr-2">2</span>
                                Itens do Pedido
                            </label>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                disabled={produtos.length === itens.length}
                                className="flex items-center bg-[#A8D96E] text-gray-800 font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-[#98C95E] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md text-sm w-full sm:w-auto justify-center"
                            >
                                <Plus className="mr-1" size={18} /> Adicionar Produto
                            </button>
                        </div>

                        {itens.length === 0 ? (
                            <div className="text-center py-6 sm:py-8 text-gray-400">
                                <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
                                <p className="text-xs sm:text-sm">Nenhum item adicionado ainda</p>
                                <p className="text-xs hidden sm:block">Clique em "Adicionar Produto" para começar</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {itens.map((item, index) => {
                                    const produto = produtos.find(p => p.id === item.produtoId);
                                    return (
                                        <div key={index} className="bg-white p-3 sm:p-4 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                            {/* Mobile Layout */}
                                            <div className="flex flex-col gap-2 sm:gap-3">
                                                {/* Produto */}
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Produto</label>
                                                    <select
                                                        value={item.produtoId}
                                                        onChange={e => handleItemChange(index, 'produtoId', e.target.value)}
                                                        className="w-full p-2 sm:p-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#5B6B9E] focus:border-transparent text-sm sm:text-base"
                                                    >
                                                        {availableProducts(item.produtoId).map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                                    </select>
                                                </div>

                                                {/* Quantidade e Preço */}
                                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Quantidade</label>
                                                        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuantityChange(index, -1)}
                                                                className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <span className="flex-1 text-center font-bold text-lg sm:text-xl text-gray-900">{item.quantidade}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuantityChange(index, 1)}
                                                                className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Preço Unit.</label>
                                                        <div className="relative">
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 text-gray-500 font-bold text-xs sm:text-sm">R$</span>
                                                            <input
                                                                type="text"
                                                                inputMode="decimal"
                                                                value={precoInputs[index] !== undefined ? precoInputs[index] : item.precoUnitario.toFixed(2)}
                                                                onChange={e => handlePrecoChange(index, e.target.value)}
                                                                onBlur={() => handlePrecoBlur(index)}
                                                                onFocus={e => e.target.select()}
                                                                placeholder="0.00"
                                                                className="w-full p-2 sm:p-3 pl-8 sm:pl-10 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#5B6B9E] focus:border-transparent text-sm sm:text-base"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Subtotal e Remover */}
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                    <div>
                                                        <span className="text-xs font-semibold text-gray-500 uppercase">Subtotal</span>
                                                        <p className="text-xl sm:text-2xl font-bold text-[#5B6B9E]">
                                                            R$ {((item.quantidade || 0) * (item.precoUnitario || 0)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(index)}
                                                        className="bg-red-100 text-red-600 hover:bg-red-200 p-2 sm:p-3 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer - Sempre visível */}
                <div className="flex-shrink-0 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl border-t-2 border-gray-200">
                    {/* Total do Pedido - Sempre visível no topo */}
                    <div className="text-center bg-white p-2 sm:p-3 rounded-lg border-2 border-[#5B6B9E] shadow-md mb-2 sm:mb-3">
                        <span className="text-xs font-bold text-gray-600 uppercase block">Total do Pedido</span>
                        <p className="text-xl sm:text-2xl font-bold text-[#5B6B9E]">R$ {calculateTotal().toFixed(2)}</p>
                    </div>

                    {/* Botões lado a lado */}
                    <div className="flex flex-row items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border-2 border-gray-300 text-gray-700 font-bold py-2 sm:py-3 px-3 sm:px-6 rounded-lg hover:bg-gray-50 transition-colors flex-1 text-sm sm:text-base"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={itens.length === 0}
                            className="bg-gradient-to-r from-[#5B6B9E] to-[#4A5A8D] text-white font-bold py-2 sm:py-3 px-3 sm:px-8 rounded-lg hover:from-[#4A5A8D] hover:to-[#3A4A7D] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg flex-1 text-sm sm:text-base"
                        >
                            Salvar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};