# 🦙 Rodando LLMs com Docker usando Ollama

> **Exemplo prático e estável para aulas de Docker + IA**  
> Nível: Iniciante a Intermediário  
> Compatibilidade: Excelente (funciona com Docker Desktop e Docker Engine)

---

## 🎯 Objetivo da Aula

Ensinar os alunos a:
- Executar modelos de linguagem grandes (LLMs) de forma simples usando Docker
- Usar o **Ollama** dentro de containers
- Baixar e trocar entre diferentes modelos
- Interagir com o modelo via terminal e via API
- Entender as vantagens de usar Docker para rodar LLMs

---

## O que é o Ollama?

**Ollama** é uma ferramenta open-source que facilita muito a execução de modelos de IA localmente.  
Com ele é possível:

- Baixar modelos com um único comando
- Rodar LLMs de forma otimizada
- Usar via linha de comando ou API (compatível com OpenAI)
- Ter controle total sobre os modelos

Quando combinamos Ollama + Docker, ganhamos:
- Ambiente isolado e reprodutível
- Fácil de compartilhar com a turma
- Não precisa instalar nada além do Docker

---

## 1. Executando o Ollama com Docker

### Forma mais simples (docker run)

```bash
# Baixar a imagem oficial do Ollama
docker pull ollama/ollama

# Rodar o Ollama
docker run -d \
  --name ollama \
  -p 11434:11434 \
  ollama/ollama
```

### Forma recomendada: Usando Docker Compose

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

volumes:
  ollama_data:
```

Depois rode:

```bash
docker compose up -d
```

---

## 2. Baixando Modelos (dentro do container)

Depois que o Ollama estiver rodando, você precisa baixar um modelo.

### Comandos principais

```bash
# Entrar no container
docker exec -it ollama bash

# Baixar um modelo (exemplos)
ollama pull llama3.2          # Modelo recomendado para começar
ollama pull phi3:mini         # Modelo menor e rápido
ollama pull gemma2:2b         # Outro modelo leve e bom
ollama pull llama3.2:1b       # Versão bem pequena (ótima para testes)

# Ver modelos instalados
ollama list

# Sair do container
exit
```

> **Dica para a aula:** Comece com `llama3.2` ou `phi3:mini`. São modelos bons e não muito pesados.

---

## 3. Conversando com o Modelo

### Via terminal (dentro do container)

```bash
docker exec -it ollama ollama run llama3.2
```

Depois é só digitar suas perguntas normalmente.

Para sair, digite `/bye` ou pressione `Ctrl + D`.

### Via API (usando curl)

O Ollama expõe uma API compatível com OpenAI na porta `11434`.

Exemplo de requisição:

```bash
curl http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2",
    "prompt": "Explique o que é Docker de forma simples e curta.",
    "stream": false
  }'
```

Ou usando o formato chat:

```bash
curl http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2",
    "messages": [
      {"role": "user", "content": "Me diga 3 vantagens de usar Docker"}
    ]
  }'
```

---

## 4. Exercícios Práticos para os Alunos

### Nível Básico
1. Rode o Ollama com Docker Compose
2. Baixe o modelo `llama3.2`
3. Faça pelo menos 5 perguntas diferentes para o modelo
4. Use o comando `ollama list` para ver os modelos instalados

### Nível Intermediário
5. Baixe outro modelo (ex: `phi3:mini`) e compare a velocidade e qualidade das respostas
6. Interaja com o modelo usando `curl` (via API)
7. Pare e remova o container, depois suba novamente. O modelo continua lá? (por causa do volume)

### Nível Avançado
8. Crie um script simples (Python ou Bash) que envia várias perguntas automaticamente via API
9. Adicione uma interface web (ex: Open WebUI) usando Docker Compose
10. Teste rodar o Ollama com GPU (`--gpus all`)

---

## 5. Conceitos Importantes para Explicar

| Conceito              | Explicação                                                                 |
|-----------------------|----------------------------------------------------------------------------|
| **Modelo**            | Arquivo treinado que contém o "cérebro" da IA                              |
| **Parâmetros**        | Tamanho do modelo (ex: 3B = 3 bilhões de parâmetros)                       |
| **Quantização**       | Técnica para deixar o modelo menor e mais rápido                           |
| **API**               | Forma de "conversar" com o modelo por código                               |
| **Volume**            | Pasta persistente onde os modelos ficam salvos                             |
| **Docker Compose**    | Forma organizada de rodar vários containers juntos                         |

---

## Dicas para o Professor

- **Modelo recomendado para começar:** `llama3.2` ou `phi3:mini`
- Se algum aluno tiver computador com pouca RAM, use `llama3.2:1b` ou `phi3:mini`
- O volume `ollama_data` é muito importante — sem ele os modelos são perdidos quando o container é removido
- Este exemplo é excelente para mostrar **persistência de dados** com volumes
- Ollama é atualmente uma das formas mais usadas no mercado para rodar LLMs localmente

---

## Extensões da Aula (próximos passos)

- Adicionar **Open WebUI** (interface bonita tipo ChatGPT)
- Rodar Ollama com GPU
- Criar uma aplicação que usa o Ollama via API (ex: chatbot simples)
- Comparar Ollama vs Docker Model Runner vs LM Studio
- Fazer deploy do Ollama em um servidor

---

## Comandos Úteis

```bash
# Ver status do container
docker ps

# Ver logs do Ollama
docker logs -f ollama

# Parar o Ollama
docker compose down

# Parar e remover tudo (inclusive os modelos)
docker compose down -v
```

---

**Material livre para uso em aulas.**  
Adapte os modelos e exercícios conforme o tempo e o nível da turma.

Boa aula! 🦙 + 🐳
