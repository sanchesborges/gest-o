import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Convert date strings back to Date objects
const parsePedidos = (pedidos: any[]): Pedido[] => {
  return pedidos.map(p => ({
    ...p,
    data: new Date(p.data),
    dataVencimentoPagamento: new Date(p.dataVencimentoPagamento)
  }));
};

const parseEntradasEstoque = (entradas: any[]): EntradaEstoque[] => {
  return entradas.map(e => ({
    ...e,
    dataRecebimento: new Date(e.dataRecebimento),
    dataValidade: e.dataValidade ? new Date(e.dataValidade) : undefined
  }));
};

const parsePagamentos = (pagamentos: any[]): Pagamento[] => {
  return pagamentos.map(p => ({
    ...p,
    data: new Date(p.data)
  }));
};

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>(() => loadFromStorage('produtos', MOCK_PRODUTOS));
  const [clientes, setClientes] = useState<Cliente[]>(() => loadFromStorage('clientes', MOCK_CLIENTES));
  const [pedidos, setPedidos] = useState<Pedido[]>(() => parsePedidos(loadFromStorage('pedidos', MOCK_PEDIDOS)));
  const [entradasEstoque, setEntradasEstoque] = useState<EntradaEstoque[]>(() => parseEntradasEstoque(loadFromStorage('entradasEstoque', MOCK_ENTRADAS_ESTOQUE)));
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(() => parsePagamentos(loadFromStorage('pagamentos', MOCK_PAGAMENTOS)));
  const [entregadores, setEntregadores] = useState<Entregador[]>(() => loadFromStorage('entregadores', MOCK_ENTREGADORES));

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('produtos', produtos);
  }, [produtos]);

  useEffect(() => {
    saveToStorage('clientes', clientes);
  }, [clientes]);

  useEffect(() => {
    saveToStorage('pedidos', pedidos);
  }, [pedidos]);

  useEffect(() => {
    saveToStorage('entradasEstoque', entradasEstoque);
  }, [entradasEstoque]);

  useEffect(() => {
    saveToStorage('pagamentos', pagamentos);
  }, [pagamentos]);

  useEffect(() => {
    saveToStorage('entregadores', entregadores);
  }, [entregadores]);

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
