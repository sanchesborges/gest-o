import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Produto, Cliente, Pedido, EntradaEstoque, Pagamento, ItemPedido, StatusPedido, StatusPagamento, MetodoPagamento, Entregador } from '../types';
import { MOCK_PRODUTOS, MOCK_CLIENTES, MOCK_PEDIDOS, MOCK_ENTRADAS_ESTOQUE, MOCK_PAGAMENTOS, MOCK_ENTREGADORES } from '../constants';
import { supabase } from '../lib/supabase';

interface AppDataContextType {
  produtos: Produto[];
  clientes: Cliente[];
  pedidos: Pedido[];
  entradasEstoque: EntradaEstoque[];
  pagamentos: Pagamento[];
  entregadores: Entregador[];
  addProduto: (produto: Omit<Produto, 'id' | 'estoqueAtual'>) => Promise<void>;
  addCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  addPedido: (pedido: Omit<Pedido, 'id'>) => Promise<void>;
  addEntradaEstoque: (entrada: Omit<EntradaEstoque, 'id'>) => Promise<void>;
  addPagamento: (pedidoId: string, valor: number, metodo: MetodoPagamento) => Promise<void>;
  updatePedidoStatus: (pedidoId: string, status: StatusPedido, assinatura?: string) => Promise<void>;
  addEntregador: (entregador: Omit<Entregador, 'id'>) => Promise<void>;
  deleteEntregador: (entregadorId: string) => Promise<void>;
  assignEntregador: (pedidoId: string, entregadorId: string) => Promise<void>;
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
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [entradasEstoque, setEntradasEstoque] = useState<EntradaEstoque[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      
      // Load produtos
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('*');
      if (!produtosError && produtosData) {
        const mappedProdutos = produtosData.map((p: any) => ({
          id: p.id,
          nome: p.nome,
          tipo: p.tipo || 'Biscoito',
          tamanhoPacote: p.tamanho_pacote,
          precoPadrao: parseFloat(p.preco_unitario),
          estoqueMinimo: p.estoque_minimo || 0,
          estoqueAtual: p.estoque_atual
        }));
        setProdutos(mappedProdutos);
      } else if (produtosError) {
        console.error('Erro ao carregar produtos:', produtosError);
        setProdutos(loadFromStorage('produtos', MOCK_PRODUTOS));
      }

      // Load clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*');
      if (!clientesError && clientesData) {
        setClientes(clientesData);
      } else if (clientesError) {
        console.error('Erro ao carregar clientes:', clientesError);
        setClientes(loadFromStorage('clientes', MOCK_CLIENTES));
      }

      // Load entregadores
      const { data: entregadoresData, error: entregadoresError } = await supabase
        .from('entregadores')
        .select('*');
      if (!entregadoresError && entregadoresData) {
        const mappedEntregadores = entregadoresData.map((e: any) => ({
          id: e.id,
          nome: e.nome,
          telefone: e.telefone,
          avatarUrl: e.avatar_url
        }));
        setEntregadores(mappedEntregadores);
      } else if (entregadoresError) {
        console.error('Erro ao carregar entregadores:', entregadoresError);
        setEntregadores(loadFromStorage('entregadores', MOCK_ENTREGADORES));
      }

      // Load pedidos with itens
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('pedidos')
        .select(`
          *,
          itens_pedido (*)
        `);
      if (!pedidosError && pedidosData) {
        const mappedPedidos = pedidosData.map((p: any) => ({
          id: p.id,
          clienteId: p.cliente_id,
          entregadorId: p.entregador_id,
          data: new Date(p.data),
          valorTotal: parseFloat(p.valor_total),
          status: p.status as StatusPedido,
          statusPagamento: p.status_pagamento as StatusPagamento,
          dataVencimentoPagamento: new Date(p.data_vencimento_pagamento),
          assinatura: p.assinatura,
          itens: p.itens_pedido.map((item: any) => ({
            produtoId: item.produto_id,
            quantidade: item.quantidade,
            precoUnitario: parseFloat(item.preco_unitario)
          }))
        }));
        setPedidos(mappedPedidos);
      } else if (pedidosError) {
        console.error('Erro ao carregar pedidos:', pedidosError);
        setPedidos(parsePedidos(loadFromStorage('pedidos', MOCK_PEDIDOS)));
      }

      // Load entradas estoque
      const { data: entradasData, error: entradasError } = await supabase
        .from('entradas_estoque')
        .select('*');
      if (!entradasError && entradasData) {
        const mappedEntradas = entradasData.map((e: any) => ({
          id: e.id,
          produtoId: e.produto_id,
          quantidade: e.quantidade,
          fornecedor: e.fornecedor,
          dataRecebimento: new Date(e.data_recebimento),
          dataValidade: e.data_validade ? new Date(e.data_validade) : undefined
        }));
        setEntradasEstoque(mappedEntradas);
      } else if (entradasError) {
        console.error('Erro ao carregar entradas:', entradasError);
        setEntradasEstoque(parseEntradasEstoque(loadFromStorage('entradasEstoque', MOCK_ENTRADAS_ESTOQUE)));
      }

      // Load pagamentos
      const { data: pagamentosData, error: pagamentosError } = await supabase
        .from('pagamentos')
        .select('*');
      if (!pagamentosError && pagamentosData) {
        const mappedPagamentos = pagamentosData.map((p: any) => ({
          id: p.id,
          pedidoId: p.pedido_id,
          valor: parseFloat(p.valor),
          metodo: p.metodo as MetodoPagamento,
          data: new Date(p.data)
        }));
        setPagamentos(mappedPagamentos);
      } else if (pagamentosError) {
        console.error('Erro ao carregar pagamentos:', pagamentosError);
        setPagamentos(parsePagamentos(loadFromStorage('pagamentos', MOCK_PAGAMENTOS)));
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback to localStorage
      setProdutos(loadFromStorage('produtos', MOCK_PRODUTOS));
      setClientes(loadFromStorage('clientes', MOCK_CLIENTES));
      setEntregadores(loadFromStorage('entregadores', MOCK_ENTREGADORES));
      setPedidos(parsePedidos(loadFromStorage('pedidos', MOCK_PEDIDOS)));
      setEntradasEstoque(parseEntradasEstoque(loadFromStorage('entradasEstoque', MOCK_ENTRADAS_ESTOQUE)));
      setPagamentos(parsePagamentos(loadFromStorage('pagamentos', MOCK_PAGAMENTOS)));
    } finally {
      setIsLoading(false);
    }
  };

  // Persist data to localStorage whenever it changes (backup)
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

  const addProduto = async (produtoData: Omit<Produto, 'id' | 'estoqueAtual'>) => {
    const newProduto: Produto = {
        ...produtoData,
        id: `p${Date.now()}`,
        estoqueAtual: 0,
    };
    
    try {
      const { error } = await supabase
        .from('produtos')
        .insert([{
          id: newProduto.id,
          nome: newProduto.nome,
          tipo: newProduto.tipo,
          tamanho_pacote: newProduto.tamanhoPacote,
          preco_unitario: newProduto.precoPadrao,
          estoque_minimo: newProduto.estoqueMinimo,
          estoque_atual: newProduto.estoqueAtual
        }]);
      
      if (error) {
        console.error('Erro ao salvar produto:', error);
        saveToStorage('produtos', [...produtos, newProduto]);
      }
      
      setProdutos(prev => [...prev, newProduto]);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      saveToStorage('produtos', [...produtos, newProduto]);
      setProdutos(prev => [...prev, newProduto]);
    }
  };

  const addCliente = async (clienteData: Omit<Cliente, 'id'>) => {
    const newCliente: Cliente = {
        ...clienteData,
        id: `c${Date.now()}`,
    };
    
    try {
      const { error } = await supabase
        .from('clientes')
        .insert([newCliente]);
      
      if (error) {
        console.error('Erro ao salvar cliente:', error);
        saveToStorage('clientes', [...clientes, newCliente]);
      }
      
      setClientes(prev => [...prev, newCliente]);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      saveToStorage('clientes', [...clientes, newCliente]);
      setClientes(prev => [...prev, newCliente]);
    }
  };
  
  const addPedido = async (pedidoData: Omit<Pedido, 'id'>) => {
    const newPedido: Pedido = {
        ...pedidoData,
        id: `o${Date.now()}`
    };
    
    try {
      // Insert pedido
      const { error: pedidoError } = await supabase
        .from('pedidos')
        .insert([{
          id: newPedido.id,
          cliente_id: newPedido.clienteId,
          entregador_id: newPedido.entregadorId,
          data: newPedido.data.toISOString(),
          valor_total: newPedido.valorTotal,
          status: newPedido.status,
          status_pagamento: newPedido.statusPagamento,
          data_vencimento_pagamento: newPedido.dataVencimentoPagamento.toISOString(),
          assinatura: newPedido.assinatura
        }]);
      
      if (pedidoError) {
        console.error('Erro ao salvar pedido:', pedidoError);
      }
      
      // Insert itens
      const itensToInsert = newPedido.itens.map((item, index) => ({
        id: `item${Date.now()}_${index}`,
        pedido_id: newPedido.id,
        produto_id: item.produtoId,
        quantidade: item.quantidade,
        preco_unitario: item.precoUnitario
      }));
      
      const { error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itensToInsert);
      
      if (itensError) {
        console.error('Erro ao salvar itens do pedido:', itensError);
      }
      
      // Update stock in Supabase
      for (const item of newPedido.itens) {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
          const novoEstoque = produto.estoqueAtual - item.quantidade;
          await supabase
            .from('produtos')
            .update({ estoque_atual: novoEstoque })
            .eq('id', item.produtoId);
        }
      }
      
      // Update local state
      setProdutos(prevProdutos => {
        const newProdutos = [...prevProdutos];
        newPedido.itens.forEach(item => {
          const productIndex = newProdutos.findIndex(p => p.id === item.produtoId);
          if (productIndex !== -1) {
            newProdutos[productIndex].estoqueAtual -= item.quantidade;
          }
        });
        return newProdutos;
      });
      
      setPedidos(prev => [...prev, newPedido]);
      
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error);
      // Fallback to localStorage
      saveToStorage('pedidos', [...pedidos, newPedido]);
      setPedidos(prev => [...prev, newPedido]);
    }
  };

  const addEntradaEstoque = async (entradaData: Omit<EntradaEstoque, 'id'>) => {
    const newEntrada: EntradaEstoque = {
        ...entradaData,
        id: `e${Date.now()}`
    };
    
    try {
      // Insert entrada
      const { error } = await supabase
        .from('entradas_estoque')
        .insert([{
          id: newEntrada.id,
          produto_id: newEntrada.produtoId,
          quantidade: newEntrada.quantidade,
          fornecedor: newEntrada.fornecedor,
          data_recebimento: newEntrada.dataRecebimento.toISOString(),
          data_validade: newEntrada.dataValidade?.toISOString()
        }]);
      
      if (error) {
        console.error('Erro ao salvar entrada de estoque:', error);
      }
      
      // Update stock in Supabase
      const produto = produtos.find(p => p.id === entradaData.produtoId);
      if (produto) {
        const novoEstoque = produto.estoqueAtual + entradaData.quantidade;
        await supabase
          .from('produtos')
          .update({ estoque_atual: novoEstoque })
          .eq('id', entradaData.produtoId);
      }
      
      // Update local state
      setProdutos(prevProdutos => {
          const newProdutos = [...prevProdutos];
          const productIndex = newProdutos.findIndex(p => p.id === entradaData.produtoId);
          if (productIndex !== -1) {
              newProdutos[productIndex].estoqueAtual += entradaData.quantidade;
          }
          return newProdutos;
      });

      setEntradasEstoque(prev => [...prev, newEntrada]);
      
    } catch (error) {
      console.error('Erro ao adicionar entrada de estoque:', error);
      saveToStorage('entradasEstoque', [...entradasEstoque, newEntrada]);
      setEntradasEstoque(prev => [...prev, newEntrada]);
    }
  };
  
  const addPagamento = async (pedidoId: string, valor: number, metodo: MetodoPagamento) => {
      const newPagamento: Pagamento = {
          id: `pay${Date.now()}`,
          pedidoId,
          valor,
          metodo,
          data: new Date()
      };
      
      try {
        // Insert pagamento
        const { error: pagamentoError } = await supabase
          .from('pagamentos')
          .insert([{
            id: newPagamento.id,
            pedido_id: newPagamento.pedidoId,
            valor: newPagamento.valor,
            metodo: newPagamento.metodo,
            data: newPagamento.data.toISOString()
          }]);
        
        if (pagamentoError) {
          console.error('Erro ao salvar pagamento:', pagamentoError);
        }
        
        // Update pedido status
        const { error: pedidoError } = await supabase
          .from('pedidos')
          .update({ status_pagamento: StatusPagamento.PAGO })
          .eq('id', pedidoId);
        
        if (pedidoError) {
          console.error('Erro ao atualizar status do pedido:', pedidoError);
        }
        
        setPagamentos(prev => [...prev, newPagamento]);
        setPedidos(prev => prev.map(p => p.id === pedidoId ? { ...p, statusPagamento: StatusPagamento.PAGO } : p));
        
      } catch (error) {
        console.error('Erro ao adicionar pagamento:', error);
        saveToStorage('pagamentos', [...pagamentos, newPagamento]);
        setPagamentos(prev => [...prev, newPagamento]);
        setPedidos(prev => prev.map(p => p.id === pedidoId ? { ...p, statusPagamento: StatusPagamento.PAGO } : p));
      }
  };

  const updatePedidoStatus = async (pedidoId: string, status: StatusPedido, assinatura?: string) => {
    try {
      const updateData: any = { status };
      if (assinatura) {
        updateData.assinatura = assinatura;
      }
      
      const { error } = await supabase
        .from('pedidos')
        .update(updateData)
        .eq('id', pedidoId);
      
      if (error) {
        console.error('Erro ao atualizar status do pedido:', error);
      }
      
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
      
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
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
    }
  };

  const addEntregador = async (entregadorData: Omit<Entregador, 'id'>) => {
    const newEntregador: Entregador = {
        ...entregadorData,
        id: `ent${Date.now()}`,
    };
    
    try {
      // Save to Supabase (mapear avatarUrl para avatar_url)
      const { error } = await supabase
        .from('entregadores')
        .insert([{
          id: newEntregador.id,
          nome: newEntregador.nome,
          telefone: newEntregador.telefone,
          avatar_url: newEntregador.avatarUrl
        }]);
      
      if (error) {
        console.error('Erro ao salvar entregador no Supabase:', error);
        console.error('Detalhes do erro:', JSON.stringify(error, null, 2));
        // Fallback to localStorage
        saveToStorage('entregadores', [...entregadores, newEntregador]);
      } else {
        console.log('✅ Entregador salvo com sucesso no Supabase!');
      }
      
      setEntregadores(prev => [...prev, newEntregador]);
    } catch (error) {
      console.error('Erro ao adicionar entregador:', error);
      // Fallback to localStorage
      saveToStorage('entregadores', [...entregadores, newEntregador]);
      setEntregadores(prev => [...prev, newEntregador]);
    }
  };

  const deleteEntregador = async (entregadorId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('entregadores')
        .delete()
        .eq('id', entregadorId);
      
      if (error) {
        console.error('Erro ao excluir entregador do Supabase:', error);
        // Fallback to localStorage
        const updatedEntregadores = entregadores.filter(e => e.id !== entregadorId);
        saveToStorage('entregadores', updatedEntregadores);
      }
      
      // Update local state
      setEntregadores(prev => prev.filter(e => e.id !== entregadorId));
      
    } catch (error) {
      console.error('Erro ao excluir entregador:', error);
      // Fallback to localStorage
      const updatedEntregadores = entregadores.filter(e => e.id !== entregadorId);
      saveToStorage('entregadores', updatedEntregadores);
      setEntregadores(prev => prev.filter(e => e.id !== entregadorId));
    }
  };

  const assignEntregador = async (pedidoId: string, entregadorId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ entregador_id: entregadorId })
        .eq('id', pedidoId);
      
      if (error) {
        console.error('Erro ao atribuir entregador:', error);
      }
      
      setPedidos(prev => prev.map(p => 
          p.id === pedidoId ? { ...p, entregadorId } : p
      ));
      
    } catch (error) {
      console.error('Erro ao atribuir entregador:', error);
      setPedidos(prev => prev.map(p => 
          p.id === pedidoId ? { ...p, entregadorId } : p
      ));
    }
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
    deleteEntregador,
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
