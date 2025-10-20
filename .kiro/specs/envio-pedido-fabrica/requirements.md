# Requirements Document

## Introduction

Esta funcionalidade permite que o usuário, após registrar uma entrada de estoque (que representa um pedido para a fábrica), possa enviar essa lista de produtos para a fábrica através de múltiplos canais: WhatsApp (texto), imagem PNG ou PDF. Isso facilita a comunicação com a fábrica sobre quais produtos precisam ser produzidos e em quais quantidades.

## Requirements

### Requirement 1: Confirmação de Entrada Registrada

**User Story:** Como administrador, eu quero ver uma confirmação visual após registrar uma entrada de estoque, para que eu saiba que a operação foi bem-sucedida e possa decidir se quero enviar para a fábrica.

#### Acceptance Criteria

1. WHEN o usuário clica em "Registrar Entrada" no modal THEN o sistema deve processar a entrada
2. WHEN a entrada é registrada com sucesso THEN o sistema deve mostrar um modal de confirmação
3. WHEN o modal de confirmação é exibido THEN deve mostrar a lista de produtos registrados com suas quantidades
4. WHEN o modal de confirmação é exibido THEN deve mostrar o fornecedor informado
5. WHEN o modal de confirmação é exibido THEN deve mostrar a data/hora do registro

### Requirement 2: Opções de Envio para Fábrica

**User Story:** Como administrador, eu quero ter múltiplas opções para enviar o pedido para a fábrica, para que eu possa escolher o método mais conveniente dependendo da situação.

#### Acceptance Criteria

1. WHEN o modal de confirmação é exibido THEN deve mostrar 3 botões de envio: WhatsApp, Imagem e PDF
2. WHEN o usuário clica em "WhatsApp" THEN deve abrir o WhatsApp com mensagem formatada
3. WHEN o usuário clica em "Salvar Imagem" THEN deve baixar uma imagem PNG do pedido
4. WHEN o usuário clica em "Exportar PDF" THEN deve baixar um PDF do pedido
5. WHEN o usuário não quer enviar THEN deve ter opção de "Fechar" ou "Concluir"

### Requirement 3: Formatação da Mensagem WhatsApp

**User Story:** Como administrador, eu quero que a mensagem do WhatsApp seja clara e profissional, para que a fábrica entenda exatamente o que precisa produzir.

#### Acceptance Criteria

1. WHEN a mensagem é gerada THEN deve incluir título "PEDIDO PARA FABRICA - MANA"
2. WHEN a mensagem é gerada THEN deve incluir data e hora do pedido
3. WHEN a mensagem é gerada THEN deve incluir fornecedor
4. WHEN a mensagem é gerada THEN deve listar cada produto com nome, tamanho e quantidade
5. WHEN a mensagem é gerada THEN deve incluir total de produtos e total de unidades
6. WHEN a mensagem é gerada THEN deve usar formatação Markdown (negrito) sem emojis
7. WHEN a mensagem é gerada THEN deve usar %0A para quebras de linha (compatibilidade WhatsApp)

### Requirement 4: Geração de Imagem

**User Story:** Como administrador, eu quero exportar o pedido como imagem, para que eu possa compartilhar facilmente em grupos do WhatsApp ou outras plataformas.

#### Acceptance Criteria

1. WHEN o usuário clica em "Salvar Imagem" THEN deve capturar o conteúdo visual do pedido
2. WHEN a imagem é gerada THEN deve ter alta qualidade (escala 2x)
3. WHEN a imagem é gerada THEN deve incluir logo/cabeçalho "MANÁ"
4. WHEN a imagem é gerada THEN deve incluir data e hora
5. WHEN a imagem é gerada THEN deve listar todos os produtos com quantidades
6. WHEN a imagem é gerada THEN deve incluir totais
7. WHEN a imagem é baixada THEN o nome do arquivo deve ser "pedido-fabrica-mana-[timestamp].png"

### Requirement 5: Geração de PDF

**User Story:** Como administrador, eu quero exportar o pedido como PDF, para que eu possa enviar por email ou imprimir para documentação.

#### Acceptance Criteria

1. WHEN o usuário clica em "Exportar PDF" THEN deve gerar um documento PDF
2. WHEN o PDF é gerado THEN deve estar em formato A4
3. WHEN o PDF é gerado THEN deve incluir cabeçalho com logo "MANÁ"
4. WHEN o PDF é gerado THEN deve incluir data e hora
5. WHEN o PDF é gerado THEN deve listar todos os produtos com quantidades
6. WHEN o PDF é gerado THEN deve incluir totais
7. WHEN o PDF é baixado THEN o nome do arquivo deve ser "pedido-fabrica-mana-[timestamp].pdf"

### Requirement 6: Conteúdo do Pedido

**User Story:** Como administrador, eu quero que o pedido mostre todas as informações relevantes, para que a fábrica tenha todos os dados necessários para produção.

#### Acceptance Criteria

1. WHEN o pedido é exibido THEN deve mostrar o título "PEDIDO PARA FÁBRICA"
2. WHEN o pedido é exibido THEN deve mostrar data e hora formatadas (dd/mm/aaaa HH:mm)
3. WHEN o pedido é exibido THEN deve mostrar o fornecedor
4. WHEN o pedido é exibido THEN deve listar cada produto com:
   - Nome do produto
   - Tamanho do pacote
   - Quantidade solicitada
5. WHEN o pedido é exibido THEN deve mostrar total de tipos de produtos
6. WHEN o pedido é exibido THEN deve mostrar total de unidades
7. WHEN há múltiplos produtos THEN devem estar ordenados alfabeticamente

### Requirement 7: Experiência do Usuário

**User Story:** Como administrador, eu quero que o processo de envio seja rápido e intuitivo, para que eu não perca tempo com operações complexas.

#### Acceptance Criteria

1. WHEN o modal de confirmação abre THEN deve ter animação suave
2. WHEN o usuário clica em um botão de exportação THEN deve mostrar feedback visual (loading)
3. WHEN a exportação é concluída THEN deve mostrar mensagem de sucesso
4. WHEN ocorre um erro THEN deve mostrar mensagem de erro clara
5. WHEN o usuário fecha o modal THEN deve retornar à página de estoque
6. WHEN o modal está aberto THEN deve ser possível fechar clicando fora ou no botão X

### Requirement 8: Responsividade

**User Story:** Como administrador, eu quero que a funcionalidade funcione bem em mobile e desktop, para que eu possa enviar pedidos de qualquer dispositivo.

#### Acceptance Criteria

1. WHEN visualizado em mobile THEN o modal deve ocupar a tela toda
2. WHEN visualizado em mobile THEN os botões devem ser grandes e fáceis de tocar
3. WHEN visualizado em desktop THEN o modal deve ter largura máxima adequada
4. WHEN visualizado em desktop THEN deve ter espaçamento confortável
5. WHEN a imagem/PDF é gerada THEN deve ter layout responsivo adequado

### Requirement 9: Integração com Sistema Existente

**User Story:** Como desenvolvedor, eu quero que a funcionalidade se integre perfeitamente com o fluxo existente, para que não quebre funcionalidades atuais.

#### Acceptance Criteria

1. WHEN a entrada é registrada THEN deve continuar atualizando o estoque normalmente
2. WHEN o modal de confirmação é fechado THEN o modal de entrada deve fechar também
3. WHEN o usuário não quer enviar THEN deve poder fechar e continuar usando o sistema
4. WHEN há erro no envio THEN não deve afetar o registro da entrada (já foi salvo)
5. WHEN o componente é montado THEN deve usar os mesmos hooks e contextos existentes

### Requirement 10: Validações e Edge Cases

**User Story:** Como administrador, eu quero que o sistema lide bem com situações especiais, para que não tenha surpresas ou erros inesperados.

#### Acceptance Criteria

1. WHEN não há produtos na entrada THEN não deve mostrar modal de confirmação
2. WHEN há apenas 1 produto THEN deve mostrar "1 produto" (singular)
3. WHEN há múltiplos produtos THEN deve mostrar "X produtos" (plural)
4. WHEN o fornecedor está vazio THEN deve mostrar "Não informado"
5. WHEN a exportação falha THEN deve permitir tentar novamente
6. WHEN o WhatsApp não está instalado THEN deve abrir WhatsApp Web
7. WHEN o navegador bloqueia download THEN deve mostrar mensagem orientando o usuário

## Non-Functional Requirements

### Performance
- A geração de imagem deve levar menos de 3 segundos
- A geração de PDF deve levar menos de 5 segundos
- O modal deve abrir em menos de 300ms

### Usabilidade
- Interface intuitiva e auto-explicativa
- Feedback visual claro em todas as ações
- Mensagens de erro amigáveis

### Compatibilidade
- Funcionar em Chrome, Firefox, Safari e Edge
- Funcionar em Android e iOS
- Funcionar em WhatsApp Web e WhatsApp App

### Segurança
- Processamento local (sem envio de dados para servidores externos)
- Dados sensíveis não devem ser expostos nas URLs

## Success Criteria

1. Usuário consegue enviar pedido para fábrica via WhatsApp em menos de 10 segundos
2. Imagem gerada tem qualidade suficiente para ser legível quando compartilhada
3. PDF gerado pode ser impresso sem perda de qualidade
4. Taxa de erro menor que 1%
5. Feedback positivo dos usuários sobre a facilidade de uso
