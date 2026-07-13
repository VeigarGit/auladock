# 🧪 Exercício Prático: Sistema de Cadastro de Usuários com Docker

> **Disciplina:** Desenvolvimento Web / DevOps / Docker  
> **Nível:** Intermediário  
> **Duração sugerida:** 2 aulas práticas + lição de casa

---

## 🎯 Objetivo do Exercício

Criar uma aplicação web simples que permita **cadastrar usuários** com os seguintes campos:

- Nome completo
- Email
- Senha
- Confirmação de senha

Os dados devem ser armazenados em um **banco de dados MySQL** rodando em um **container Docker separado** da aplicação web.

---

## Requisitos Obrigatórios

### Funcionalidades da Aplicação Web

- [ ] Formulário de cadastro com os campos acima
- [ ] Validação de **confirmação de senha** (senha e confirmação devem ser iguais)
- [ ] Validação de email (formato válido)
- [ ] Senha deve ter no mínimo **6 caracteres**
- [ ] Armazenar a **senha de forma segura** (usar hash, nunca texto puro)
- [ ] Mensagens de erro amigáveis (ex: "Senhas não coincidem", "Email já cadastrado")
- [ ] Página de sucesso após cadastro

### Infraestrutura com Docker

- [ ] Aplicação web rodando em **um container**
- [ ] Banco de dados MySQL rodando em **outro container** (separado)
- [ ] Uso de **Docker Compose** para orquestrar os dois serviços
- [ ] Volume persistente para o banco de dados
- [ ] Variáveis de ambiente para configuração do banco

---

## Arquitetura Esperada

```
┌─────────────────────┐         ┌─────────────────────┐
│   Web App (Flask)   │ ◄─────► │   MySQL Database    │
│   (Porta 5000)      │         │   (Porta 3306)      │
│   Container 1       │         │   Container 2       │
└─────────────────────┘         └─────────────────────┘
```

---

## Tecnologias Sugeridas

| Componente       | Tecnologia Recomendada     | Alternativa          |
|------------------|----------------------------|----------------------|
| Aplicação Web    | Python + Flask             | Node.js + Express    |
| Banco de Dados   | MySQL                      | PostgreSQL           |
| Orquestração     | Docker Compose             | -                    |
| Hash de Senha    | `werkzeug.security`        | `bcrypt`             |

---

## Passos Recomendados para Realização

### 1. Criar a estrutura do projeto

```
exercicio-docker-cadastro/
├── app/
│   ├── app.py
│   ├── templates/
│   │   ├── cadastro.html
│   │   └── sucesso.html
│   └── requirements.txt
├── docker-compose.yml
├── Dockerfile
└── README.md

## O que deve ser entregue

1. Repositório no GitHub com todo o código
2. Arquivo `docker-compose.yml` funcional
3. Como rodar 
4. funcionar cadastro e login

## Critérios de Avaliação

| Critério                              | Peso | Descrição |
|---------------------------------------|------|---------|
| Funcionamento do Docker Compose       | 25%  | Ambos os containers sobem corretamente |
| Validação de confirmação de senha     | 20%  | Funciona corretamente no backend |
| Segurança da senha salva              | 15%  | Senha não é salva em texto puro |
| Organização do código                 | 15%  | Código limpo e bem estruturado |
| Persistência de dados                 | 10%  | Dados continuam após reiniciar containers |
| Documentação / README                 | 15%  | Instruções claras de como rodar |
