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
  deleteProduto: (produtoId: string) => Promise<void>;
  addCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  addPedido: (pedido: Omit<Pedido, 'id'>) => Promise<void>;
  deletePedido: (pedidoId: string) => Promise<void>;
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
        const mappedProdutos = produtosData.map((p: any) => {
          const preco = parseFloat(p.preco_padrao);
          console.log(`📦 Produto: ${p.nome}, Preço: ${p.preco_padrao} → ${preco}`);
          
          return {
            id: p.id,
            nome: p.nome,
            tipo: p.tipo || 'Biscoito',
            tamanhoPacote: p.tamanho_pacote,
            precoPadrao: isNaN(preco) ? 0 : preco,
            estoqueMinimo: p.estoque_minimo || 0,
            estoqueAtual: p.estoque_atual
          };
        });
        console.log('✅ Produtos carregados:', mappedProdutos);
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
        const mappedClientes = clientesData.map((c: any) => ({
          id: c.id,
          nome: c.nome,
          tipo: c.tipo || 'Mercado',
          endereco: c.endereco,
          telefone: c.telefone,
          condicaoPagamento: c.condicao_pagamento || '15 dias'
        }));
        setClientes(mappedClientes);
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
        console.log(`📦 Carregadas ${entradasData.length} entradas de estoque do Supabase`);
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
        console.error('❌ Erro ao carregar entradas:', entradasError);
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
    // Gerar UUID válido
    const uuid = crypto.randomUUID();
    
    const newProduto: Produto = {
        ...produtoData,
        id: uuid,
        estoqueAtual: 0,
    };
    
    console.log('📦 Tentando adicionar produto:', newProduto.nome);
    console.log('   Dados:', {
      id: newProduto.id,
      nome: newProduto.nome,
      tipo: newProduto.tipo,
      tamanhoPacote: newProduto.tamanhoPacote,
      precoPadrao: newProduto.precoPadrao,
      estoqueMinimo: newProduto.estoqueMinimo,
      estoqueAtual: newProduto.estoqueAtual
    });
    
    try {
      const { data, error } = await supabase
        .from('produtos')
        .insert([{
          id: newProduto.id,
          nome: newProduto.nome,
          tipo: newProduto.tipo,
          tamanho_pacote: newProduto.tamanhoPacote,
          preco_padrao: newProduto.precoPadrao,
          estoque_minimo: newProduto.estoqueMinimo,
          estoque_atual: newProduto.estoqueAtual
        }])
        .select();
      
      if (error) {
        console.error('❌ ERRO ao salvar produto no Supabase:', error);
        console.error('   Código:', error.code);
        console.error('   Mensagem:', error.message);
        console.error('   Detalhes:', error.details);
        console.error('   Hint:', error.hint);
        
        saveToStorage('produtos', [...produtos, newProduto]);
        alert(`Erro ao salvar produto: ${error.message}\n\nO produto foi salvo localmente, mas pode desaparecer ao recarregar a página.`);
      } else {
        console.log('✅ Produto salvo com sucesso no Supabase:', data);
      }
      
      setProdutos(prev => [...prev, newProduto]);
    } catch (error) {
      console.error('❌ Exceção ao adicionar produto:', error);
      saveToStorage('produtos', [...produtos, newProduto]);
      setProdutos(prev => [...prev, newProduto]);
      alert(`Erro inesperado ao salvar produto. Verifique o console para mais detalhes.`);
    }
  };

  const deleteProduto = async (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    console.log(`🗑️ Tentando excluir produto: ${produto?.nome} (ID: ${produtoId})`);
    
    try {
      // Delete from Supabase
      const { data, error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', produtoId)
        .select();
      
      if (error) {
        console.error('❌ ERRO ao excluir produto do Supabase:', error);
        console.error('   Código:', error.code);
        console.error('   Mensagem:', error.message);
        console.error('   Detalhes:', error.details);
        console.error('   Hint:', error.hint);
        
        // Fallback to localStorage
        const updatedProdutos = produtos.filter(p => p.id !== produtoId);
        saveToStorage('produtos', updatedProdutos);
        
        // Mostrar alerta para o usuário
        alert(`Erro ao excluir produto: ${error.message}\n\nO produto foi removido localmente, mas pode reaparecer ao recarregar a página.`);
      } else {
        console.log(`✅ Produto excluído com sucesso do Supabase:`, data);
      }
      
      // Update local state
      setProdutos(prev => prev.filter(p => p.id !== produtoId));
      
    } catch (error) {
      console.error('❌ Exceção ao excluir produto:', error);
      // Fallback to localStorage
      const updatedProdutos = produtos.filter(p => p.id !== produtoId);
      saveToStorage('produtos', updatedProdutos);
      setProdutos(prev => prev.filter(p => p.id !== produtoId));
      
      alert(`Erro inesperado ao excluir produto. Verifique o console para mais detalhes.`);
    }
  };

  const addCliente = async (clienteData: Omit<Cliente, 'id'>) => {
    const newCliente: Cliente = {
        ...clienteData,
        id: crypto.randomUUID(),
    };
    
    try {
      const { error } = await supabase
        .from('clientes')
        .insert([{
          id: newCliente.id,
          nome: newCliente.nome,
          tipo: newCliente.tipo,
          endereco: newCliente.endereco,
          telefone: newCliente.telefone,
          condicao_pagamento: newCliente.condicaoPagamento
        }]);
      
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
    // Gerar UUID válido
    const uuid = crypto.randomUUID();
    
    const newPedido: Pedido = {
        ...pedidoData,
        id: uuid
    };
    
    console.log('🛒 Tentando salvar pedido:', newPedido.id);
    console.log('   Cliente:', newPedido.clienteId);
    console.log('   Valor Total:', newPedido.valorTotal);
    console.log('   Itens:', newPedido.itens.length);
    
    try {
      // Insert pedido
      const { data: pedidoData, error: pedidoError } = await supabase
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
        }])
        .select();
      
      if (pedidoError) {
        console.error('❌ ERRO ao salvar pedido no Supabase:', pedidoError);
        console.error('   Código:', pedidoError.code);
        console.error('   Mensagem:', pedidoError.message);
        console.error('   Detalhes:', pedidoError.details);
        console.error('   Hint:', pedidoError.hint);
        
        alert(`Erro ao salvar pedido: ${pedidoError.message}\n\nO pedido foi salvo localmente, mas pode desaparecer ao recarregar a página.`);
        saveToStorage('pedidos', [...pedidos, newPedido]);
        setPedidos(prev => [...prev, newPedido]);
        return;
      }
      
      console.log('✅ Pedido salvo no Supabase:', pedidoData);
      
      // Validar estoque ANTES de salvar
      console.log('📦 Validando estoque dos produtos...');
      for (const item of newPedido.itens) {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
          const novoEstoque = produto.estoqueAtual - item.quantidade;
          console.log(`   ${produto.nome}: ${produto.estoqueAtual} - ${item.quantidade} = ${novoEstoque}`);
          
          if (novoEstoque < 0) {
            console.error(`❌ Estoque insuficiente para ${produto.nome}`);
            alert(`Estoque insuficiente!\n\nProduto: ${produto.nome}\nEstoque atual: ${produto.estoqueAtual}\nQuantidade solicitada: ${item.quantidade}\n\nPor favor, ajuste a quantidade ou adicione estoque.`);
            
            // Deletar o pedido que foi criado
            await supabase.from('pedidos').delete().eq('id', newPedido.id);
            return;
          }
        }
      }
      
      // Update stock in Supabase ANTES de inserir itens
      console.log('📦 Atualizando estoque dos produtos...');
      for (const item of newPedido.itens) {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
          const novoEstoque = produto.estoqueAtual - item.quantidade;
          
          const { error: estoqueError } = await supabase
            .from('produtos')
            .update({ estoque_atual: novoEstoque })
            .eq('id', item.produtoId);
          
          if (estoqueError) {
            console.error(`❌ Erro ao atualizar estoque de ${produto.nome}:`, estoqueError);
            alert(`Erro ao atualizar estoque: ${estoqueError.message}`);
            
            // Deletar o pedido que foi criado
            await supabase.from('pedidos').delete().eq('id', newPedido.id);
            return;
          }
        }
      }
      
      console.log('✅ Estoque atualizado!');
      
      // Insert itens DEPOIS de atualizar estoque
      const itensToInsert = newPedido.itens.map((item) => ({
        id: crypto.randomUUID(), // Gerar UUID válido para cada item
        pedido_id: newPedido.id,
        produto_id: item.produtoId,
        quantidade: item.quantidade,
        preco_unitario: item.precoUnitario
      }));
      
      console.log('📦 Salvando itens do pedido:', itensToInsert.length);
      
      const { data: itensData, error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itensToInsert)
        .select();
      
      if (itensError) {
        console.error('❌ ERRO ao salvar itens do pedido:', itensError);
        console.error('   Código:', itensError.code);
        console.error('   Mensagem:', itensError.message);
        alert(`Erro ao salvar itens do pedido: ${itensError.message}`);
        return;
      }
      
      console.log('✅ Itens salvos no Supabase:', itensData);
      
      console.log('✅ Estoque atualizado!');
      
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
      console.log('✅ Pedido adicionado com sucesso!');
      
    } catch (error) {
      console.error('❌ Exceção ao adicionar pedido:', error);
      alert(`Erro inesperado ao salvar pedido: ${error}\n\nO pedido foi salvo localmente, mas pode desaparecer ao recarregar a página.`);
      // Fallback to localStorage
      saveToStorage('pedidos', [...pedidos, newPedido]);
      setPedidos(prev => [...prev, newPedido]);
    }
  };

  const deletePedido = async (pedidoId: string) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    console.log(`🗑️ Tentando excluir pedido: ${pedidoId}`);
    
    try {
      // Delete from Supabase (itens_pedido será deletado automaticamente se CASCADE estiver configurado)
      const { data, error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedidoId)
        .select();
      
      if (error) {
        console.error('❌ ERRO ao excluir pedido do Supabase:', error);
        console.error('   Código:', error.code);
        console.error('   Mensagem:', error.message);
        console.error('   Detalhes:', error.details);
        console.error('   Hint:', error.hint);
        
        // Fallback to localStorage
        const updatedPedidos = pedidos.filter(p => p.id !== pedidoId);
        saveToStorage('pedidos', updatedPedidos);
        
        alert(`Erro ao excluir pedido: ${error.message}\n\nO pedido foi removido localmente, mas pode reaparecer ao recarregar a página.`);
      } else {
        console.log(`✅ Pedido excluído com sucesso do Supabase:`, data);
        
        // Se o pedido foi excluído, restaurar o estoque dos produtos
        if (pedido && pedido.status === StatusPedido.PENDENTE) {
          console.log('📦 Restaurando estoque dos produtos...');
          for (const item of pedido.itens) {
            const produto = produtos.find(p => p.id === item.produtoId);
            if (produto) {
              const novoEstoque = produto.estoqueAtual + item.quantidade;
              await supabase
                .from('produtos')
                .update({ estoque_atual: novoEstoque })
                .eq('id', item.produtoId);
              
              console.log(`  ✅ Estoque de ${produto.nome} restaurado: +${item.quantidade}`);
            }
          }
          
          // Atualizar estado local dos produtos
          setProdutos(prevProdutos => {
            const newProdutos = [...prevProdutos];
            pedido.itens.forEach(item => {
              const productIndex = newProdutos.findIndex(p => p.id === item.produtoId);
              if (productIndex !== -1) {
                newProdutos[productIndex].estoqueAtual += item.quantidade;
              }
            });
            return newProdutos;
          });
        }
      }
      
      // Update local state
      setPedidos(prev => prev.filter(p => p.id !== pedidoId));
      
    } catch (error) {
      console.error('❌ Exceção ao excluir pedido:', error);
      // Fallback to localStorage
      const updatedPedidos = pedidos.filter(p => p.id !== pedidoId);
      saveToStorage('pedidos', updatedPedidos);
      setPedidos(prev => prev.filter(p => p.id !== pedidoId));
      
      alert(`Erro inesperado ao excluir pedido. Verifique o console para mais detalhes.`);
    }
  };

  const addEntradaEstoque = async (entradaData: Omit<EntradaEstoque, 'id'>) => {
    const uuid = crypto.randomUUID();
    const newEntrada: EntradaEstoque = { ...entradaData, id: uuid };
    
    const produtoAntes = produtos.find(p => p.id === entradaData.produtoId);
    console.log('📦 Salvando entrada de estoque...');
    console.log(`   Produto: ${produtoAntes?.nome}`);
    console.log(`   Estoque ANTES: ${produtoAntes?.estoqueAtual}`);
    console.log(`   Quantidade a ADICIONAR: ${entradaData.quantidade}`);
    console.log(`   Estoque DEPOIS deveria ser: ${(produtoAntes?.estoqueAtual || 0) + entradaData.quantidade}`);
    
    // 1. SALVAR LOCALMENTE PRIMEIRO (sempre funciona)
    setProdutos(prevProdutos => {
        const newProdutos = [...prevProdutos];
        const productIndex = newProdutos.findIndex(p => p.id === entradaData.produtoId);
        if (productIndex !== -1) {
            const estoqueAntes = newProdutos[productIndex].estoqueAtual;
            newProdutos[productIndex].estoqueAtual += entradaData.quantidade;
            const estoqueDepois = newProdutos[productIndex].estoqueAtual;
            console.log(`   ✅ Estado atualizado: ${estoqueAntes} + ${entradaData.quantidade} = ${estoqueDepois}`);
        }
        return newProdutos;
    });
    
    setEntradasEstoque(prev => [...prev, newEntrada]);
    saveToStorage('entradasEstoque', [...entradasEstoque, newEntrada]);
    
    console.log('✅ Entrada salva localmente!');
    
    // 2. TENTAR SINCRONIZAR COM SUPABASE (em background, sem bloquear)
    try {
      const dataToInsert = {
        produto_id: entradaData.produtoId,
        quantidade: entradaData.quantidade,
        fornecedor: entradaData.fornecedor,
        data_recebimento: entradaData.dataRecebimento.toISOString(),
        data_validade: entradaData.dataValidade?.toISOString()
      };
      
      const { error } = await supabase
        .from('entradas_estoque')
        .insert([dataToInsert]);
      
      if (error) {
        console.warn('⚠️ Não foi possível sincronizar com Supabase:', error.message);
        console.log('💾 Dados mantidos apenas localmente');
      } else {
        console.log('✅ Sincronizado com Supabase!');
        
        // Atualizar estoque no Supabase também
        // Buscar estoque atual do banco (não do estado local que já foi atualizado)
        const { data: produtoAtual, error: fetchError } = await supabase
          .from('produtos')
          .select('nome, estoque_atual')
          .eq('id', entradaData.produtoId)
          .single();
        
        if (fetchError) {
          console.error('❌ Erro ao buscar produto:', fetchError);
        } else if (produtoAtual) {
          const novoEstoque = produtoAtual.estoque_atual + entradaData.quantidade;
          console.log(`📦 Atualizando estoque de ${produtoAtual.nome}: ${produtoAtual.estoque_atual} + ${entradaData.quantidade} = ${novoEstoque}`);
          
          const { error: updateError } = await supabase
            .from('produtos')
            .update({ estoque_atual: novoEstoque })
            .eq('id', entradaData.produtoId);
          
          if (updateError) {
            console.error('❌ Erro ao atualizar estoque no Supabase:', updateError);
          } else {
            console.log('✅ Estoque atualizado no Supabase!');
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao sincronizar com Supabase:', error);
      console.log('💾 Dados mantidos apenas localmente');
    }
  };
  
  const addPagamento = async (pedidoId: string, valor: number, metodo: MetodoPagamento) => {
      const newPagamento: Pagamento = {
          id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
    deleteProduto,
    addCliente,
    addPedido,
    deletePedido,
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
