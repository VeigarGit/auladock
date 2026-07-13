 📊 Monitoramento com Grafana + Prometheus + Node Exporter

> **Exemplo prático de monitoramento do computador usando Docker**  
> Nível: Intermediário  
> Foco: Observabilidade, métricas e dashboards

---

## 🎯 Objetivo da Aula

Ensinar os alunos a:
- Monitorar o computador (host) que está rodando Docker
- Coletar métricas de CPU, memória, disco e rede
- Usar **Prometheus** para armazenar métricas
- Visualizar tudo de forma bonita no **Grafana**
- Entender o conceito de **observabilidade**

---

## Por que monitorar o computador com Docker?

Vantagens pedagógicas:

- Os alunos conseguem **ver em tempo real** o que está acontecendo na máquina deles
- É uma introdução excelente ao mundo de **DevOps / SRE**
- Mostra como ferramentas modernas de monitoramento funcionam
- Fácil de configurar com Docker Compose

---

## Stack que vamos usar

| Ferramenta       | Função                                      | Porta   |
|------------------|---------------------------------------------|---------|
| **Node Exporter**    | Coleta métricas do computador (host)        | 9100    |
| **Prometheus**       | Armazena e consulta as métricas             | 9090    |
| **Grafana**          | Cria dashboards bonitos e visualizações     | 3000    |

---

## 3. Subindo o Stack

```bash
# Subir todos os serviços
docker compose up -d

# Verificar se está tudo rodando
docker compose ps
```

---

## 4. Acessando as Ferramentas

Depois de subir, acesse:

| Ferramenta     | Endereço                    | Login                  |
|----------------|-----------------------------|------------------------|
| **Grafana**    | http://localhost:3000       | admin / admin          |
| **Prometheus** | http://localhost:9090       | -                      |
| **Node Exporter** | http://localhost:9100/metrics | -                   |

---

## 5. Configurando o Grafana (Passo a passo)

1. Acesse o Grafana (`http://localhost:3000`)
2. Faça login com `admin` / `admin`
3. Vá em **Connections → Data sources → Add data source**
4. Escolha **Prometheus**
5. Em **URL** coloque: `http://prometheus:9090`
6. Clique em **Save & Test**

### Importando um Dashboard Pronto (Recomendado)

O dashboard mais usado para monitorar o computador é o **Node Exporter Full**:

1. No Grafana, vá em **Dashboards → Import**
2. No campo **Import via grafana.com**, digite o ID: **`1860`**
3. Clique em **Load**
4. Selecione o data source **Prometheus**
5. Clique em **Import**

Pronto! Você terá um dashboard completo com CPU, Memória, Disco, Rede, etc.