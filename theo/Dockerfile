# syntax=docker/dockerfile:1
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copia dependências primeiro (aproveita cache de camadas)
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código do app
COPY app/ .

EXPOSE 5000

# Usuário não-root por segurança
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

CMD ["python", "app.py"]
