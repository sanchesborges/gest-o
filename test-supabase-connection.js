// Script para testar conexão com Supabase
// Cole no console do navegador (F12) e execute

console.log('🔍 Testando conexão com Supabase...\n');

// Importar supabase
import { supabase } from './lib/supabase.js';

// Teste 1: Verificar conexão
async function testConnection() {
    console.log('1️⃣ Testando conexão básica...');
    try {
        const { data, error } = await supabase.from('entregadores').select('count');
        if (error) {
            console.error('❌ Erro na conexão:', error.message);
            return false;
        }
        console.log('✅ Conexão OK!\n');
        return true;
    } catch (err) {
        console.error('❌ Erro:', err.message);
        return false;
    }
}

// Teste 2: Listar entregadores
async function listEntregadores() {
    console.log('2️⃣ Listando entregadores...');
    try {
        const { data, error } = await supabase
            .from('entregadores')
            .select('*');
        
        if (error) {
            console.error('❌ Erro ao listar:', error.message);
            return;
        }
        
        console.log(`✅ Encontrados ${data.length} entregadores:`);
        console.table(data);
        console.log('');
    } catch (err) {
        console.error('❌ Erro:', err.message);
    }
}

// Teste 3: Inserir entregador de teste
async function testInsert() {
    console.log('3️⃣ Testando inserção...');
    try {
        const testEntregador = {
            id: `test_${Date.now()}`,
            nome: 'Teste Supabase',
            telefone: '(00) 00000-0000',
            veiculo: 'Moto'
        };
        
        const { data, error } = await supabase
            .from('entregadores')
            .insert([testEntregador])
            .select();
        
        if (error) {
            console.error('❌ Erro ao inserir:', error.message);
            console.error('Detalhes:', error);
            return;
        }
        
        console.log('✅ Entregador inserido com sucesso!');
        console.log(data);
        console.log('');
    } catch (err) {
        console.error('❌ Erro:', err.message);
    }
}

// Executar todos os testes
async function runAllTests() {
    const connected = await testConnection();
    if (!connected) {
        console.log('❌ Não foi possível conectar ao Supabase');
        console.log('Verifique:');
        console.log('1. Se as tabelas foram criadas');
        console.log('2. Se a URL e chave estão corretas em lib/supabase.ts');
        console.log('3. Se as políticas RLS foram criadas');
        return;
    }
    
    await listEntregadores();
    await testInsert();
    await listEntregadores();
    
    console.log('✨ Testes concluídos!');
}

runAllTests();
