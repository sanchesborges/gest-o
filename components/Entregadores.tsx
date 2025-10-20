import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { UserPlus, X, Bike, UserCheck, Phone, Share2, Check, MessageCircle, Trash2 } from 'lucide-react';
import { StatusPedido } from '../types';

const AddEntregadorModal: React.FC<{ onClose: () => void, onAdd: (data: { nome: string, telefone: string, avatarUrl?: string }) => void }> = ({ onClose, onAdd }) => {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Validar tamanho (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 2MB.');
            return;
        }

        setIsLoadingImage(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarUrl(reader.result as string);
            setIsLoadingImage(false);
        };
        reader.onerror = () => {
            alert('Erro ao carregar a imagem. Tente novamente.');
            setIsLoadingImage(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nome.trim()) {
            onAdd({ 
                nome: nome.trim(), 
                telefone: telefone.trim(),
                avatarUrl: avatarUrl || undefined
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                    <div className="flex items-center">
                        <UserPlus className="text-indigo-600 mr-3" size={28}/>
                        <h2 className="text-2xl font-bold text-gray-800">Novo Entregador</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            placeholder="Ex: João da Silva"
                        />
                    </div>
                    <div>
                        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input
                            type="tel"
                            id="telefone"
                            value={telefone}
                            onChange={e => setTelefone(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="(11) 98765-4321"
                        />
                    </div>
                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                            Foto do Entregador (opcional)
                        </label>
                        <div className="mt-1 flex items-center gap-4">
                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                disabled={isLoadingImage}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Selecione uma foto do seu dispositivo (máximo 2MB)
                        </p>
                        {isLoadingImage && (
                            <div className="mt-2 text-sm text-gray-600">
                                Carregando imagem...
                            </div>
                        )}
                        {avatarUrl && !isLoadingImage && (
                            <div className="mt-3 flex items-center gap-3">
                                <img 
                                    src={avatarUrl} 
                                    alt="Preview" 
                                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setAvatarUrl('')}
                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                    Remover foto
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Footer with buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const Entregadores: React.FC = () => {
    const { entregadores, pedidos, clientes, addEntregador, deleteEntregador } = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleAddEntregador = async (data: { nome: string; telefone: string; avatarUrl?: string }) => {
        await addEntregador(data);
    };

    const handleDeleteEntregador = async (entregadorId: string, entregadorNome: string) => {
        const confirmar = window.confirm(
            `Tem certeza que deseja excluir o entregador "${entregadorNome}"?\n\nEsta ação não pode ser desfeita.`
        );
        
        if (confirmar) {
            await deleteEntregador(entregadorId);
        }
    };
    
    const handleShare = async (entregadorId: string, entregadorNome: string) => {
        const link = `${window.location.origin}/%23/entregador/${entregadorId}`;

        const shareData = {
            title: `Acesso de Entregador - Maná`,
            text: `Olá, ${entregadorNome.split(' ')[0]}! Acesse seu portal de entregas aqui:`,
            url: link,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Erro ao compartilhar:", err);
            }
        } else {
            navigator.clipboard.writeText(link).then(() => {
                setCopiedId(entregadorId);
                setTimeout(() => setCopiedId(null), 2000);
            }).catch(err => {
                console.error("Erro ao copiar:", err);
                alert("Não foi possível copiar o link.");
            });
        }
    };

    const handleShareWhatsApp = (entregador: { id: string; nome: string; telefone?: string }) => {
        const link = `${window.location.origin}/%23/entregador/${entregador.id}`;

        const pendingDeliveries = pedidos.filter(p => 
            p.entregadorId === entregador.id && p.status === StatusPedido.PENDENTE
        );

        const message = `*MANÁ - Portal do Entregador*%0A%0A` +
                        `Olá, *${entregador.nome.split(' ')[0]}*!%0A%0A` +
                        `Você tem *${pendingDeliveries.length} ${pendingDeliveries.length === 1 ? 'entrega pendente' : 'entregas pendentes'}* para hoje.%0A%0A` +
                        `Acesse seu portal de entregas clicando no link abaixo:%0A` +
                        `${link}%0A%0A` +
                        `_Neste portal você pode:_%0A` +
                        `✅ Ver suas entregas pendentes%0A` +
                        `✅ Confirmar entregas%0A` +
                        `✅ Obter assinatura dos clientes%0A%0A` +
                        `_Boas entregas!_`;

        const telefone = entregador.telefone?.replace(/\D/g, '');
        const whatsappUrl = telefone 
            ? `https://wa.me/55${telefone}?text=${message}`
            : `https://wa.me/?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="space-y-6 p-6 pt-8">
            {isModalOpen && <AddEntregadorModal onClose={() => setIsModalOpen(false)} onAdd={handleAddEntregador} />}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
                    <Bike className="mr-3" size={32} />
                    Controle de Entregadores
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                    <UserPlus className="mr-2" size={20} />
                    Novo Entregador
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entregadores.map(entregador => {
                    const entregas = pedidos.filter(p => p.entregadorId === entregador.id && p.status === StatusPedido.ENTREGUE);
                    const totalEntregas = entregas.length;
                    const valorTotalEntregue = entregas.reduce((sum, p) => sum + p.valorTotal, 0);
                    const clientesAtendidosNomes = [...new Set(entregas.map(p => p.clienteId))]
                        .map(cId => clientes.find(c => c.id === cId)?.nome)
                        .filter(Boolean)
                        .join(', ');

                    const pendingDeliveries = pedidos.filter(p => 
                        p.entregadorId === entregador.id && p.status === StatusPedido.PENDENTE
                    );

                    return (
                        <div key={entregador.id} className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    {entregador.avatarUrl ? (
                                        <img 
                                            src={entregador.avatarUrl} 
                                            alt={entregador.nome}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 mr-3"
                                            onError={(e) => {
                                                const img = e.target as HTMLImageElement;
                                                img.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="p-3 bg-indigo-100 rounded-full mr-3">
                                            <UserCheck className="text-indigo-600" size={24}/>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold text-indigo-800">{entregador.nome}</h3>
                                        {pendingDeliveries.length > 0 && (
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                                                {pendingDeliveries.length} pendente{pendingDeliveries.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-gray-700 mb-4">
                                {entregador.telefone && (
                                    <p className="text-sm flex items-center">
                                        <Phone size={14} className="mr-2 text-gray-500" />
                                        <strong>Telefone:</strong>
                                        <span className="font-semibold text-base ml-2">{entregador.telefone}</span>
                                    </p>
                                )}
                                <p className="text-sm"><strong>Entregas Realizadas:</strong> <span className="font-semibold text-base">{totalEntregas}</span></p>
                                <p className="text-sm"><strong>Valor Total Entregue:</strong> <span className="font-semibold text-base text-green-600">R$ {valorTotalEntregue.toFixed(2)}</span></p>
                                <div>
                                    <strong className="text-sm">Estabelecimentos Atendidos:</strong>
                                    <p className="text-xs text-gray-500 italic mt-1 break-words">{clientesAtendidosNomes || 'Nenhuma entrega registrada'}</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-3 border-t">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleShareWhatsApp(entregador)}
                                        className="flex-1 bg-green-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <MessageCircle size={16} className="mr-2" />
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => handleShare(entregador.id, entregador.nome)}
                                        className="flex-1 bg-indigo-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors text-sm"
                                    >
                                        {copiedId === entregador.id ? (
                                            <>
                                                <Check size={16} className="mr-2" />
                                                Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <Share2 size={16} className="mr-2" />
                                                Copiar Link
                                            </>
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDeleteEntregador(entregador.id, entregador.nome)}
                                    className="w-full bg-red-600 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors text-sm"
                                    title="Excluir entregador"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Excluir
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
