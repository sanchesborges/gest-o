import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, Users, Edit2 } from 'lucide-react';
import { Cliente, TipoCliente, CondicaoPagamento, UserRole } from '../types';

const ClientModal: React.FC<{ cliente?: Cliente; onClose: () => void }> = ({ cliente, onClose }) => {
    const { addCliente, updateCliente } = useAppData();
    const [nome, setNome] = useState(cliente?.nome || '');
    const [tipo, setTipo] = useState<TipoCliente>(cliente?.tipo || TipoCliente.PADARIA);
    const [endereco, setEndereco] = useState(cliente?.endereco || '');
    const [telefone, setTelefone] = useState(cliente?.telefone || '');
    const [condicaoPagamento, setCondicaoPagamento] = useState<CondicaoPagamento>(cliente?.condicaoPagamento || CondicaoPagamento.A_VISTA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (cliente) {
                await updateCliente(cliente.id, { nome, tipo, endereco, telefone, condicaoPagamento });
            } else {
                await addCliente({ nome, tipo, endereco, telefone, condicaoPagamento });
            }
            onClose();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {cliente ? 'Editar Cliente' : 'Novo Cliente'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input 
                            type="text" 
                            placeholder="Nome do cliente" 
                            value={nome} 
                            onChange={e => setNome(e.target.value)} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select 
                            value={tipo} 
                            onChange={e => setTipo(e.target.value as TipoCliente)} 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            {Object.values(TipoCliente).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                        <input 
                            type="text" 
                            placeholder="Endereço completo" 
                            value={endereco} 
                            onChange={e => setEndereco(e.target.value)} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input 
                            type="text" 
                            placeholder="(00) 00000-0000" 
                            value={telefone} 
                            onChange={e => setTelefone(e.target.value)} 
                            required 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condição de Pagamento</label>
                        <select 
                            value={condicaoPagamento} 
                            onChange={e => setCondicaoPagamento(e.target.value as CondicaoPagamento)} 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            {Object.values(CondicaoPagamento).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isSubmitting}
                            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const Clients: React.FC<{userRole: UserRole}> = ({userRole}) => {
  const { clientes } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>(undefined);

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCliente(undefined);
  };

  return (
    <div className="space-y-6 p-6 pt-8">
      {isModalOpen && <ClientModal cliente={editingCliente} onClose={handleCloseModal} />}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center"><Users className="mr-3" size={32} /> Cadastro de Clientes</h2>
        {userRole === UserRole.ADMIN && (
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto"
            >
            <PlusCircle className="mr-2" size={20} />
            Novo Cliente
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map(cliente => (
            <div key={cliente.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                {userRole === UserRole.ADMIN && (
                    <button
                        onClick={() => handleEdit(cliente)}
                        className="absolute top-4 right-4 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar cliente"
                    >
                        <Edit2 size={18} />
                    </button>
                )}
                <h3 className="text-xl font-bold text-indigo-700 pr-10">{cliente.nome}</h3>
                <p className="text-sm font-medium text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded-md my-2">{cliente.tipo}</p>
                <div className="text-gray-600 mt-4 space-y-2">
                    <p><strong>Endereço:</strong> {cliente.endereco}</p>
                    <p><strong>Telefone:</strong> {cliente.telefone}</p>
                    <p><strong>Pagamento:</strong> {cliente.condicaoPagamento}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};