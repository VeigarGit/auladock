# syntax=docker/dockerfile:1
FROM python:3.11-slim

WORKDIR /app

# Instala dependências primeiro (melhor cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia apenas o código necessário e os templates html
COPY app.py .
COPY templates/ templates/

EXPOSE 5000

# Usuário não-root (boa prática de segurança)
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

CMD ["python3", "app.py"]