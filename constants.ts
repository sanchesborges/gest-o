import { Produto, Cliente, Pedido, EntradaEstoque, Pagamento, TipoProduto, TamanhoPacote, TipoCliente, CondicaoPagamento, StatusPedido, StatusPagamento, MetodoPagamento, Entregador } from './types';

export const MOCK_PRODUTOS: Produto[] = [
  { id: 'p1', nome: 'Biscoito Polvilho', tipo: TipoProduto.BISCOITO_POLVILHO, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 16.00, estoqueMinimo: 20, estoqueAtual: 100 },
  { id: 'p2', nome: 'Biscoito Goma', tipo: TipoProduto.BISCOITO_GOMA, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 16.00, estoqueMinimo: 10, estoqueAtual: 50 },
  { id: 'p3', nome: 'Fubá', tipo: TipoProduto.FUBA, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 15.00, estoqueMinimo: 15, estoqueAtual: 80 },
  { id: 'p4', nome: 'Pão de Queijo', tipo: TipoProduto.PAO_DE_QUEIJO, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 15.00, estoqueMinimo: 25, estoqueAtual: 120 },
  { id: 'p5', nome: 'Biscoito Polvilho', tipo: TipoProduto.BISCOITO_POLVILHO, tamanhoPacote: TamanhoPacote.CINCO_KG, precoPadrao: 80.00, estoqueMinimo: 10, estoqueAtual: 40 },
  { id: 'p6', nome: 'Biscoito Goma', tipo: TipoProduto.BISCOITO_GOMA, tamanhoPacote: TamanhoPacote.CINCO_KG, precoPadrao: 80.00, estoqueMinimo: 8, estoqueAtual: 30 },
  { id: 'p7', nome: 'Fubá', tipo: TipoProduto.FUBA, tamanhoPacote: TamanhoPacote.CINCO_KG, precoPadrao: 80.00, estoqueMinimo: 8, estoqueAtual: 25 },
  { id: 'p8', nome: 'Pão de Queijo', tipo: TipoProduto.PAO_DE_QUEIJO, tamanhoPacote: '25g', precoPadrao: 0.50, estoqueMinimo: 100, estoqueAtual: 500 },
  { id: 'p9', nome: 'Pão de Queijo', tipo: TipoProduto.PAO_DE_QUEIJO, tamanhoPacote: '30g', precoPadrao: 0.60, estoqueMinimo: 100, estoqueAtual: 400 },
  { id: 'p10', nome: 'Pão de Queijo', tipo: TipoProduto.PAO_DE_QUEIJO, tamanhoPacote: '40g', precoPadrao: 0.80, estoqueMinimo: 80, estoqueAtual: 300 },
  { id: 'p11', nome: 'Pão de Queijo', tipo: TipoProduto.PAO_DE_QUEIJO, tamanhoPacote: '100g', precoPadrao: 2.00, estoqueMinimo: 50, estoqueAtual: 200 },
  { id: 'p12', nome: 'Rápido', tipo: TipoProduto.RAPIDO, tamanhoPacote: TamanhoPacote.UM_KG, precoPadrao: 14.00, estoqueMinimo: 15, estoqueAtual: 60 },
];

export const MOCK_CLIENTES: Cliente[] = [
  { id: 'c1', nome: 'MADÁ', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c2', nome: 'LUCAS', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c3', nome: 'D.LUCIA', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c4', nome: 'FLAM SER', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c5', nome: 'FLAM BEL', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c6', nome: 'FLAM MAT', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c7', nome: 'SUP BAHIA', tipo: TipoCliente.MERCADO, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c8', nome: 'CAFE MIX', tipo: TipoCliente.RESTAURANTE, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c9', nome: 'IDEAL', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c10', nome: 'RENER', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c11', nome: 'SANDUBS', tipo: TipoCliente.RESTAURANTE, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c12', nome: 'TRADIÇÃO', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c13', nome: 'VOU LÁ', tipo: TipoCliente.PADARIA, endereco: 'A definir', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.SETE_DIAS },
  { id: 'c14', nome: 'AVULSOS', tipo: TipoCliente.OUTROS, endereco: 'Vendas avulsas', telefone: '(00) 00000-0000', condicaoPagamento: CondicaoPagamento.A_VISTA },
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
    { id: 'e1', produtoId: 'p1', quantidade: 30, dataRecebimento: new Date(), fornecedor: 'Congelados Maná' },
    { id: 'e2', produtoId: 'p3', quantidade: 20, dataRecebimento: yesterday, fornecedor: 'Congelados Maná' },
];

export const MOCK_PAGAMENTOS: Pagamento[] = [
    { id: 'pay1', pedidoId: 'o2', valor: 220.00, data: today, metodo: MetodoPagamento.PIX }
];