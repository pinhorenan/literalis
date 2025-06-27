# Requisitos v0.1.0 (rascunho)

## 1. Autenticação e Sessão

\| **AUTH-001** | Permitir que novos usuários se cadastrem com **nome de usuário**, **nome**, **e-mail**, **senha** (mínimo 6 caracteres) e, opcionalmente, **avatar** e **biografia**.
\| **AUTH-002** | Autenticar usuários através de credenciais (nome de usuário + senha) e manter sessão válida enquanto não expirar.
\| **AUTH-003** | Permitir que o usuário altere sua senha informando a **senha atual** antes de definir a nova, e registrar data da última alteração.
\| **AUTH-004** | Proteger todas as funcionalidades que exigem usuário logado; cada usuário só pode alterar seus próprios dados (até novas regras de permissão).

## 2. Perfil de Usuário e Rede Social

\| **USER-001** | Exibir perfil de qualquer usuário, mostrando **posts públicos**, **seguidores**, **seguindo** e **entradas públicas da estante**.
\| **USER-002** | Permitir que o usuário edite seu **nome**, **avatar**, **biografia** e, possivelmente, **email** e **username,** que irão exigir verificação (**username** é **identificador**, e **email** deve ser email mesmo).
\| **USER-003** | Habilitar ação de **seguir / deixar de seguir** outro usuário, atualizando imediatamente contagens e status, isso poderá ser feito com o uso de contextos.
\| **USER-004** | Oferecer busca de usuários por nome ou nome de usuário, retornando uma lista filtrada conforme o termo.
\| **USER-005** | Na interface, indicar se o usuário logado já segue ou não cada perfil apresentado.

## 3. Livro

\| **BOOK-001** | Considerar que o catálogo de livros já existe; não incluir operações de criação ou edição de livros nesta fase.
\| **BOOK-002** | Fornecer busca de livros para preenchimento automático, sugerindo correspondências conforme o texto digitado.
\| **BOOK-003** | Usar o número total de páginas do livro como referência única para cálculo de progresso de leitura.

## 4. Estante de Leitura

\| **SHELF-001** | Permitir adicionar um livro à estante com progresso inicial de **0 páginas lidas** e status **“A ler”**.
\| **SHELF-002** | Permitir atualizar progresso de leitura (página atual), status de leitura (por exemplo: A ler, Lendo, Concluído) e avaliação (nota de 0 a 10).
\| **SHELF-003** | Permitir marcar cada entrada como **privada**, ocultando-a de outros usuários.
\| **SHELF-004** | Implementar remoção lógica de entradas (possibilidade de excluir sem perder histórico).
\| **SHELF-005** | Exibir em cada entrada o progresso percentual calculado a partir do total de páginas.

## 5. Posts de Progresso

\| **POST-001** | Permitir criar um post vinculado a uma entrada da própria estante, registrando página atual, progresso e avaliação opcional, o post fará snapshot as informações no momento em que foi criado.
\| **POST-002** | Após publicação, permitir ao autor editar apenas o conteúdo do texto, a página atual e a avaliação.
\| **POST-003** | Exibir feed “Amigos” (posts de quem sigo) e feed “Descobrir” (posts de quem não sigo), podendo ordenar por data de publicação, e número de likes.
\| **POST-004** | Em cada post, mostrar as três últimas respostas (comentários) e permitir carregar todas as demais via botão “Ver mais”.
\| **POST-005** | Permitir “curtir” e “descurtir” posts, exibindo contagem total de curtidas e lista de quem curtiu, ordenada do mais recente ao mais antigo.
\| **POST-006** | Permitir que o autor o post possa excluir ou ocultar comentários de outros usuários no seu post.

## 6. Comentários

\| **COM-001** | Permitir adicionar comentário (até 1.000 caracteres) em qualquer post.
\| **COM-002** | Permitir que o autor de um comentário exclua ou edite seu próprio texto, atualizando data da última edição.
\| **COM-003** | Permitir “curtir” e “descurtir” comentários, com contagem e lista de usuários que curtiram.
\| **COM-004** | Disponibilizar listagem completa de todos os comentários de um post, em ordem cronológica.

## 7. Notificações (Planejado)

\| **NOT-001** | Gerar notificações quando: alguém seguir você; alguém curtir seu post ou comentário; alguém comentar seu post.
\| **NOT-002** | Apresentar lista de notificações do usuário, do mais recente ao mais antigo, e permitir marcar cada item como lido.
\| **NOT-003** | Incluir em cada notificação quem foi a pessoa que gerou o evento, o tipo de evento e referência ao post ou comentário afetado.

## 8. Ação de Seguir

\| **FOL-001** | Unificar criar e remover seguimento em um único comando, garantindo comportamento idempotente.
\| **FOL-002** | Listar seguidores e seguindo, sempre atualizados e ordenados do mais recente para o mais antigo.

##

## 9. Busca Global

\| **SRCH-001** | Disponibilizar busca única que retorne **livros** e **usuários** correspondentes ao termo pesquisado.
\| **SRCH-002** | Na interface, separar resultados em abas “Livros” e “Usuários” para facilitar a navegação.

## 10. Regras Transversais

- **Paginação**: todos os feeds, listas de comentários, notificações e listas de seguidores usam paginação baseada em cursor (por data/criação + identificador).
- **Ordenação**: padrão decrescente por data de criação, exceto quando for necessário ordem cronológica crescente (e.g., comentários completos).
- **Validação de Dados**: todos os dados de entrada devem ser validados quanto a padrões, formatos e limites aceitáveis.
- **Campos Derivados**: progresso (%) e contagens (curtidas, seguidores etc.) são calculados dinamicamente, não armazenados duplicadamente.
- **Privacidade**: marcar itens como privados impede exposição indevida em todas as exibições.
- **Soft-delete**: entradas de estante e outros elementos removidos permanecem ocultos sem exclusão definitiva, permitindo auditoria.
- **Tratamento de Erros**: respostas de erro seguem formato padrão com mensagem descritiva e código HTTP apropriado (>=400).
