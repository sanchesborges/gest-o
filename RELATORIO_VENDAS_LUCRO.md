# Relatório de Vendas e Lucro

## 📋 Resumo da Funcionalidade

Nova página de **Relatório de Vendas** que mostra análise detalhada de vendas, incluindo:
- Total de vendas em reais e kilos
- Custo total dos produtos vendidos
- Lucro líquido e margem de lucro
- Detalhamento por produto com análise de lucratividade

## ✨ O que foi implementado

### 1. Nova Página: Relatório de Vendas (`/vendas`)
- Acessível através de novo card na página inicial
- Filtros por período: 7 dias, 30 dias ou todos os pedidos
- Cards de resumo com métricas principais
- Lista detalhada de produtos vendidos

### 2. Campo de Custo Unitário nos Produtos
- Adicionado campo `custoUnitario` na tabela `produtos`
- Campo editável no cadastro de produtos
- Preview de lucro ao cadastrar produto
- Usado para calcular lucro real nas vendas

### 3. Cálculos Automáticos
- **Receita Total**: Soma de todos os pedidos entregues
- **Total em Kilos**: Calculado com base no tamanho do pacote
- **Custo Total**: Soma do custo unitário × quantidade vendida
- **Lucro Líquido**: Receita - Custo
- **Margem de Lucro**: (Lucro / Receita) × 100

### 4. Análise por Produto
Para cada produto vendido, mostra:
- Quantidade vendida
- Total em kilos
- Receita gerada
- Custo total
- Lucro obtido
- Margem de lucro (%)
- Indicador visual de lucratividade (verde/amarelo/vermelho)

## 🎯 Como Usar

### Passo 1: Cadastrar Custo dos Produtos
1. Acesse **Cadastro de Produtos**
2. Ao adicionar/editar produto, preencha:
   - **Preço de Venda**: Valor que você cobra (ex: R$ 16,00)
   - **Custo Unitário**: Valor que você paga (ex: R$ 13,50)
3. O sistema mostra automaticamente o lucro por unidade

### Passo 2: Acessar Relatório de Vendas
1. Na página inicial, clique no card **"Vendas"** (roxo)
2. Ou acesse diretamente `/vendas`

### Passo 3: Analisar os Dados
1. Escolha o período: 7 dias, 30 dias ou todos
2. Veja os cards de resumo no topo
3. Role para baixo para ver detalhes por produto
4. Produtos são ordenados por receita (maior para menor)

## 📊 Métricas Disponíveis

### Cards de Resumo

#### 1. Receita Total (Verde)
- Valor total recebido nas vendas
- Número de pedidos entregues
- Exemplo: "R$ 200,00 - 5 pedidos"

#### 2. Total em Kilos (Azul)
- Quantidade total vendida em kg
- Calculado automaticamente do tamanho do pacote
- Exemplo: "25.0 kg - Produtos vendidos"

#### 3. Custo Total (Vermelho)
- Quanto você investiu nos produtos vendidos
- Soma de todos os custos unitários
- Exemplo: "R$ 135,00 - Investimento"

#### 4. Lucro Líquido (Roxo)
- Quanto você realmente ganhou
- Receita - Custo
- Margem de lucro em %
- Exemplo: "R$ 65,00 - 32.5% margem"

### Detalhamento por Produto

Para cada produto, você vê:
- **Nome e tamanho do pacote**
- **Margem de lucro** (badge colorido):
  - 🟢 Verde: ≥ 30% (ótimo)
  - 🟡 Amarelo: 15-29% (bom)
  - 🔴 Vermelho: < 15% (atenção)
- **Quantidade vendida**: Número de unidades
- **Total em kilos**: Peso total vendido
- **Receita**: Valor total recebido
- **Custo**: Valor total investido
- **Lucro**: Ganho líquido

## 💡 Exemplo Prático

### Cenário
Você vende **Pão de Queijo 5kg**:
- Preço de venda: R$ 16,00
- Custo de compra: R$ 13,50
- Vendeu 10 unidades no mês

### Cálculos
- **Receita**: 10 × R$ 16,00 = R$ 160,00
- **Custo**: 10 × R$ 13,50 = R$ 135,00
- **Lucro**: R$ 160,00 - R$ 135,00 = R$ 25,00
- **Margem**: (R$ 25,00 / R$ 160,00) × 100 = 15,6%
- **Kilos**: 10 × 5kg = 50kg

### No Relatório
```
Pão de Queijo 5kg
[15.6% lucro] 🟡

Quantidade: 10x
Total em Kilos: 50.0 kg

Receita: R$ 160.00
Custo: R$ 135.00
Lucro: R$ 25.00
```

## 🔄 Integração com Sistema

### Dados Utilizados
1. **Pedidos Entregues**: Apenas pedidos com status "Entregue"
2. **Itens do Pedido**: Quantidade e preço unitário de venda
3. **Produtos**: Nome, tamanho, custo unitário
4. **Período**: Filtro por data do pedido

### Onde os Dados Vêm

#### Preço de Venda
- Definido no momento da criação do pedido
- Campo "Preço Unit." no modal "Novo Pedido"
- Pode variar por cliente/pedido
- **Este é o valor que você cobra do cliente**

#### Custo Unitário
- Cadastrado no produto
- Campo "Custo Unitário" no cadastro de produtos
- Valor fixo por produto
- **Este é o valor que você paga ao fornecedor**

#### Cálculo de Kilos
- Extraído do campo `tamanhoPacote`
- Busca padrão: "5kg", "1kg", etc.
- Se não encontrar, assume 1kg

## ⚠️ Avisos Importantes

### 1. Custo Não Cadastrado
Se você não cadastrar o custo dos produtos, o relatório mostrará:
- Custo Total: R$ 0,00
- Lucro Líquido = Receita Total (incorreto)
- Aviso amarelo na parte inferior

**Solução**: Cadastre o custo de cada produto

### 2. Preço de Venda Variável
O preço de venda pode variar por pedido:
- Cliente A: R$ 16,00
- Cliente B: R$ 15,00
- Cliente C: R$ 17,00

O relatório usa o preço real de cada venda.

### 3. Apenas Pedidos Entregues
- Pedidos pendentes não são contabilizados
- Pedidos cancelados são ignorados
- Apenas vendas confirmadas entram no cálculo

## 🎨 Interface

### Cores dos Cards
- 🟢 **Verde**: Receita (dinheiro entrando)
- 🔵 **Azul**: Kilos (volume de vendas)
- 🔴 **Vermelho**: Custo (dinheiro saindo)
- 🟣 **Roxo**: Lucro (ganho líquido)

### Indicadores de Margem
- 🟢 **Verde** (≥30%): Excelente lucratividade
- 🟡 **Amarelo** (15-29%): Boa lucratividade
- 🔴 **Vermelho** (<15%): Atenção, margem baixa

## 📁 Arquivos Modificados/Criados

### Novos Arquivos
1. `components/SalesReport.tsx` - Componente principal
2. `supabase/add-custo-produto.sql` - Script SQL para adicionar campo
3. `RELATORIO_VENDAS_LUCRO.md` - Esta documentação

### Arquivos Modificados
1. `types.ts` - Adicionado `custoUnitario` ao Produto
2. `App.tsx` - Adicionada rota `/vendas`
3. `components/Home.tsx` - Adicionado card "Vendas"
4. `components/Products.tsx` - Campo de custo no cadastro
5. `hooks/useAppData.ts` - Suporte a custo no CRUD

## 🗄️ Banco de Dados

### Nova Coluna
```sql
ALTER TABLE produtos 
ADD COLUMN custo_unitario DECIMAL(10, 2) DEFAULT 0;
```

### Executar Script
```bash
# No Supabase SQL Editor, execute:
supabase/add-custo-produto.sql
```

## 🔍 Consultas Úteis

### Ver produtos sem custo cadastrado
```sql
SELECT nome, preco_padrao, custo_unitario
FROM produtos
WHERE custo_unitario = 0 OR custo_unitario IS NULL;
```

### Ver margem de lucro dos produtos
```sql
SELECT 
  nome,
  preco_padrao,
  custo_unitario,
  preco_padrao - custo_unitario AS lucro_unitario,
  ROUND(((preco_padrao - custo_unitario) / preco_padrao * 100), 2) AS margem_lucro
FROM produtos
WHERE custo_unitario > 0
ORDER BY margem_lucro DESC;
```

### Vendas do mês atual
```sql
SELECT 
  p.nome,
  SUM(ip.quantidade) AS quantidade_vendida,
  SUM(ip.quantidade * ip.preco_unitario) AS receita,
  SUM(ip.quantidade * p.custo_unitario) AS custo,
  SUM(ip.quantidade * (ip.preco_unitario - p.custo_unitario)) AS lucro
FROM pedidos ped
JOIN itens_pedido ip ON ped.id = ip.pedido_id
JOIN produtos p ON ip.produto_id = p.id
WHERE ped.status = 'Entregue'
  AND ped.data >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY p.nome
ORDER BY receita DESC;
```

## 🎯 Casos de Uso

### 1. Análise de Lucratividade
**Objetivo**: Descobrir quais produtos dão mais lucro

**Como fazer**:
1. Acesse Relatório de Vendas
2. Selecione período (ex: 30 dias)
3. Veja produtos ordenados por receita
4. Observe a margem de lucro de cada um
5. Identifique produtos com margem baixa (vermelho)

**Ação**: Considere aumentar preço ou trocar fornecedor

### 2. Planejamento de Compras
**Objetivo**: Saber quanto investir em estoque

**Como fazer**:
1. Veja o "Custo Total" do período
2. Calcule média mensal
3. Use para planejar compras futuras

**Exemplo**: Se gastou R$ 1.350,00 em 30 dias, planeje ~R$ 1.500,00 para o próximo mês

### 3. Negociação com Fornecedor
**Objetivo**: Melhorar margem de lucro

**Como fazer**:
1. Identifique produtos com margem baixa
2. Veja quanto está pagando (custo)
3. Negocie desconto com fornecedor
4. Atualize o custo no sistema
5. Monitore melhoria na margem

### 4. Precificação Estratégica
**Objetivo**: Definir preços competitivos e lucrativos

**Como fazer**:
1. Cadastre custo de todos os produtos
2. Veja margem atual no relatório
3. Para produtos com margem baixa:
   - Opção A: Aumentar preço de venda
   - Opção B: Reduzir custo (negociar)
   - Opção C: Descontinuar produto

## ✅ Checklist de Implementação

- [x] Adicionar campo `custo_unitario` no banco
- [x] Atualizar tipo `Produto` no TypeScript
- [x] Criar componente `SalesReport`
- [x] Adicionar rota `/vendas` no App
- [x] Adicionar card na Home
- [x] Campo de custo no cadastro de produtos
- [x] Preview de lucro ao cadastrar
- [x] Carregar custo do banco no useAppData
- [x] Salvar custo ao criar/editar produto
- [x] Cálculos de lucro e margem
- [x] Filtros por período
- [x] Indicadores visuais de lucratividade
- [x] Documentação completa

## 🚀 Próximos Passos

1. **Executar o script SQL** no Supabase
2. **Cadastrar custos** dos produtos existentes
3. **Testar** criando novos pedidos
4. **Analisar** o relatório de vendas
5. **Ajustar preços** conforme necessário

## 📞 Suporte

Se tiver dúvidas sobre:
- Como cadastrar custos → Ver seção "Como Usar"
- Cálculos incorretos → Verificar se custos estão cadastrados
- Produtos não aparecem → Verificar se pedidos estão "Entregues"
- Kilos errados → Verificar formato do `tamanhoPacote`
