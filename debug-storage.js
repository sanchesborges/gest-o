// Script para debug do localStorage
// Cole este código no console do navegador para verificar os dados

console.log('=== DEBUG STORAGE ===\n');

// Verificar entregadores
const entregadores = JSON.parse(localStorage.getItem('entregadores') || '[]');
console.log('📦 Entregadores cadastrados:', entregadores.length);
console.table(entregadores);

// Verificar pedidos
const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
console.log('\n📦 Pedidos cadastrados:', pedidos.length);
console.table(pedidos);

// Verificar pedidos com entregador
const pedidosComEntregador = pedidos.filter(p => p.entregadorId);
console.log('\n📦 Pedidos com entregador atribuído:', pedidosComEntregador.length);
console.table(pedidosComEntregador);

// Verificar clientes
const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
console.log('\n📦 Clientes cadastrados:', clientes.length);
console.table(clientes);

// Verificar produtos
const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
console.log('\n📦 Produtos cadastrados:', produtos.length);
console.table(produtos);

console.log('\n=== FIM DEBUG ===');
