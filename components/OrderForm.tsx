import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { ItemPedido, StatusPedido, StatusPagamento } from '../types';
import { Plus, Trash2, X, ShoppingCart, Minus } from 'lucide-react';

export const OrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { clientes, produtos, addPedido } = useAppData();
    const [clienteId, setClienteId] = useState<string>(clientes[0]?.id || '');
    const [itens, setItens] = useState<ItemPedido[]>([]);

    const handleAddItem = () => {
        const defaultProduct = produtos.find(p => !itens.some(i => i.produtoId === p.id));
        if (defaultProduct) {
            setItens([...itens, { produtoId: defaultProduct.id, quantidade: 1, precoUnitario: defaultProduct.precoPadrao }]);
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
            }
        } else if ((field === 'quantidade' || field === 'precoUnitario') && typeof value === 'number') {
            (newItens[index] as any)[field] = value;
        }

        setItens(newItens);
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
    };
    
    const calculateTotal = () => {
        return itens.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!clienteId || itens.length === 0) {
            alert("Selecione um cliente e adicione pelo menos um item.");
            return;
        }

        const cliente = clientes.find(c => c.id === clienteId);
        if(!cliente) return;
        
        const isCashPayment = cliente.condicaoPagamento.includes('vista');

        addPedido({
            clienteId,
            itens,
            data: new Date(),
            valorTotal: calculateTotal(),
            status: StatusPedido.PENDENTE,
            statusPagamento: StatusPagamento.PENDENTE,
            dataVencimentoPagamento: new Date(new Date().setDate(new Date().getDate() + (isCashPayment ? 0 : 14)))
        });
        onClose();
    };

    const availableProducts = (currentItemId?: string) => 
        produtos.filter(p => !itens.some(i => i.produtoId === p.id) || p.id === currentItemId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl relative">
                    <div className="flex items-center">
                        <ShoppingCart className="text-indigo-600 mr-3" size={28}/>
                        <h2 className="text-2xl font-bold text-gray-800">Novo Pedido</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800 absolute top-4 right-4 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Form Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div>
                        <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                        <select id="cliente" value={clienteId} onChange={e => setClienteId(e.target.value)} className="w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900">
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Itens do Pedido</h3>
                        <div className="space-y-3">
                            {itens.map((item, index) => {
                                return (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                                        <div className="w-full sm:w-2/5">
                                            <label className="text-xs text-gray-500">Produto</label>
                                            <select value={item.produtoId} onChange={e => handleItemChange(index, 'produtoId', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-gray-900">
                                                {availableProducts(item.produtoId).map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                            </select>
                                        </div>
                                        
                                        <div className="w-auto">
                                             <label className="text-xs text-gray-500">Qtd.</label>
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button type="button" onClick={() => handleQuantityChange(index, -1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-l-md"><Minus size={16}/></button>
                                                <span className="px-4 py-1.5 text-center font-semibold bg-white text-gray-900">{item.quantidade}</span>
                                                <button type="button" onClick={() => handleQuantityChange(index, 1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-r-md"><Plus size={16}/></button>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-1/4">
                                            <label className="text-xs text-gray-500">Preço Unit.</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                                                <input type="number" step="0.01" value={item.precoUnitario.toFixed(2)} onChange={e => handleItemChange(index, 'precoUnitario', parseFloat(e.target.value))} className="w-full p-2 pl-8 border border-gray-300 rounded-md bg-gray-100 text-gray-900" />
                                            </div>
                                        </div>

                                        <div className="flex-grow text-right pr-2">
                                            <label className="text-xs text-gray-500">Subtotal</label>
                                            <p className="font-bold text-gray-800">R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</p>
                                        </div>

                                        <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-2 self-center"><Trash2 size={20} /></button>
                                    </div>
                                );
                            })}
                        </div>
                        <button type="button" onClick={handleAddItem} disabled={produtos.length === itens.length} className="mt-4 flex items-center text-indigo-600 font-semibold hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed">
                            <Plus className="mr-1" size={16} /> Adicionar Item
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center flex-shrink-0 p-6 bg-gray-50 rounded-b-xl border-t">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 w-full mt-2 sm:w-auto sm:mt-0">Cancelar</button>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <div className="text-right">
                            <span className="text-sm font-medium text-gray-600">TOTAL</span>
                            <p className="text-3xl font-bold text-gray-800">R$ {calculateTotal().toFixed(2)}</p>
                        </div>
                        <button type="submit" onClick={handleSubmit} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 w-full sm:w-auto">Salvar Pedido</button>
                    </div>
                </div>
            </div>
        </div>
    );
};