# Sistema de Cadastro de Usuários

Um sistema simples para cadastro, consulta, atualização e remoção de usuários, utilizando Docker para facilitar a configuração e execução do ambiente.

## Tecnologias Utilizadas

* Docker
* Docker Compose
* Backend (ex.: Python,Flask e Pymongo)
* Banco de Dados (MongoDb)
* API REST

##Estrutura do Projeto

```text
├───app
│   ├───controllers
│   ├───entidade
│   ├───infra
│   ├───static
|   ├───templates
│   └───app.py
|───docker-compose.yaml
|───requirements.txt
└── README.md
```

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

* Docker
* Docker Compose 

## Como Executar o Projeto
1. Clone este repositório:

```bash
git clone
```
2. Acesse a pasta do projeto:
```bash
cd sistema-cadastro-usuarios
```
3. Inicie os containers:
```bash
docker compose up -d
```
4. Verifique se os containers estão em execução:
```bash
docker ps
```
## Acesso 

Após iniciar os containers, a aplicação estará disponível em:

```text
http://localhost:5080
```


## Comandos Úteis

### Iniciar os containers

```bash
docker compose up -d
```

### Parar os containers

```bash
docker compose down
```

### Reconstruir as imagens

```bash
docker compose up --build
```

### Visualizar os logs

```bash
docker compose logs -f
```

## Funcionalidades

* Cadastro de usuários
* Listagem de usuários
* Atualização de dados
* Persistência dos dados em banco de dados
* Comunicação entre a API e Banco a partir da mesma rede
