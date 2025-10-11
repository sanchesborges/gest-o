import { Cliente, Produto, TipoCliente, CondicaoPagamento } from '../types';

export const clientesIniciais: Omit<Cliente, 'id'>[] = [
    {
        nome: 'MADÁ',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'LUCAS',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'D.LUCIA',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'FLAM SER',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'FLAM BEL',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'FLAM MAT',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'SUP BAHIA',
        tipo: TipoCliente.MERCADO,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'CAFE MIX',
        tipo: TipoCliente.RESTAURANTE,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'IDEAL',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'RENER',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'SANDUBS',
        tipo: TipoCliente.RESTAURANTE,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'TRADIÇÃO',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'VOU LÁ',
        tipo: TipoCliente.PADARIA,
        endereco: 'A definir',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.SETE_DIAS
    },
    {
        nome: 'AVULSOS',
        tipo: TipoCliente.OUTROS,
        endereco: 'Vendas avulsas',
        telefone: '(00) 00000-0000',
        condicaoPagamento: CondicaoPagamento.A_VISTA
    }
];

export const produtosIniciais: Omit<Produto, 'id'>[] = [
    {
        nome: 'Biscoito Polvilho',
        tamanhoPacote: '1kg',
        precoVenda: 16.00,
        estoqueAtual: 100,
        estoqueMinimo: 20
    },
    {
        nome: 'Biscoito Goma',
        tamanhoPacote: '1kg',
        precoVenda: 16.00,
        estoqueAtual: 50,
        estoqueMinimo: 10
    },
    {
        nome: 'Fubá',
        tamanhoPacote: '1kg',
        precoVenda: 15.00,
        estoqueAtual: 80,
        estoqueMinimo: 15
    },
    {
        nome: 'Pão de Queijo',
        tamanhoPacote: '1kg',
        precoVenda: 15.00,
        estoqueAtual: 120,
        estoqueMinimo: 25
    },
    {
        nome: 'Biscoito Polvilho',
        tamanhoPacote: '5kg',
        precoVenda: 80.00,
        estoqueAtual: 40,
        estoqueMinimo: 10
    },
    {
        nome: 'Biscoito Goma',
        tamanhoPacote: '5kg',
        precoVenda: 80.00,
        estoqueAtual: 30,
        estoqueMinimo: 8
    },
    {
        nome: 'Fubá',
        tamanhoPacote: '5kg',
        precoVenda: 80.00,
        estoqueAtual: 25,
        estoqueMinimo: 8
    },
    {
        nome: 'Pão de Queijo',
        tamanhoPacote: '25g',
        precoVenda: 0.50,
        estoqueAtual: 500,
        estoqueMinimo: 100
    },
    {
        nome: 'Pão de Queijo',
        tamanhoPacote: '30g',
        precoVenda: 0.60,
        estoqueAtual: 400,
        estoqueMinimo: 100
    },
    {
        nome: 'Pão de Queijo',
        tamanhoPacote: '40g',
        precoVenda: 0.80,
        estoqueAtual: 300,
        estoqueMinimo: 80
    },
    {
        nome: 'Pão de Queijo',
        tamanhoPacote: '100g',
        precoVenda: 2.00,
        estoqueAtual: 200,
        estoqueMinimo: 50
    },
    {
        nome: 'Rapadura',
        tamanhoPacote: '1kg',
        precoVenda: 14.00,
        estoqueAtual: 60,
        estoqueMinimo: 15
    }
];
