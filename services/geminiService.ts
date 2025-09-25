
import { GoogleGenAI, Type } from "@google/genai";
import { Pedido, Produto, Cliente } from '../types';
import jsPDF from 'jspdf';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Chave de API do Gemini não encontrada. As funcionalidades de IA estarão desabilitadas.");
}

export const generateSalesSummary = async (pedidos: Pedido[], produtos: Produto[], clientes: Cliente[]): Promise<string> => {
    if (!ai) {
        return Promise.resolve("A funcionalidade de IA está desabilitada. Configure a chave de API do Gemini nas variáveis de ambiente do seu projeto.");
    }

    const promptData = pedidos.map(pedido => {
        const cliente = clientes.find(c => c.id === pedido.clienteId);
        const itens = pedido.itens.map(item => {
            const produto = produtos.find(p => p.id === item.produtoId);
            return `${item.quantidade}x ${produto?.nome || 'Produto desconhecido'}`;
        }).join(', ');
        return `Pedido ${pedido.id} para ${cliente?.nome || 'Cliente desconhecido'}: ${itens}. Valor: R$${pedido.valorTotal.toFixed(2)}, Status: ${pedido.status}, Pagamento: ${pedido.statusPagamento}.`;
    }).join('\n');
    
    const fullPrompt = `
      Você é um assistente de gestão para um negócio de pães de queijo congelados.
      Analise os seguintes dados de vendas e crie um resumo conciso e perspicaz em português do Brasil.
      Destaque o faturamento total, o número de pedidos, o produto mais vendido e quaisquer pagamentos pendentes ou atrasados.
      Seja direto e use uma linguagem de negócios. Formate a saída em markdown.

      Dados de Vendas:
      ${promptData}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 } 
            }
        });
        return response.text;
    } catch (error) {
        console.error("Erro ao chamar a API Gemini:", error);
        return "Ocorreu um erro ao gerar o resumo de vendas. Por favor, tente novamente.";
    }
};

/**
 * Simula o upload de um arquivo PDF para o Google Drive.
 * Em uma aplicação real, isso envolveria a API do Google Drive e OAuth2.
 * @param pdf A instância do jsPDF a ser carregada.
 * @param fileName O nome do arquivo a ser salvo no Drive.
 * @returns Uma promessa que resolve com um objeto de sucesso ou rejeita com um erro.
 */
export const uploadPdfToDrive = (pdf: jsPDF, fileName: string): Promise<{ success: boolean; fileId: string }> => {
  console.log(`Iniciando simulação de upload para o Google Drive: ${fileName}`);

  // Simula a geração do Blob do PDF
  const pdfBlob = pdf.output('blob');
  console.log('Blob do PDF gerado:', pdfBlob);

  return new Promise((resolve, reject) => {
    // Simula o tempo de upload da rede
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% de chance de sucesso

      if (isSuccess) {
        const mockFileId = `drive_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        console.log(`Upload simulado para o Google Drive bem-sucedido. File ID: ${mockFileId}`);
        resolve({ success: true, fileId: mockFileId });
      } else {
        console.error('Falha na simulação de upload para o Google Drive.');
        reject(new Error('Não foi possível conectar ao serviço do Google Drive.'));
      }
    }, 2000); // Simula 2 segundos de upload
  });
};