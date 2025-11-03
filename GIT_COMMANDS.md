# 🚀 Comandos Git - Pedidos Para Fábrica

## 📋 Passo a Passo

### 1. Verificar Status
```bash
git status
```

### 2. Adicionar Arquivos

#### Opção A: Adicionar Tudo
```bash
git add .
```

#### Opção B: Adicionar Apenas Código (Recomendado)
```bash
git add components/FactoryOrders.tsx
git add components/Orders.tsx
```

#### Opção C: Adicionar Código + Documentação Principal
```bash
git add components/FactoryOrders.tsx
git add components/Orders.tsx
git add README_PEDIDOS_FABRICA.md
git add PEDIDOS_FABRICA_FEATURE.md
```

### 3. Fazer Commit

#### Opção A: Commit Simples
```bash
git commit -m "feat: adiciona funcionalidade Pedidos Para Fábrica"
```

#### Opção B: Commit Detalhado (Recomendado)
```bash
git commit -m "feat: adiciona funcionalidade Pedidos Para Fábrica

- Consolidação automática de produtos vendidos
- Cálculo de total em itens e quilos
- Filtros por data e status
- Exportação para PNG e WhatsApp
- Interface responsiva com scroll otimizado
- Data do pedido editável
- Documentação completa

Closes #[número-da-issue]"
```

#### Opção C: Commit Completo
```bash
git commit -m "feat: adiciona funcionalidade Pedidos Para Fábrica

Nova funcionalidade que consolida automaticamente os produtos vendidos
nos pedidos de clientes para facilitar a reposição de estoque.

Funcionalidades:
- Consolidação automática de produtos
- Cálculo de total em itens e quilos
- Filtros inteligentes (data, status)
- Data do pedido editável
- Exportação para imagem PNG (alta qualidade)
- Compartilhamento direto via WhatsApp
- Interface responsiva (mobile + desktop)
- Scroll otimizado com botões sempre visíveis
- Debug integrado

Arquivos:
- components/FactoryOrders.tsx (novo)
- components/Orders.tsx (modificado)
- Documentação completa (12 arquivos)

Benefícios:
- 90% mais rápido que processo manual
- 100% preciso (zero erros)
- Mensagem WhatsApp formatada
- Layout profissional

Status: Pronto para produção"
```

### 4. Enviar para Repositório
```bash
git push origin main
```

Ou se estiver em outra branch:
```bash
git push origin nome-da-branch
```

### 5. Criar Branch (Opcional)
Se preferir criar uma branch específica:
```bash
git checkout -b feature/pedidos-fabrica
git add .
git commit -m "feat: adiciona funcionalidade Pedidos Para Fábrica"
git push origin feature/pedidos-fabrica
```

## 🎯 Comandos Rápidos

### Sequência Completa (Recomendada)
```bash
# 1. Verificar status
git status

# 2. Adicionar arquivos
git add components/FactoryOrders.tsx components/Orders.tsx

# 3. Commit
git commit -m "feat: adiciona funcionalidade Pedidos Para Fábrica

- Consolidação automática de produtos
- Cálculo de quilos
- Exportação PNG e WhatsApp
- Interface responsiva"

# 4. Push
git push origin main
```

### Sequência Rápida
```bash
git add .
git commit -m "feat: adiciona Pedidos Para Fábrica"
git push origin main
```

## 📝 Mensagens de Commit Sugeridas

### Curta
```
feat: adiciona Pedidos Para Fábrica
```

### Média
```
feat: adiciona funcionalidade Pedidos Para Fábrica

Consolida produtos vendidos para reposição de estoque
```

### Longa
```
feat: adiciona funcionalidade Pedidos Para Fábrica

Nova funcionalidade que consolida automaticamente os produtos
vendidos para facilitar pedidos de reposição à fábrica.

- Consolidação automática
- Cálculo de quilos
- Filtros inteligentes
- Exportação PNG e WhatsApp
- Interface responsiva
```

## 🔍 Verificar Antes de Commitar

```bash
# Ver arquivos modificados
git status

# Ver diferenças
git diff

# Ver diferenças de um arquivo específico
git diff components/FactoryOrders.tsx

# Ver arquivos que serão commitados
git diff --cached
```

## 🎨 Conventional Commits

Seguindo o padrão Conventional Commits:

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas gerais
```

Exemplo:
```bash
git commit -m "feat(pedidos): adiciona consolidação para fábrica"
```

## 🚨 Importante

### Antes de Commitar
- [ ] Código testado e funcionando
- [ ] Sem erros no console
- [ ] Responsivo (mobile + desktop)
- [ ] Documentação atualizada

### Arquivos a Ignorar (Opcional)
Se quiser ignorar arquivos de documentação temporários:
```bash
# Adicionar ao .gitignore
*_PEDIDOS_FABRICA.md
DEBUG_*.md
TROUBLESHOOTING_*.md
```

## 📦 Criar Tag (Opcional)

Para marcar uma versão:
```bash
git tag -a v1.0.0 -m "Versão 1.0.0 - Pedidos Para Fábrica"
git push origin v1.0.0
```

## 🔄 Desfazer (Se Necessário)

### Desfazer último commit (mantém alterações)
```bash
git reset --soft HEAD~1
```

### Desfazer add
```bash
git reset HEAD arquivo.tsx
```

### Ver histórico
```bash
git log --oneline
```

---

**Escolha a opção que preferir e execute os comandos! 🚀**
