import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Produto, Cliente, Pedido, EntradaEstoque, Pagamento, ItemPedido, StatusPedido, StatusPagamento, MetodoPagamento, Entregador } from '../types';
import { MOCK_PRODUTOS, MOCK_CLIENTES, MOCK_PEDIDOS, MOCK_ENTRADAS_ESTOQUE, MOCK_PAGAMENTOS, MOCK_ENTREGADORES } from '../constants';

interface AppDataContextType {
  produtos: Produto[];
  clientes: Cliente[];
  pedidos: Pedido[];
  entradasEstoque: EntradaEstoque[];
  pagamentos: Pagamento[];
  entregadores: Entregador[];
  addProduto: (produto: Omit<Produto, 'id' | 'estoqueAtual'>) => void;
  addCliente: (cliente: Omit<Cliente, 'id'>) => void;
  addPedido: (pedido: Omit<Pedido, 'id'>) => void;
  addEntradaEstoque: (entrada: Omit<EntradaEstoque, 'id'>) => void;
  addPagamento: (pedidoId: string, valor: number, metodo: MetodoPagamento) => void;
  updatePedidoStatus: (pedidoId: string, status: StatusPedido, assinatura?: string) => void;
  addEntregador: (entregador: Omit<Entregador, 'id'>) => void;
  assignEntregador: (pedidoId: string, entregadorId: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>(MOCK_PRODUTOS);
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [pedidos, setPedidos] = useState<Pedido[]>(MOCK_PEDIDOS);
  const [entradasEstoque, setEntradasEstoque] = useState<EntradaEstoque[]>(MOCK_ENTRADAS_ESTOQUE);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(MOCK_PAGAMENTOS);
  const [entregadores, setEntregadores] = useState<Entregador[]>(MOCK_ENTREGADORES);

  const addProduto = (produtoData: Omit<Produto, 'id' | 'estoqueAtual'>) => {
    const newProduto: Produto = {
        ...produtoData,
        id: `p${produtos.length + 1}`,
        estoqueAtual: 0,
    };
    setProdutos(prev => [...prev, newProduto]);
  };

  const addCliente = (clienteData: Omit<Cliente, 'id'>) => {
    const newCliente: Cliente = {
        ...clienteData,
        id: `c${clientes.length + 1}`,
    };
    setClientes(prev => [...prev, newCliente]);
  };
  
  const addPedido = (pedidoData: Omit<Pedido, 'id'>) => {
    // Update stock
    setProdutos(prevProdutos => {
      const newProdutos = [...prevProdutos];
      pedidoData.itens.forEach(item => {
        const productIndex = newProdutos.findIndex(p => p.id === item.produtoId);
        if (productIndex !== -1) {
          newProdutos[productIndex].estoqueAtual -= item.quantidade;
        }
      });
      return newProdutos;
    });
    
    const newPedido: Pedido = {
        ...pedidoData,
        id: `o${pedidos.length + 1}`
    };
    setPedidos(prev => [...prev, newPedido]);
  };

  const addEntradaEstoque = (entradaData: Omit<EntradaEstoque, 'id'>) => {
    setProdutos(prevProdutos => {
        const newProdutos = [...prevProdutos];
        const productIndex = newProdutos.findIndex(p => p.id === entradaData.produtoId);
        if (productIndex !== -1) {
            newProdutos[productIndex].estoqueAtual += entradaData.quantidade;
        }
        return newProdutos;
    });

    const newEntrada: EntradaEstoque = {
        ...entradaData,
        id: `e${entradasEstoque.length + 1}`
    };
    setEntradasEstoque(prev => [...prev, newEntrada]);
  };
  
  const addPagamento = (pedidoId: string, valor: number, metodo: MetodoPagamento) => {
      const newPagamento: Pagamento = {
          id: `pay${pagamentos.length + 1}`,
          pedidoId,
          valor,
          metodo,
          data: new Date()
      };
      setPagamentos(prev => [...prev, newPagamento]);

      setPedidos(prev => prev.map(p => p.id === pedidoId ? { ...p, statusPagamento: StatusPagamento.PAGO } : p));
  };

  const updatePedidoStatus = (pedidoId: string, status: StatusPedido, assinatura?: string) => {
    setPedidos(prev => prev.map(p => {
        if (p.id === pedidoId) {
            const updatedPedido: Pedido = { ...p, status };
            if(assinatura) {
                updatedPedido.assinatura = assinatura;
            }
            return updatedPedido;
        }
        return p;
    }));
  };

  const addEntregador = (entregadorData: Omit<Entregador, 'id'>) => {
    const newEntregador: Entregador = {
        ...entregadorData,
        id: `ent${entregadores.length + 1}`,
    };
    setEntregadores(prev => [...prev, newEntregador]);
  };

  const assignEntregador = (pedidoId: string, entregadorId: string) => {
    setPedidos(prev => prev.map(p => 
        p.id === pedidoId ? { ...p, entregadorId } : p
    ));
  };

  const providerValue = {
    produtos,
    clientes,
    pedidos,
    entradasEstoque,
    pagamentos,
    entregadores,
    addProduto,
    addCliente,
    addPedido,
    addEntradaEstoque,
    addPagamento,
    updatePedidoStatus,
    addEntregador,
    assignEntregador,
  };

  return React.createElement(AppDataContext.Provider, { value: providerValue }, children);
};

export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
