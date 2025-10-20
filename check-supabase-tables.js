// Script para verificar se as tabelas do Supabase foram criadas
// Execute no console do navegador (F12)

import { supabase } from './lib/supabase';

async function checkTables() {
    console.log('🔍 Verificando tabelas do Supabase...\n');
    
    const tables = [
        'produtos',
        'clientes', 
        'entregadores',
        'pedidos',
        'itens_pedido',
        'entradas_estoque',
        'pagamentos'
    ];
    
    for (const table of tables) {
        try {
            const { data, error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });
            
            if (error) {
                console.log(`❌ ${table}: ERRO - ${error.message}`);
            } else {
                console.log(`✅ ${table}: OK (${count || 0} registros)`);
            }
        } catch (err) {
            console.log(`❌ ${table}: ERRO - ${err.message}`);
        }
    }
    
    console.log('\n✨ Verificação concluída!');
}

checkTables();
