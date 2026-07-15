# Sistema de Cadastro de Usuários com Flask e MySQL

Este é um sistema de cadastro de usuários seguro e robusto desenvolvido em Python utilizando o framework Flask e banco de dados MySQL (pymysql). O projeto foi desenhado focando em validações em camadas no backend e uma interface limpa, moderna e minimalista para o usuário.

# Decisões de Arquitetura e Validações

Durante o desenvolvimento, optei por caminhos de design simple para demonstrar boas práticas de engenharia de software:
 1. Uso de HTML Básico com Auxílio de IA

 Em vez de adotar motores de template complexos ou sintaxes proprietárias de frameworks, o projeto utiliza a estrutura mais básica e estática de HTML para a interface. Com o auxílio de inteligência artificial, foi estruturado um modelo de fluxo onde o próprio Python gerencia as respostas diretamente para esse HTML básico, mantendo o frontend independente e limpo.

 2. Validação e Resposta de Erros Direta em HTML

 O backend intercepta as falhas de validação e interrompe o fluxo retornando strings com marcação HTML puras diretamente para o navegador (return "<h2>Erro:...</h2>"). Isso garante que o usuário receba feedbacks claros e links de retorno mesmo utilizando páginas estáticas.

 3. Sanitização de Dados com .strip()

 O backend em Python valida rigorosamente as entradas utilizando o método .strip(). Isso remove espaços em branco inúteis e impede que usuários ou robôs burlem o sistema enviando dados obrigatórios compostos apenas por espaços pressionados no teclado.
 
 4. Recurso de Login como Complemento de Melhoria

 Como complemento e evolução futura do ecossistema, o código de login foi estruturado e protegido por criptografia de Hash (check_password_hash).

  -  Como Utilizar: Para manter o escopo principal intacto, a rota /login foi isolada no código do app.py utilizando aspas triplas ("""), funcionando como um comentário multilinha. O arquivo login.html já está salvo na pasta de templates. Caso queira implementar e ativar a funcionalidade no código ativo, basta remover as aspas triplas iniciais e finais no arquivo app.py.

# Identidade Visual da Interface

A identidade visual, a paleta de cores e a organização do layout das telas (Cadastro, Sucesso e a futura tela de Login) foram pesquisadas e desenvolvidas com o auxílio de inteligência artificial. O objetivo foi alcançar uma estética profissional, limpa e minimalista através do CSS puro, utilizando sombreamentos suaves, cantos arredondados e a integração com a biblioteca Font Awesome para a inclusão de ícones estruturados dentro dos campos de texto.

# Estrutura do Projeto


 📂 seu-projeto/
 ├── 📄 app.py               # Código principal do Flask (Backend e Validações)
 ├── 📄 requirements.txt     # Dependências estritas do projeto (Flask, PyMySQL, etc)
 ├── 📄 Dockerfile           # Instruções de build da imagem do container Flask
 ├── 📄 docker-compose.yml   # Orquestração dos containers da aplicação e do banco de dados
 └── 📂 templates/           # Páginas visuais em HTML estático básico
    ├── 📄 cadastro.html    # Tela de cadastro com padrão visual desenvolvido via IA
    ├── 📄 sucesso.html     # Tela de confirmação com feedback de sucesso
    └── 📄 login.html       # Tela de login pronta para implementação futura

# Rotas da Aplicação

    GET /cadastro: Renderiza a tela limpa do formulário de cadastro.

    POST /cadastro: Processa o formulário, realiza as validações, e insere o hash criptografado no banco de dados.

    GET /sucesso: Página após um cadastro realizado, ressaltando que a operação foi um sucesso.

    GET/POST /login [OPCIONAL]: Rota comentada pronta para autenticar usuários verificando as senhas que foram criptografadas que ja foram salvas no banco. 

# Segurança Aplicada

    As senhas nunca são salvas em texto limpo. O sistema utiliza a biblioteca werkzeug.security para gerar e validar hashes criptográficos seguros.O banco de dados cria a tabela automaticamente na inicialização (init()) com regras de integridade como NOT NULL e UNIQUE para o e-mail.


# Como Rodar o Projeto com Docker

Este projeto está totalmente configurado para rodar de forma isolada e simplificada utilizando o **Docker** e o **Docker Compose**. Com apenas um comando, o banco de dados MySQL e a aplicação Flask serão configurados e conectados automaticamente.

# Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

[Docker](https://www.docker.com/products/docker-desktop/)

[Docker Compose](https://docs.docker.com/compose/install/) (geralmente já vem embutido no Docker Desktop)

# Como executar a aplicação

1. **Abra o terminal** na pasta raiz do projeto (onde estão os arquivos `Dockerfile` e `docker-compose.yml`).

2. **Inicie os containers** com o seguinte comando:
   cd arquivo do projeto 
   sudo docker compose up --build 
   sudo docker compose up 

So utilizei o sudo pq estou rodando no linux como administrador, mas acredit que não seja necessário rodar com o comando sudo. 