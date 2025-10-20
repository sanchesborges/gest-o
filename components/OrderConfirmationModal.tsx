import React, { useState, useRef } from 'react';
import { useAppData } from '../hooks/useAppData';
import { X, Share2, Download, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ItemEntrada {
    id: string;
    produtoId: string;
    quantidade: number;
}

interface OrderConfirmationModalProps {
    produtos: ItemEntrada[];
    fornecedor: string;
    dataRegistro: Date;
    onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
    produtos,
    fornecedor,
    dataRegistro,
    onClose
}) => {
    const { produtos: produtosData } = useAppData();
    const [isExporting, setIsExporting] = useState(false);
    const [exportType, setExportType] = useState<'whatsapp' | 'image' | 'pdf' | null>(null);
    const orderRef = useRef<HTMLDivElement>(null);

    // Ordenar produtos alfabeticamente
    const sortedProducts = [...produtos].sort((a, b) => {
        const prodA = produtosData.find(p => p.id === a.produtoId);
        const prodB = produtosData.find(p => p.id === b.produtoId);
        return (prodA?.nome || '').localeCompare(prodB?.nome || '');
    });

    // Calcular totais
    const totalProdutos = produtos.length;
    const totalUnidades = produtos.reduce((sum, p) => sum + p.quantidade, 0);

    // Gerar texto para WhatsApp
    const generateWhatsAppText = (): string => {
        const dateFormatted = dataRegistro.toLocaleDateString('pt-BR');
        const timeFormatted = dataRegistro.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        let text = `*PEDIDO PARA FABRICA - MANA*%0A`;
        text += `================================%0A`;
        text += `*Data:* ${dateFormatted} ${timeFormatted}%0A`;
        text += `*Fornecedor:* ${fornecedor || 'Não informado'}%0A%0A`;
        text += `*PRODUTOS SOLICITADOS:*%0A`;
        text += `================================%0A%0A`;
        
        sortedProducts.forEach(item => {
            const produto = produtosData.find(p => p.id === item.produtoId);
            if (produto) {
                text += `*${produto.nome} ${produto.tamanhoPacote}*%0A`;
                text += `  Quantidade: *${item.quantidade} unidades*%0A%0A`;
            }
        });
        
        text += `================================%0A`;
        text += `*Total:* ${totalProdutos} ${totalProdutos === 1 ? 'produto' : 'produtos'}%0A`;
        text += `*Total Unidades:* ${totalUnidades}%0A`;
        
        return text;
    };

    // Compartilhar via WhatsApp
    const shareViaWhatsApp = () => {
        const text = generateWhatsAppText();
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    };

    // Exportar como imagem
    const exportAsImage = async () => {
        if (!orderRef.current) return;
        
        setIsExporting(true);
        setExportType('image');
        
        try {
            const canvas = await html2canvas(orderRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
            });
            
            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `pedido-fabrica-mana-${Date.now()}.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            });
            
            alert('Imagem salva com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            alert('Erro ao gerar imagem. Tente novamente.');
        } finally {
            setIsExporting(false);
            setExportType(null);
        }
    };

    // Exportar como PDF
    const exportAsPDF = async () => {
        if (!orderRef.current) return;
        
        setIsExporting(true);
        setExportType('pdf');
        
        try {
            const canvas = await html2canvas(orderRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`pedido-fabrica-mana-${Date.now()}.pdf`);
            
            alert('PDF salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        } finally {
            setIsExporting(false);
            setExportType(null);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-xl mr-2 sm:mr-3">
                                <CheckCircle className="text-white" size={24}/>
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white">Pedido Registrado!</h2>
                                <p className="text-white text-opacity-80 text-xs sm:text-sm">Envie para a fábrica</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                            aria-label="Fechar modal"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6">
                    {/* Preview do Pedido */}
                    <div ref={orderRef} className="bg-white p-6">
                        <div className="border-b-4 border-green-600 pb-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-800 text-center">MANÁ</h1>
                            <p className="text-center text-gray-600 mt-2 text-lg font-semibold">
                                PEDIDO PARA FÁBRICA
                            </p>
                            <div className="text-center text-sm text-gray-500 mt-2 space-y-1">
                                <p>
                                    <span className="font-semibold">Data:</span> {dataRegistro.toLocaleDateString('pt-BR')} às {dataRegistro.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p>
                                    <span className="font-semibold">Fornecedor:</span> {fornecedor || 'Não informado'}
                                </p>
                            </div>
                        </div>

                        {/* Lista de Produtos */}
                        <div className="space-y-3 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Produtos Solicitados:</h3>
                            {sortedProducts.map(item => {
                                const produto = produtosData.find(p => p.id === item.produtoId);
                                return (
                                    <div key={item.id} className="border-l-4 border-green-600 pl-4 py-2 bg-gray-50 rounded-r-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{produto?.nome}</h4>
                                                <p className="text-sm text-gray-600">{produto?.tamanhoPacote}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-green-600">{item.quantidade}</p>
                                                <p className="text-xs text-gray-500">unidades</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Totais */}
                        <div className="border-t-2 border-gray-200 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Total de Produtos</p>
                                    <p className="text-2xl font-bold text-green-600">{totalProdutos}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Total de Unidades</p>
                                    <p className="text-2xl font-bold text-green-600">{totalUnidades}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Botões de Exportação */}
                <div className="flex-shrink-0 p-4 sm:p-6 bg-gray-50 rounded-b-2xl border-t-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Enviar para Fábrica:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <button
                            onClick={shareViaWhatsApp}
                            disabled={isExporting}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Enviar via WhatsApp"
                        >
                            <Share2 size={18} />
                            <span>WhatsApp</span>
                        </button>

                        <button
                            onClick={exportAsImage}
                            disabled={isExporting}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Salvar como imagem"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Salvar Imagem</span>
                            <span className="sm:hidden">Imagem</span>
                        </button>

                        <button
                            onClick={exportAsPDF}
                            disabled={isExporting}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Exportar como PDF"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Exportar PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                    </div>

                    {isExporting && (
                        <div className="text-center text-sm text-gray-600 mb-3">
                            <p>Gerando {exportType === 'image' ? 'imagem' : 'PDF'}...</p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
