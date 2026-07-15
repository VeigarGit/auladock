import os
import re
import time

import pymysql
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "db"),
    "user": os.getenv("DB_USER", "cadastro_user"),
    "password": os.getenv("DB_PASSWORD", "cadastro_pass"),
    "database": os.getenv("DB_NAME", "cadastro_db"),
    "port": int(os.getenv("DB_PORT", 3306)),
}


def get_db():
    return pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)


def init_db():
    for attempt in range(10):
        try:
            conn = get_db()
            with conn.cursor() as cursor:
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS usuarios (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        senha_hash VARCHAR(255) NOT NULL,
                        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
            conn.commit()
            conn.close()
            print("Banco de dados inicializado com sucesso!")
            return
        except pymysql.OperationalError:
            print(f"Tentativa {attempt + 1}/10 - Aguardando MySQL...")
            time.sleep(3)
    print("ERRO: Nao foi possivel conectar ao banco de dados.")


def validar_email(email):
    padrao = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(padrao, email) is not None


@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    erros = {}

    if request.method == 'POST':
        nome = request.form.get('nome', '').strip()
        email = request.form.get('email', '').strip()
        senha = request.form.get('senha', '')
        confirmar = request.form.get('confirmar_senha', '')

        if not nome:
            erros['nome'] = 'Nome obrigatório.'
        if not email:
            erros['email'] = 'Email obrigatório.'
        elif not validar_email(email):
            erros['email'] = 'Formato de email inválido.'
        if len(senha) < 6:
            erros['senha'] = 'A senha deve ter no mínimo 6 caracteres.'
        if senha != confirmar:
            erros['confirmar_senha'] = 'Senhas não coincidem.'

        if not erros:
            try:
                conn = get_db()
                with conn.cursor() as cursor:
                    cursor.execute(
                        "SELECT id FROM usuarios WHERE email = %s", (email,)
                    )
                    if cursor.fetchone():
                        erros['email'] = 'Email já cadastrado.'
                    else:
                        senha_hash = generate_password_hash(senha)
                        cursor.execute(
                            "INSERT INTO usuarios (nome, email, senha_hash) VALUES (%s, %s, %s)",
                            (nome, email, senha_hash),
                        )
                        conn.commit()
                        conn.close()
                        return redirect(url_for('sucesso'))
                conn.close()
            except pymysql.OperationalError:
                erros['geral'] = 'Erro ao conectar com o banco de dados. Tente novamente.'

    return render_template('cadastro.html', erros=erros, dados=request.form if request.method == 'POST' else {})


@app.route('/sucesso')
def sucesso():
    return render_template('sucesso.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    erros = {}

    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        senha = request.form.get('senha', '')

        if not email:
            erros['email'] = 'Email obrigatório.'
        elif not validar_email(email):
            erros['email'] = 'Formato de email inválido.'
        if not senha:
            erros['senha'] = 'Senha obrigatória.'

        if not erros:
            try:
                conn = get_db()
                with conn.cursor() as cursor:
                    cursor.execute(
                        "SELECT nome, senha_hash FROM usuarios WHERE email = %s", (email,)
                    )
                    usuario = cursor.fetchone()
                conn.close()

                if usuario and check_password_hash(usuario['senha_hash'], senha):
                    return render_template('confirmacao.html', nome=usuario['nome'])
                else:
                    erros['geral'] = 'Email ou senha incorretos.'
            except pymysql.OperationalError:
                erros['geral'] = 'Erro ao conectar com o banco de dados. Tente novamente.'

    return render_template('login.html', erros=erros, dados=request.form if request.method == 'POST' else {})


@app.route('/health')
def health():
    return {"status": "ok"}


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
