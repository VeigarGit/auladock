# Sistema de Cadastro de Usuarios com Docker

Aplicação web para cadastro e login de usuarios, construida com Python/Flask e MySQL, orquestrada com Docker Compose.

## Funcionalidades

- Cadastro de usuarios (nome, email, senha)
- Validação de formulario (email valido, senha minima 6 caracteres, confirmação de senha)
- Senha armazenada com hash (werkzeug.security)
- Login com verificação de senha
- Mensagens de erro amigaveis
- Persistencia de dados via volume Docker

## Arquitetura

```
┌─────────────────────┐         ┌─────────────────────┐
│   Web App (Flask)   │ ◄─────► │   MySQL Database    │
│   (Porta 5000)      │         │   (Porta 3306)      │
│   Container 1       │         │   Container 2       │
└─────────────────────┘         └─────────────────────┘
```

## Estrutura do Projeto

```
exercicio-docker-cadastro/
├── app/
│   ├── app.py                 # App Flask principal
│   ├── pyproject.toml         # Dependencias do projeto
│   └── templates/
│       ├── cadastro.html      # Formulario de cadastro
│       ├── login.html         # Formulario de login
│       ├── sucesso.html       # Pos-cadastro
│       └── confirmacao.html   # Pos-login
├── docker-compose.yml         # Orquestracao dos containers
├── Dockerfile                 # Imagem da aplicacao
└── README.md
```

## Como Rodar

### Pre-requisitos

- Docker
- Docker Compose

### Iniciar a aplicacao

```bash
cd exercicio-docker-cadastro
docker compose up --build
```
> **Nota:** caso de falha de permissão, tente rodar com o super usuario: `sudo docker compose up --build`

A aplicacao fica disponivel em: **http://localhost:5000**

### Parar a aplicacao

```bash
docker compose down
```
ou simplesmente pressione **Ctrl+C** para interromper a aplicação

### Parar e apagar dados do banco

```bash
docker compose down -v
```

## Rotas

| Rota | Metodo | Descricao |
|------|--------|-----------|
| `/` | GET | Redireciona para /cadastro |
| `/cadastro` | GET/POST | Formulario de cadastro de novos usuarios |
| `/login` | GET/POST | Formulario de login |
| `/sucesso` | GET | Pagina de confirmacao apos cadastro |
| `/confirmacao` | GET | Pagina de confirmacao apos login |
| `/health` | GET | Health check da aplicacao |

## Tecnologias

- **Python 3.11** + **Flask** — backend
- **PyMySQL** — driver MySQL
- **werkzeug.security** — hash de senhas
- **MySQL 8.0** — banco de dados
- **Docker Compose** — orquestracao
