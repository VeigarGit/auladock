FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app 

COPY requirements.txt /app/
RUN  pip install --no-cache-dir -r requirements.txt 

COPY app/ .

EXPOSE 5000 

RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

CMD ["python", "app.py"]    