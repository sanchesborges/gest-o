// Versão alternativa usando fetch direto (sem biblioteca Supabase)
// Use esta se a biblioteca continuar dando erro de CORS

const supabaseUrl = 'https://bkwgowsumeylnwbintdz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrd2dvd3N1bWV5bG53YmludGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQyMjIsImV4cCI6MjA3NTc3MDIyMn0.zCP5mCLyHMO0ag4I11ktRoPEGo_mPAGWP8idLMIwIFU';

const headers = {
  'apikey': supabaseKey,
  'Authorization': `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

export const supabaseDirect = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const url = `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}`;
          const response = await fetch(url, { headers, method: 'GET' });
          const data = await response.json();
          return { data: Array.isArray(data) ? data[0] : data, error: null };
        },
        async execute() {
          const url = `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}`;
          const response = await fetch(url, { headers, method: 'GET' });
          const data = await response.json();
          return { data, error: null };
        }
      }),
      limit: (count: number) => ({
        async execute() {
          const url = `${supabaseUrl}/rest/v1/${table}?select=${columns}&limit=${count}`;
          const response = await fetch(url, { headers, method: 'GET' });
          const data = await response.json();
          return { data, error: null };
        },
        single: async () => {
          const url = `${supabaseUrl}/rest/v1/${table}?select=${columns}&limit=1`;
          const response = await fetch(url, { headers, method: 'GET' });
          const data = await response.json();
          return { data: Array.isArray(data) ? data[0] : data, error: null };
        }
      }),
      async execute() {
        const url = `${supabaseUrl}/rest/v1/${table}?select=${columns}`;
        const response = await fetch(url, { headers, method: 'GET' });
        const data = await response.json();
        return { data, error: null };
      }
    }),
    
    update: (values: any) => ({
      eq: (column: string, value: any) => ({
        async execute() {
          const url = `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`;
          const response = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(values)
          });
          return { error: response.ok ? null : await response.json() };
        }
      })
    }),
    
    insert: (values: any) => ({
      async execute() {
        const url = `${supabaseUrl}/rest/v1/${table}`;
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(Array.isArray(values) ? values : [values])
        });
        const data = await response.json();
        return { data, error: response.ok ? null : data };
      }
    }),
    
    delete: () => ({
      eq: (column: string, value: any) => ({
        async execute() {
          const url = `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`;
          const response = await fetch(url, {
            method: 'DELETE',
            headers
          });
          return { error: response.ok ? null : await response.json() };
        }
      })
    })
  })
};
