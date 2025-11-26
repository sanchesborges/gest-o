import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { FileText, Download, Share2, Calendar, Package, TrendingUp, Filter, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type ReportType = 'weekly-orders' | 'products-summary' | 'factory-orders' | 'customer-history' | 'paid-notes' | 'pending-notes';
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
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [ignorePeriod, setIgnorePeriod] = useState<boolean>(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const handleOpenClientNotes = (clientId: string, clientName: string, notes: any[]) => {
        const qs = new URLSearchParams();
        qs.set('start', startDate);
        qs.set('end', endDate);
        if (ignorePeriod) qs.set('ignore', '1');
        navigate(`/relatorios/cliente/${clientId}/notas-pagas?${qs.toString()}`);
    };

    // Filtrar pedidos por período
    const filteredPedidos = pedidos.filter(p => {
        const pedidoDate = new Date(p.data);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const inRange = pedidoDate >= start && pedidoDate <= end;
        if (reportType === 'customer-history') {
            if (!selectedClientId) return false;
            if (ignorePeriod) return p.clienteId === selectedClientId;
            return inRange && p.clienteId === selectedClientId;
        }
        if (reportType === 'paid-notes') {
            return (ignorePeriod || inRange) && p.statusPagamento === 'Pago';
        }
        if (reportType === 'pending-notes') {
            return (ignorePeriod || inRange) && p.statusPagamento !== 'Pago';
        }
        return inRange;
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
        } else if (reportType === 'factory-orders') {
            let text = `*PEDIDOS PARA FABRICA - MANA*%0A`;
            text += `================================%0A`;
            const periodText = ignorePeriod ? 'Todos' : `${startFormatted} a ${endFormatted}`;
            text += `*Periodo:* ${periodText}%0A%0A`;
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
        } else if (reportType === 'paid-notes' || reportType === 'pending-notes') {
            const isPaid = reportType === 'paid-notes';
            const title = isPaid ? '*NOTAS PAGAS POR CLIENTE - MANA*%0A' : '*NOTAS PENDENTES POR CLIENTE - MANA*%0A';
            let text = title;
            text += `================================%0A`;
            text += `*Periodo:* ${startFormatted} a ${endFormatted}%0A%0A`;
            const relevant = filteredPedidos.filter(p => isPaid ? p.statusPagamento === 'Pago' : p.statusPagamento !== 'Pago');
            const groups: Record<string, { nome: string; total: number; pedidos: any[] }> = {};
            relevant.forEach(p => {
                const c = clientes.find(cc => cc.id === p.clienteId);
                const key = p.clienteId || 'N/A';
                if (!groups[key]) groups[key] = { nome: c?.nome || 'N/A', total: 0, pedidos: [] };
                groups[key].pedidos.push(p);
                groups[key].total += isPaid ? (p.valorPago ?? p.valorTotal) : p.valorTotal;
            });
            const ordered = Object.values(groups).sort((a, b) => b.total - a.total);
            ordered.forEach(g => {
                text += `*${g.nome}*%0A`;
                text += `  Total: R$ ${g.total.toFixed(2)} (${g.pedidos.length} notas)%0A`;
                g.pedidos.sort((a, b) => b.data.getTime() - a.data.getTime()).forEach(p => {
                    text += `    - ${p.data.toLocaleDateString('pt-BR')} • R$ ${p.valorTotal.toFixed(2)} • ${p.statusPagamento}%0A`;
                });
                text += `%0A`;
            });
            return text;
        } else {
            const cliente = clientes.find(c => c.id === selectedClientId);
            let text = `*RELATORIO POR CLIENTE - MANA*%0A`;
            text += `================================%0A`;
            text += `*Cliente:* ${cliente?.nome || 'N/A'}%0A`;
            text += `*Periodo:* ${startFormatted} a ${endFormatted}%0A%0A`;
            text += `*Total de Pedidos:* ${totalPedidos}%0A`;
            text += `*Valor Total:* R$ ${valorTotalPedidos.toFixed(2)}%0A%0A`;
            const entregues = filteredPedidos.filter(p => p.status === 'Entregue');
            const pendentes = filteredPedidos.filter(p => p.status === 'Pendente');
            const valorEntregue = entregues.reduce((sum, p) => sum + p.valorTotal, 0);
            const valorPendente = pendentes.reduce((sum, p) => sum + p.valorTotal, 0);
            text += `*Entregues:* ${entregues.length} pedidos (R$ ${valorEntregue.toFixed(2)})%0A`;
            text += `*Pendentes:* ${pendentes.length} pedidos (R$ ${valorPendente.toFixed(2)})%0A%0A`;
            const now = new Date();
            const pagos = filteredPedidos.filter(p => p.statusPagamento === 'Pago');
            const pagosValor = pagos.reduce((sum, p) => sum + (p.valorPago ?? p.valorTotal), 0);
            const atrasados = filteredPedidos.filter(p => p.statusPagamento !== 'Pago' && p.dataVencimentoPagamento.getTime() < now.getTime());
            const pendPag = filteredPedidos.filter(p => p.statusPagamento !== 'Pago' && p.dataVencimentoPagamento.getTime() >= now.getTime());
            const pendPagValor = pendPag.reduce((sum, p) => sum + p.valorTotal, 0);
            const atrasadosValor = atrasados.reduce((sum, p) => sum + p.valorTotal, 0);
            text += `*Pagos:* ${pagos.length} pedidos (R$ ${pagosValor.toFixed(2)})%0A`;
            text += `*Pagamento Pendente:* ${pendPag.length} pedidos (R$ ${pendPagValor.toFixed(2)})%0A`;
            text += `*Atrasados:* ${atrasados.length} pedidos (R$ ${atrasadosValor.toFixed(2)})%0A%0A`;
            text += `*HISTORICO:*%0A`;
            text += `================================%0A%0A`;

            filteredPedidos
                .sort((a, b) => b.data.getTime() - a.data.getTime())
                .forEach(pedido => {
                    text += `*${pedido.data.toLocaleDateString('pt-BR')}*%0A`;
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
                        <option value="customer-history">Relatório por Cliente</option>
                        <option value="paid-notes">Notas Pagas por Cliente</option>
                        <option value="pending-notes">Notas Pendentes por Cliente</option>
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
                            disabled={(reportType === 'customer-history' || reportType === 'paid-notes' || reportType === 'pending-notes') && ignorePeriod}
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
                            disabled={(reportType === 'customer-history' || reportType === 'paid-notes' || reportType === 'pending-notes') && ignorePeriod}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                {reportType === 'customer-history' && (
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                        <select
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Selecione um cliente</option>
                            {clientes.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                        <div className="mt-3">
                            <label className="inline-flex items-center text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={ignorePeriod}
                                    onChange={(e) => setIgnorePeriod(e.target.checked)}
                                    className="mr-2"
                                />
                                Ignorar período (mostrar todo histórico)
                            </label>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={() => setIgnorePeriod(true)}
                                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700"
                                >
                                    Todos os pedidos do cliente
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {(reportType === 'paid-notes' || reportType === 'pending-notes') && (
                    <div className="md:col-span-3">
                        <div className="mt-1">
                            <label className="inline-flex items-center text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={ignorePeriod}
                                    onChange={(e) => setIgnorePeriod(e.target.checked)}
                                    className="mr-2"
                                />
                                Ignorar período (mostrar todo histórico)
                            </label>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    onClick={() => setIgnorePeriod(true)}
                                    className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700"
                                >
                                    Ver histórico completo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
                        {reportType === 'customer-history' ? 'Salvar Imagem do Cliente' : 'Salvar Imagem'}
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
                         reportType === 'factory-orders' ? 'Pedidos para Fábrica' : 
                         reportType === 'paid-notes' ? 'Notas Pagas por Cliente' : 
                         reportType === 'pending-notes' ? 'Notas Pendentes por Cliente' : 'Relatório por Cliente'}
                    </p>
                    <p className="text-center text-sm text-gray-500 mt-1">
                        {(reportType === 'customer-history' || reportType === 'paid-notes' || reportType === 'pending-notes') && ignorePeriod
                            ? 'Período: Todos'
                            : `Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`}
                    </p>
                    {(reportType === 'customer-history' || reportType === 'paid-notes' || reportType === 'pending-notes') && ignorePeriod && (
                        <p className="text-center text-xs font-semibold text-indigo-700 mt-1">Histórico completo</p>
                    )}
                    {reportType === 'customer-history' && selectedClientId && (
                        <p className="text-center text-sm text-gray-700 mt-1">Cliente: {clientes.find(c => c.id === selectedClientId)?.nome || 'N/A'}</p>
                    )}
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
                ) : reportType === 'factory-orders' ? (
                    <FactoryOrdersReport
                        entradasGrouped={entradasGrouped}
                        totalEntradas={totalEntradas}
                        totalUnidades={totalUnidadesEntradas}
                    />
                ) : reportType === 'paid-notes' ? (
                    <PaidNotesReport pedidos={filteredPedidos} clientes={clientes} onOpenClient={handleOpenClientNotes} />
                ) : reportType === 'pending-notes' ? (
                    <PendingNotesReport pedidos={filteredPedidos} clientes={clientes} />
                ) : (
                    <CustomerHistoryReport
                        pedidos={filteredPedidos}
                        produtos={produtos}
                        totalPedidos={totalPedidos}
                        valorTotal={valorTotalPedidos}
                        cliente={clientes.find(c => c.id === selectedClientId)}
                        selectedClientId={selectedClientId}
                    />
                )}
            </div>
        </div>
    );
};

const CustomerHistoryReport: React.FC<{
    pedidos: any[];
    produtos: any[];
    totalPedidos: number;
    valorTotal: number;
    cliente: any;
    selectedClientId: string;
}> = ({ pedidos, produtos, totalPedidos, valorTotal, cliente, selectedClientId }) => {
    const sortedPedidos = [...pedidos].sort((a, b) => b.data.getTime() - a.data.getTime());
    const entregues = pedidos.filter(p => p.status === 'Entregue');
    const pendentes = pedidos.filter(p => p.status === 'Pendente');
    const valorEntregue = entregues.reduce((sum, p) => sum + p.valorTotal, 0);
    const valorPendente = pendentes.reduce((sum, p) => sum + p.valorTotal, 0);

    const now = new Date();
    const pagos = pedidos.filter(p => p.statusPagamento === 'Pago');
    const atrasados = pedidos.filter(p => p.statusPagamento !== 'Pago' && p.dataVencimentoPagamento.getTime() < now.getTime());
    const pendPag = pedidos.filter(p => p.statusPagamento !== 'Pago' && p.dataVencimentoPagamento.getTime() >= now.getTime());
    const valorPago = pagos.reduce((sum, p) => sum + (p.valorPago ?? p.valorTotal), 0);
    const valorPendPag = pendPag.reduce((sum, p) => sum + p.valorTotal, 0);
    const valorAtrasado = atrasados.reduce((sum, p) => sum + p.valorTotal, 0);

    const produtosMap: Record<string, { nome: string; quantidade: number }> = {};
    pedidos.forEach(p => {
        p.itens.forEach((item: any) => {
            const prod = produtos.find(pp => pp.id === item.produtoId);
            if (prod) {
                if (!produtosMap[prod.id]) {
                    produtosMap[prod.id] = { nome: prod.nome, quantidade: 0 };
                }
                produtosMap[prod.id].quantidade += item.quantidade;
            }
        });
    });
    const produtosCliente = Object.values(produtosMap).sort((a, b) => b.quantidade - a.quantidade);
    const maxProdQtd = produtosCliente.length > 0 ? Math.max(...produtosCliente.map(p => p.quantidade)) : 0;

    const pedidosPorDiaMap: Record<string, number> = {};
    pedidos.forEach(p => {
        const key = p.data.toLocaleDateString('pt-BR');
        pedidosPorDiaMap[key] = (pedidosPorDiaMap[key] || 0) + 1;
    });
    const pedidosPorDia = Object.entries(pedidosPorDiaMap)
        .sort((a, b) => {
            const [da] = a;
            const [db] = b;
            const pa = da.split('/');
            const pb = db.split('/');
            const ta = new Date(parseInt(pa[2], 10), parseInt(pa[1], 10) - 1, parseInt(pa[0], 10)).getTime();
            const tb = new Date(parseInt(pb[2], 10), parseInt(pb[1], 10) - 1, parseInt(pb[0], 10)).getTime();
            return tb - ta;
        });
    const maxDiaQtd = pedidosPorDia.length > 0 ? Math.max(...pedidosPorDia.map(([, qtd]) => qtd)) : 0;
    return (
        <div className="space-y-6">
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
            <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Entregues</p>
                    <p className="text-xl font-bold text-emerald-600">{entregues.length} pedidos</p>
                    <p className="text-sm font-semibold text-emerald-700">R$ {valorEntregue.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                    <p className="text-xl font-bold text-yellow-600">{pendentes.length} pedidos</p>
                    <p className="text-sm font-semibold text-yellow-700">R$ {valorPendente.toFixed(2)}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pagos</p>
                    <p className="text-xl font-bold text-blue-600">{pagos.length} pedidos</p>
                    <p className="text-sm font-semibold text-blue-700">R$ {valorPago.toFixed(2)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Pagamento Pendente</p>
                    <p className="text-xl font-bold text-orange-600">{pendPag.length} pedidos</p>
                    <p className="text-sm font-semibold text-orange-700">R$ {valorPendPag.toFixed(2)}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Atrasados</p>
                    <p className="text-xl font-bold text-rose-600">{atrasados.length} pedidos</p>
                    <p className="text-sm font-semibold text-rose-700">R$ {valorAtrasado.toFixed(2)}</p>
                </div>
            </div>
            {!selectedClientId || !cliente ? (
                <p className="text-center text-gray-500 py-8">Selecione um cliente para visualizar o histórico.</p>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de {cliente.nome}</h3>
                    {sortedPedidos.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Nenhum pedido encontrado no período selecionado.</p>
                    ) : (
                        sortedPedidos.map(pedido => (
                            <div key={pedido.id} className="border-l-4 border-indigo-600 pl-4 py-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{cliente.nome}</h4>
                                        <p className="text-sm text-gray-600">{pedido.data.toLocaleDateString('pt-BR')} • Status: {pedido.status}</p>
                                    </div>
                                    <p className="font-bold text-gray-800">R$ {pedido.valorTotal.toFixed(2)}</p>
                                </div>
                                <div className="ml-4 space-y-1">
                                    {pedido.itens.map((item: any, idx: number) => {
                                        const produto = produtos.find(p => p.id === item.produtoId);
                                        return (
                                            <p key={idx} className="text-sm text-gray-600">• {item.quantidade}x {produto?.nome || 'N/A'}</p>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                    <div className="mt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><TrendingUp size={20} className="mr-2" />Distribuição por Produto do Cliente</h4>
                        {produtosCliente.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Sem itens no período.</p>
                        ) : (
                            <div className="space-y-2">
                                {produtosCliente.map((item, idx) => {
                                    const percentage = maxProdQtd > 0 ? (item.quantidade / maxProdQtd) * 100 : 0;
                                    return (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{item.nome}</span>
                                                <span className="font-semibold text-gray-800">{item.quantidade}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="mt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><TrendingUp size={20} className="mr-2" />Pedidos por Dia</h4>
                        {pedidosPorDia.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Sem pedidos no período.</p>
                        ) : (
                            <div className="space-y-2">
                                {pedidosPorDia.map(([dia, qtd], idx) => {
                                    const percentage = maxDiaQtd > 0 ? (qtd / maxDiaQtd) * 100 : 0;
                                    return (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{dia}</span>
                                                <span className="font-semibold text-gray-800">{qtd}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
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

const GroupedNotesByClient: React.FC<{
    pedidos: any[];
    clientes: any[];
    title: string;
    onOpen: (clientId: string, clienteNome: string, pedidos: any[]) => void;
}> = ({ pedidos, clientes, title, onOpen }) => {
    const groups: Record<string, { clienteId: string; clienteNome: string; pedidos: any[]; total: number }> = {};
    pedidos.forEach(p => {
        const c = clientes.find(cc => cc.id === p.clienteId);
        const key = p.clienteId || 'N/A';
        if (!groups[key]) {
            groups[key] = { clienteId: key, clienteNome: c?.nome || 'N/A', pedidos: [], total: 0 };
        }
        groups[key].pedidos.push(p);
        groups[key].total += p.statusPagamento === 'Pago' ? (p.valorPago ?? p.valorTotal) : p.valorTotal;
    });
    const ordered = Object.values(groups).sort((a, b) => b.total - a.total);
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Clientes</p>
                    <p className="text-2xl font-bold text-indigo-600">{ordered.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-green-600">R$ {ordered.reduce((s, g) => s + g.total, 0).toFixed(2)}</p>
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            {ordered.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhuma nota encontrada no período.</p>
            ) : (
                ordered.map(g => (
                    <div key={g.clienteId} className="border-l-4 border-indigo-600 pl-4 py-2">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h4 className="font-bold text-gray-800">{g.clienteNome}</h4>
                                <p className="text-sm text-gray-600">{g.pedidos.length} notas</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="font-bold text-gray-800">R$ {g.total.toFixed(2)}</p>
                                <button
                                    onClick={() => onOpen(g.clienteId, g.clienteNome, g.pedidos)}
                                    className="bg-indigo-600 text-white text-sm font-semibold py-2 px-3 rounded-lg hover:bg-indigo-700"
                                >
                                    Ver notas
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const PaidNotesReport: React.FC<{ pedidos: any[]; clientes: any[]; onOpenClient: (clientId: string, clienteNome: string, pedidos: any[]) => void }> = ({ pedidos, clientes, onOpenClient }) => (
    <GroupedNotesByClient pedidos={pedidos} clientes={clientes} title="Notas Pagas por Cliente" onOpen={onOpenClient} />
);

const PendingNotesReport: React.FC<{ pedidos: any[]; clientes: any[] }> = ({ pedidos, clientes }) => (
    <GroupedNotesByClient pedidos={pedidos} clientes={clientes} title="Notas Pendentes por Cliente" />
);
