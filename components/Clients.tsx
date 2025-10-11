import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { PlusCircle, Users } from 'lucide-react';
import { Cliente, TipoCliente, CondicaoPagamento, UserRole } from '../types';

const AddClientModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addCliente } = useAppData();
    const [nome, setNome] = useState('');
    const [tipo, setTipo] = useState<TipoCliente>(TipoCliente.PADARIA);
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [condicaoPagamento, setCondicaoPagamento] = useState<CondicaoPagamento>(CondicaoPagamento.A_VISTA);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addCliente({ nome, tipo, endereco, telefone, condicaoPagamento });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Novo Cliente</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                    <select value={tipo} onChange={e => setTipo(e.target.value as TipoCliente)} className="w-full p-2 border border-gray-300 rounded-md">
                        {Object.values(TipoCliente).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input type="text" placeholder="Endereço" value={endereco} onChange={e => setEndereco(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                    <input type="text" placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                    <select value={condicaoPagamento} onChange={e => setCondicaoPagamento(e.target.value as CondicaoPagamento)} className="w-full p-2 border border-gray-300 rounded-md">
                        {Object.values(CondicaoPagamento).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const Clients: React.FC<{userRole: UserRole}> = ({userRole}) => {
  const { clientes } = useAppData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 p-6 pt-8">
      {isModalOpen && <AddClientModal onClose={() => setIsModalOpen(false)} />}
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
            <div key={cliente.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-indigo-700">{cliente.nome}</h3>
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