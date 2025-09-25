import { Produto, Cliente, Pedido, EntradaEstoque, Pagamento, TipoProduto, TamanhoPacote, TipoCliente, CondicaoPagamento, StatusPedido, StatusPagamento, MetodoPagamento, Entregador } from './types';

export const MOCK_PRODUTOS: Produto[] = [
  { id: 'p1', nome: 'Pão de Queijo Tradicional 1kg', tipo: TipoProduto.PAO_DE_QUEIJO, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 25.00, estoqueMinimo: 20, estoqueAtual: 50 },
  { id: 'p2', nome: 'Pão de Queijo Tradicional 5kg', tipo: TipoProduto.PAO_DE_QUEIJO, tamanhoPacote: TamanhoPacote.CINCO_KG, precoPadrao: 110.00, estoqueMinimo: 10, estoqueAtual: 15 },
  { id: 'p3', nome: 'Biscoito de Queijo 1kg', tipo: TipoProduto.BISCOITO_QUEIJO, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 28.00, estoqueMinimo: 15, estoqueAtual: 12 },
  { id: 'p4', nome: 'Biscoito de Queijo 5kg', tipo: TipoProduto.BISCOITO_QUEIJO, tamanhoPacote: TamanhoPacote.CINCO_KG, precoPadrao: 125.00, estoqueMinimo: 8, estoqueAtual: 20 },
  { id: 'p5', nome: 'Biscoito Ferradura 1kg', tipo: TipoProduto.BISCOITO_FERRADURA, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 30.00, estoqueMinimo: 15, estoqueAtual: 30 },
];

export const MOCK_CLIENTES: Cliente[] = [
  { id: 'c1', nome: 'Padaria Pão Quente', tipo: TipoCliente.PADARIA, endereco: 'Rua das Flores, 123', telefone: '(11) 98765-4321', condicaoPagamento: CondicaoPagamento.PROXIMA_ENTREGA },
  { id: 'c2', nome: 'Mercado Central', tipo: TipoCliente.MERCADO, endereco: 'Av. Principal, 456', telefone: '(21) 91234-5678', condicaoPagamento: CondicaoPagamento.A_VISTA },
  { id: 'c3', nome: 'Cafeteria Aconchego', tipo: TipoCliente.VAREJO, endereco: 'Travessa dos Sabores, 789', telefone: '(31) 95555-1234', condicaoPagamento: CondicaoPagamento.PROXIMA_ENTREGA },
];

export const MOCK_ENTREGADORES: Entregador[] = [
  { id: 'ent1', nome: 'João da Silva', telefone: '(11) 91111-1111' },
  { id: 'ent2', nome: 'Carlos Souza', telefone: '(21) 92222-2222' },
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

export const MOCK_PEDIDOS: Pedido[] = [
  {
    id: 'o1',
    clienteId: 'c1',
    data: yesterday,
    itens: [
      { produtoId: 'p1', quantidade: 5, precoUnitario: 25.00 },
      { produtoId: 'p3', quantidade: 3, precoUnitario: 28.00 },
    ],
    valorTotal: 5 * 25.00 + 3 * 28.00,
    status: StatusPedido.ENTREGUE,
    dataVencimentoPagamento: nextWeek,
    statusPagamento: StatusPagamento.PENDENTE,
    entregadorId: 'ent1',
  },
  {
    id: 'o2',
    clienteId: 'c2',
    data: today,
    itens: [
      { produtoId: 'p2', quantidade: 2, precoUnitario: 110.00 },
    ],
    valorTotal: 2 * 110.00,
    status: StatusPedido.ENTREGUE,
    dataVencimentoPagamento: today,
    statusPagamento: StatusPagamento.PAGO,
    entregadorId: 'ent2',
  },
  {
    id: 'o3',
    clienteId: 'c3',
    data: today,
    itens: [
      { produtoId: 'p5', quantidade: 10, precoUnitario: 30.00 },
    ],
    valorTotal: 10 * 30.00,
    status: StatusPedido.PENDENTE,
    dataVencimentoPagamento: tomorrow,
    statusPagamento: StatusPagamento.PENDENTE,
  },
   {
    id: 'o4',
    clienteId: 'c1',
    data: new Date(new Date().setDate(new Date().getDate() - 10)),
    itens: [
      { produtoId: 'p4', quantidade: 1, precoUnitario: 125.00 },
    ],
    valorTotal: 125.00,
    status: StatusPedido.ENTREGUE,
    dataVencimentoPagamento: new Date(new Date().setDate(new Date().getDate() - 3)),
    statusPagamento: StatusPagamento.ATRASADO,
    entregadorId: 'ent1',
  },
];

export const MOCK_ENTRADAS_ESTOQUE: EntradaEstoque[] = [
    { id: 'e1', produtoId: 'p1', quantidade: 30, dataRecebimento: new Date(), fornecedor: 'Fábrica Matriz' },
    { id: 'e2', produtoId: 'p3', quantidade: 20, dataRecebimento: yesterday, fornecedor: 'Fábrica Matriz' },
];

export const MOCK_PAGAMENTOS: Pagamento[] = [
    { id: 'pay1', pedidoId: 'o2', valor: 220.00, data: today, metodo: MetodoPagamento.PIX }
];