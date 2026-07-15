# Cadastro de Usuários

Aplicação web de cadastro de usuários desenvolvida com Flask e MySQL, orquestrada com Docker Compose.

## Pré-requisitos

- Docker
- Docker Compose

## Estrutura do Projeto

```
tarefa/
├── app/
│   ├── app.py              # Aplicação Flask (rotas e lógica)
│   ├── requirements.txt    # Dependências Python
│   ├── templates/          # Templates HTML (cadastro, sucesso)
│   └── static/             # CSS e imagens
├── db/
│   └── init.sql            # Script de inicialização do banco
├── Dockerfile              # Build da imagem da aplicação
└── docker-compose.yml      # Orquestração dos serviços
```

## Como Executar

```bash
docker compose up
```

Acesse a aplicação em: **http://localhost:5000**

Para parar os containers:

```bash
docker compose down
```

## Serviços

| Serviço | Imagem | Porta |
|---------|--------|-------|
| web | Build customizado (Python 3.11 + Flask) | 5000 |
| db | mysql:8.0 | 3306 |

## Variáveis de Ambiente

**Aplicação (web):**

| Variável | Valor padrão |
|----------|--------------|
| DB_HOST | db |
| DB_USER | usuario |
| DB_PASSWORD | senha123 |
| DB_NAME | cadastro |
| FLASK_ENV | development |

**Banco de dados (db):**

| Variável | Valor padrão |
|----------|--------------|
| MYSQL_ROOT_PASSWORD | root123 |
| MYSQL_DATABASE | cadastro |
| MYSQL_USER | usuario |
| MYSQL_PASSWORD | senha123 |
