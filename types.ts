export enum TipoProduto {
  PAO_DE_QUEIJO = 'Pão de Queijo',
  BISCOITO_QUEIJO = 'Biscoito de Queijo',
  BISCOITO_FERRADURA = 'Biscoito Ferradura',
}

export enum TamanhoPacote {
  UM_KG = '1kg',
  CINCO_KG = '5kg',
}

export interface Produto {
  id: string;
  nome: string;
  tipo: TipoProduto;
  tamanhoPacote: TamanhoPacote;
  precoPadrao: number;
  estoqueMinimo: number;
  estoqueAtual: number;
}

export enum TipoCliente {
  MERCADO = 'Mercado',
  PADARIA = 'Padaria',
  VAREJO = 'Varejo',
}

export enum CondicaoPagamento {
  A_VISTA = 'À vista',
  PROXIMA_ENTREGA = 'Pagar na próxima entrega',
}

export interface Cliente {
  id: string;
  nome: string;
  tipo: TipoCliente;
  endereco: string;
  telefone: string;
  condicaoPagamento: CondicaoPagamento;
}

export interface EntradaEstoque {
  id: string;
  produtoId: string;
  quantidade: number;
  dataRecebimento: Date;
  dataValidade?: Date;
  fornecedor: string;
}

export enum StatusPedido {
  PENDENTE = 'Pendente',
  ENTREGUE = 'Entregue',
  CANCELADO = 'Cancelado',
}

export enum StatusPagamento {
    PENDENTE = 'Pendente',
    PAGO = 'Pago',
    ATRASADO = 'Atrasado',
}

export interface ItemPedido {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  data: Date;
  itens: ItemPedido[];
  valorTotal: number;
  status: StatusPedido;
  dataVencimentoPagamento: Date;
  statusPagamento: StatusPagamento;
  assinatura?: string; // base64
  entregadorId?: string;
}

export enum MetodoPagamento {
    DINHEIRO = 'Dinheiro',
    PIX = 'PIX',
    BOLETO = 'Boleto',
}

export interface Pagamento {
    id: string;
    pedidoId: string;
    valor: number;
    data: Date;
    metodo: MetodoPagamento;
}

export interface Entregador {
  id: string;
  nome: string;
  telefone?: string;
}

export enum UserRole {
    ADMIN = 'admin',
    ENTREGADOR = 'entregador',
}