import React, { useState, useRef } from 'react';
import { useAppData } from '../hooks/useAppData';
import { FileText, Download, Share2, Calendar, Package, TrendingUp, Filter } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type ReportType = 'weekly-orders' | 'products-summary' | 'factory-orders';
type ExportFormat = 'whatsapp-text' | 'whatsapp-image' | 'pdf';

export const Reports: React.FC = () => {
    const { pedidos, produtos, clientes, entradasEstoque } = useAppData();
    const [reportType, setReportType] = useState<ReportType>('weekly-orders');
    const [startDate, setStartDate] = useState<string>(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const reportRef = useRef<HTMLDivElement>(null);

    // Filtrar pedidos por período
    const filteredPedidos = pedidos.filter(p => {
        const pedidoDate = new Date(p.data);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return pedidoDate >= start && pedidoDate <= end;
    });

    // Calcular totais
    const totalPedidos = filteredPedidos.length;
    const valorTotalPedidos = filteredPedidos.reduce((sum, p) => sum + p.valorTotal, 0);

    // Agrupar produtos por pedido
    const produtosSummary = filteredPedidos.reduce((acc, pedido) => {
        pedido.itens.forEach(item => {
            const produto = produtos.find(p => p.id === item.produtoId);
            if (produto) {
                if (!acc[produto.id]) {
                    acc[produto.id] = {
                        nome: produto.nome,
                        quantidade: 0,
                        valorTotal: 0
                    };
                }
                acc[produto.id].quantidade += item.quantidade;
                acc[produto.id].valorTotal += item.quantidade * item.precoUnitario;
            }
        });
        return acc;
    }, {} as Record<string, { nome: string; quantidade: number; valorTotal: number }>);

    // Filtrar entradas de estoque por período
    const filteredEntradas = entradasEstoque.filter(e => {
        const entradaDate = new Date(e.dataRecebimento);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return entradaDate >= start && entradaDate <= end;
    });

    // Agrupar entradas por data e fornecedor
    const entradasGrouped = filteredEntradas.reduce((acc, entrada) => {
        const dateKey = entrada.dataRecebimento.toLocaleDateString('pt-BR');
        const timeKey = entrada.dataRecebimento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const key = `${dateKey} ${timeKey} - ${entrada.fornecedor}`;
        
        if (!acc[key]) {
            acc[key] = {
                data: entrada.dataRecebimento,
                fornecedor: entrada.fornecedor,
                produtos: []
            };
        }
        
        const produto = produtos.find(p => p.id === entrada.produtoId);
        if (produto) {
            acc[key].produtos.push({
                nome: produto.nome,
                tamanhoPacote: produto.tamanhoPacote,
                quantidade: entrada.quantidade
            });
        }
        
        return acc;
    }, {} as Record<string, { data: Date; fornecedor: string; produtos: Array<{ nome: string; tamanhoPacote: string; quantidade: number }> }>);

    const totalEntradas = Object.keys(entradasGrouped).length;
    const totalUnidadesEntradas = filteredEntradas.reduce((sum, e) => sum + e.quantidade, 0);

    // Gerar texto Markdown para WhatsApp
    const generateMarkdownText = (): string => {
        const startFormatted = new Date(startDate).toLocaleDateString('pt-BR');
        const endFormatted = new Date(endDate).toLocaleDateString('pt-BR');

        if (reportType === 'weekly-orders') {
            let text = `*RELATORIO DE PEDIDOS - MANA*%0A`;
            text += `================================%0A`;
            text += `*Periodo:* ${startFormatted} a ${endFormatted}%0A%0A`;
            text += `*Total de Pedidos:* ${totalPedidos}%0A`;
            text += `*Valor Total:* R$ ${valorTotalPedidos.toFixed(2)}%0A%0A`;
            text += `*DETALHAMENTO POR CLIENTE:*%0A`;
            text += `================================%0A%0A`;

            filteredPedidos.forEach(pedido => {
                const cliente = clientes.find(c => c.id === pedido.clienteId);
                text += `*${cliente?.nome || 'N/A'}*%0A`;
                text += `  Data: ${pedido.data.toLocaleDateString('pt-BR')}%0A`;
                text += `  Valor: R$ ${pedido.valorTotal.toFixed(2)}%0A`;
                text += `  Status: ${pedido.status}%0A`;
                text += `  *Itens:*%0A`;
                pedido.itens.forEach(item => {
                    const produto = produtos.find(p => p.id === item.produtoId);
                    text += `    - ${item.quantidade}x ${produto?.nome || 'N/A'}%0A`;
                });
                text += `%0A`;
            });

            return text;
        } else if (reportType === 'products-summary') {
            let text = `*RELATORIO DE PRODUTOS - MANA*%0A`;
            text += `================================%0A`;
            text += `*Periodo:* ${startFormatted} a ${endFormatted}%0A%0A`;
            text += `*RESUMO DE PRODUTOS PARA PRODUCAO:*%0A`;
            text += `================================%0A%0A`;

            Object.values(produtosSummary)
                .sort((a, b) => b.quantidade - a.quantidade)
                .forEach(item => {
                    text += `*${item.nome}*%0A`;
                    text += `  Quantidade: *${item.quantidade} unidades*%0A`;
                    text += `  Valor Total: R$ ${item.valorTotal.toFixed(2)}%0A%0A`;
                });

            text += `================================%0A`;
            text += `*VALOR TOTAL:* R$ ${valorTotalPedidos.toFixed(2)}%0A`;

            return text;
        } else {
            // factory-orders
            let text = `*PEDIDOS PARA FABRICA - MANA*%0A`;
            text += `================================%0A`;
            text += `*Periodo:* ${startFormatted} a ${endFormatted}%0A%0A`;
            text += `*Total de Pedidos:* ${totalEntradas}%0A`;
            text += `*Total de Unidades:* ${totalUnidadesEntradas}%0A%0A`;
            text += `*HISTORICO DE PEDIDOS:*%0A`;
            text += `================================%0A%0A`;

            Object.entries(entradasGrouped)
                .sort(([, a], [, b]) => b.data.getTime() - a.data.getTime())
                .forEach(([key, entrada]) => {
                    const dateFormatted = entrada.data.toLocaleDateString('pt-BR');
                    const timeFormatted = entrada.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    
                    text += `*${dateFormatted} ${timeFormatted}*%0A`;
                    text += `Fornecedor: ${entrada.fornecedor}%0A`;
                    text += `*Produtos:*%0A`;
                    entrada.produtos.forEach(prod => {
                        text += `  - ${prod.quantidade}x ${prod.nome} ${prod.tamanhoPacote}%0A`;
                    });
                    text += `%0A`;
                });

            return text;
        }
    };

    // Exportar como imagem para WhatsApp
    const exportAsImage = async () => {
        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `relatorio-mana-${reportType}-${new Date().getTime()}.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            });
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            alert('Erro ao gerar imagem. Tente novamente.');
        }
    };

    // Exportar como PDF
    const exportAsPDF = async () => {
        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, {
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
            pdf.save(`relatorio-mana-${reportType}-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar PDF. Tente novamente.');
        }
    };

    // Compartilhar via WhatsApp (texto)
    const shareViaWhatsApp = () => {
        const text = generateMarkdownText();
        // O texto já vem com %0A para quebras de linha, não precisa de encodeURIComponent adicional
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    };

    // Handler para exportação
    const handleExport = async (format: ExportFormat) => {
        switch (format) {
            case 'whatsapp-text':
                shareViaWhatsApp();
                break;
            case 'whatsapp-image':
                await exportAsImage();
                alert('Imagem salva! Agora você pode compartilhar via WhatsApp.');
                break;
            case 'pdf':
                await exportAsPDF();
                break;
        }
    };

    return (
        <div className="space-y-6 p-6 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FileText className="mr-3" size={32} />
                    Relatórios
                </h2>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex items-center mb-2">
                    <Filter size={18} className="text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-700">Configurações do Relatório</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Relatório
                        </label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value as ReportType)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="weekly-orders">Pedidos do Período</option>
                            <option value="products-summary">Resumo de Produtos</option>
                            <option value="factory-orders">Pedidos para Fábrica</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar size={16} className="inline mr-1" />
                            Data Início
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar size={16} className="inline mr-1" />
                            Data Fim
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Botões de Exportação */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <Share2 size={18} className="text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-700">Exportar e Compartilhar</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        onClick={() => handleExport('whatsapp-text')}
                        className="bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                        <Share2 size={18} className="mr-2" />
                        WhatsApp (Texto)
                    </button>

                    <button
                        onClick={() => handleExport('whatsapp-image')}
                        className="bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                        <Download size={18} className="mr-2" />
                        Salvar Imagem
                    </button>

                    <button
                        onClick={() => handleExport('pdf')}
                        className="bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                        <Download size={18} className="mr-2" />
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* Preview do Relatório */}
            <div ref={reportRef} className="bg-white p-8 rounded-lg shadow-lg">
                <div className="border-b-4 border-indigo-600 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">MANÁ</h1>
                    <p className="text-center text-gray-600 mt-2">
                        {reportType === 'weekly-orders' ? 'Relatório de Pedidos' : 
                         reportType === 'products-summary' ? 'Relatório de Produtos' : 
                         'Pedidos para Fábrica'}
                    </p>
                    <p className="text-center text-sm text-gray-500 mt-1">
                        Período: {new Date(startDate).toLocaleDateString('pt-BR')} a {new Date(endDate).toLocaleDateString('pt-BR')}
                    </p>
                </div>

                {reportType === 'weekly-orders' ? (
                    <WeeklyOrdersReport
                        pedidos={filteredPedidos}
                        clientes={clientes}
                        produtos={produtos}
                        totalPedidos={totalPedidos}
                        valorTotal={valorTotalPedidos}
                    />
                ) : reportType === 'products-summary' ? (
                    <ProductsSummaryReport
                        produtosSummary={produtosSummary}
                        valorTotal={valorTotalPedidos}
                    />
                ) : (
                    <FactoryOrdersReport
                        entradasGrouped={entradasGrouped}
                        totalEntradas={totalEntradas}
                        totalUnidades={totalUnidadesEntradas}
                    />
                )}
            </div>
        </div>
    );
};

// Componente para Relatório de Pedidos
const WeeklyOrdersReport: React.FC<{
    pedidos: any[];
    clientes: any[];
    produtos: any[];
    totalPedidos: number;
    valorTotal: number;
}> = ({ pedidos, clientes, produtos, totalPedidos, valorTotal }) => {
    return (
        <div className="space-y-6">
            {/* Resumo */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total de Pedidos</p>
                    <p className="text-2xl font-bold text-indigo-600">{totalPedidos}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                    <p className="text-2xl font-bold text-green-600">R$ {valorTotal.toFixed(2)}</p>
                </div>
            </div>

            {/* Lista de Pedidos */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhamento por Cliente</h3>
                {pedidos.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum pedido encontrado no período selecionado.</p>
                ) : (
                    pedidos.map(pedido => {
                        const cliente = clientes.find(c => c.id === pedido.clienteId);
                        return (
                            <div key={pedido.id} className="border-l-4 border-indigo-600 pl-4 py-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{cliente?.nome || 'N/A'}</h4>
                                        <p className="text-sm text-gray-600">
                                            {pedido.data.toLocaleDateString('pt-BR')} • Status: {pedido.status}
                                        </p>
                                    </div>
                                    <p className="font-bold text-gray-800">R$ {pedido.valorTotal.toFixed(2)}</p>
                                </div>
                                <div className="ml-4 space-y-1">
                                    {pedido.itens.map((item: any, idx: number) => {
                                        const produto = produtos.find(p => p.id === item.produtoId);
                                        return (
                                            <p key={idx} className="text-sm text-gray-600">
                                                • {item.quantidade}x {produto?.nome || 'N/A'}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// Componente para Relatório de Produtos
const ProductsSummaryReport: React.FC<{
    produtosSummary: Record<string, { nome: string; quantidade: number; valorTotal: number }>;
    valorTotal: number;
}> = ({ produtosSummary, valorTotal }) => {
    const sortedProducts = Object.values(produtosSummary).sort((a, b) => b.quantidade - a.quantidade);

    return (
        <div className="space-y-6">
            {/* Resumo */}
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-1">Valor Total de Produção</p>
                <p className="text-2xl font-bold text-indigo-600">R$ {valorTotal.toFixed(2)}</p>
            </div>

            {/* Lista de Produtos */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Package size={24} className="mr-2" />
                    Produtos para Produção
                </h3>
                {sortedProducts.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum produto encontrado no período selecionado.</p>
                ) : (
                    <div className="space-y-3">
                        {sortedProducts.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b pb-3">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800">{item.nome}</h4>
                                    <p className="text-sm text-gray-600">
                                        Quantidade: <span className="font-semibold">{item.quantidade} unidades</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">R$ {item.valorTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Gráfico Visual Simples */}
            <div className="mt-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <TrendingUp size={20} className="mr-2" />
                    Distribuição por Produto
                </h4>
                <div className="space-y-2">
                    {sortedProducts.map((item, idx) => {
                        const maxQtd = Math.max(...sortedProducts.map(p => p.quantidade));
                        const percentage = (item.quantidade / maxQtd) * 100;
                        return (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">{item.nome}</span>
                                    <span className="font-semibold text-gray-800">{item.quantidade}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Componente para Relatório de Pedidos para Fábrica
const FactoryOrdersReport: React.FC<{
    entradasGrouped: Record<string, { data: Date; fornecedor: string; produtos: Array<{ nome: string; tamanhoPacote: string; quantidade: number }> }>;
    totalEntradas: number;
    totalUnidades: number;
}> = ({ entradasGrouped, totalEntradas, totalUnidades }) => {
    const sortedEntradas = Object.entries(entradasGrouped).sort(([, a], [, b]) => b.data.getTime() - a.data.getTime());

    // Função para gerar texto WhatsApp de um pedido específico
    const generateSingleOrderWhatsAppText = (entrada: { data: Date; fornecedor: string; produtos: Array<{ nome: string; tamanhoPacote: string; quantidade: number }> }): string => {
        const dateFormatted = entrada.data.toLocaleDateString('pt-BR');
        const timeFormatted = entrada.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const totalUnidades = entrada.produtos.reduce((sum, p) => sum + p.quantidade, 0);

        let text = `*PEDIDO PARA FABRICA - MANA*%0A`;
        text += `================================%0A`;
        text += `*Data:* ${dateFormatted} ${timeFormatted}%0A`;
        text += `*Fornecedor:* ${entrada.fornecedor || 'Não informado'}%0A%0A`;
        text += `*PRODUTOS SOLICITADOS:*%0A`;
        text += `================================%0A%0A`;

        entrada.produtos.forEach(prod => {
            text += `*${prod.nome} ${prod.tamanhoPacote}*%0A`;
            text += `  Quantidade: *${prod.quantidade} unidades*%0A%0A`;
        });

        text += `================================%0A`;
        text += `*Total:* ${entrada.produtos.length} ${entrada.produtos.length === 1 ? 'produto' : 'produtos'}%0A`;
        text += `*Total Unidades:* ${totalUnidades}%0A`;

        return text;
    };

    // Função para compartilhar pedido via WhatsApp
    const shareOrderViaWhatsApp = (entrada: { data: Date; fornecedor: string; produtos: Array<{ nome: string; tamanhoPacote: string; quantidade: number }> }) => {
        const text = generateSingleOrderWhatsAppText(entrada);
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    };

    // Função para exportar pedido como imagem
    const exportOrderAsImage = async (key: string) => {
        const element = document.getElementById(`order-${key}`);
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `pedido-fabrica-${Date.now()}.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            });
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            alert('Erro ao gerar imagem. Tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Resumo */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total de Pedidos</p>
                    <p className="text-2xl font-bold text-indigo-600">{totalEntradas}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total de Unidades</p>
                    <p className="text-2xl font-bold text-green-600">{totalUnidades}</p>
                </div>
            </div>

            {/* Lista de Pedidos */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Pedidos para Fábrica</h3>
                {sortedEntradas.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum pedido para fábrica encontrado no período selecionado.</p>
                ) : (
                    sortedEntradas.map(([key, entrada]) => {
                        const dateFormatted = entrada.data.toLocaleDateString('pt-BR');
                        const timeFormatted = entrada.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        
                        return (
                            <div key={key} id={`order-${key}`} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">{dateFormatted} {timeFormatted}</h4>
                                        <p className="text-sm text-gray-600">
                                            Fornecedor: {entrada.fornecedor || 'Não informado'}
                                        </p>
                                    </div>
                                    <p className="font-bold text-indigo-600">
                                        {entrada.produtos.reduce((sum, p) => sum + p.quantidade, 0)} unidades
                                    </p>
                                </div>
                                
                                <div className="ml-2 space-y-1 mb-3">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Produtos:</p>
                                    {entrada.produtos.map((prod, idx) => (
                                        <p key={idx} className="text-sm text-gray-600">
                                            • {prod.quantidade}x {prod.nome} {prod.tamanhoPacote}
                                        </p>
                                    ))}
                                </div>

                                {/* Botões de Compartilhamento */}
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => shareOrderViaWhatsApp(entrada)}
                                        className="flex-1 bg-green-500 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                                        title="Compartilhar via WhatsApp"
                                    >
                                        <Share2 size={16} className="mr-1" />
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => exportOrderAsImage(key)}
                                        className="flex-1 bg-blue-500 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                                        title="Salvar como imagem"
                                    >
                                        <Download size={16} className="mr-1" />
                                        Imagem
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
