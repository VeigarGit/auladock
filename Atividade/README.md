# Sistema de Cadastro de Usuários com Docker

Sistema web de cadastro e login desenvolvido com **Python (Flask)**, **MySQL**, **Docker Compose** e **Bootstrap 5**.

## Funcionalidades
- Cadastro e login de usuários
- Validação de email e senha (mín. 6 caracteres)
- Hash seguro de senhas (`werkzeug.security`)
- Mensagens de erro amigáveis

## Tecnologias
| Backend | Frontend | Banco | Orquestração |
|---------|----------|-------|--------------|
| Flask   | Bootstrap 5 | MySQL 8.0 | Docker Compose |

## Como executar
```bash
docker-compose up -d --build
Acesse http://localhost:5000
Estrutura
app/
├── app.py               # Aplicação principal
├── requirements.txt
└── templates/           # cadastro.html, login.html, sucesso.html
docker-compose.yml
Dockerfile
README.md
Relato
O desenvolvimento foi um aprendizado intenso. O HTML com Bootstrap foi tranquilo por experiências anteriores. O backend em Flask exigiu mais trabalho, especialmente a integração com banco. Utilizei IA para corrigir alguns bugs de rota com o Docker.