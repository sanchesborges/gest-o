// Teste direto de conexão com Supabase
// Execute: node test-supabase-direct.js

const fetch = require('node-fetch');

const supabaseUrl = 'https://bkwgowsumeylnwbintdz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU';

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/produtos?select=id,nome,estoque_atual&limit=3`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📊 Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CONEXÃO OK!\n');
      console.log('📦 Produtos encontrados:', data.length);
      console.log('\nDados:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ ERRO:', error);
    }
  } catch (error) {
    console.log('❌ ERRO DE REDE:', error.message);
    console.log('\nPossíveis causas:');
    console.log('1. Firewall bloqueando a conexão');
    console.log('2. Proxy/VPN interferindo');
    console.log('3. Problema de DNS');
  }
}

testConnection();
