import os
from flask import Flask, render_template, request, redirect, url_for
from werkzeug.security import generate_password_hash
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'db'),
        user=os.environ.get('DB_USER', 'usuario'),
        password=os.environ.get('DB_PASSWORD', 'senha123'),
        database=os.environ.get('DB_NAME', 'cadastro')
    )

@app.route('/')
def home():
    return render_template('cadastro.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    nome = request.form.get('nome')
    email = request.form.get('email')
    senha = request.form.get('senha')
    csenha = request.form.get('csenha')

    erros = []
    if senha != csenha:
        erros.append('Senhas não coincidem')
    if len(senha) < 6:
        erros.append('Senha deve ter no mínimo 6 caracteres')
    if '@' not in email or '.' not in email:
        erros.append('Email inválido')

    if erros:
        return render_template('cadastro.html', errors=erros, nome=nome, email=email)

    senha_hash = generate_password_hash(senha)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
        if cursor.fetchone():
            erros.append('Email já cadastrado')
            cursor.close()
            conn.close()
            return render_template('cadastro.html', errors=erros, nome=nome, email=email)

        cursor.execute(
            "INSERT INTO usuarios (nome, email, senha_hash) VALUES (%s, %s, %s)",
            (nome, email, senha_hash)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Error as e:
        erros.append('Erro ao cadastrar. Tente novamente.')
        return render_template('cadastro.html', errors=erros, nome=nome, email=email)

    return redirect(url_for('sucesso'))

@app.route('/sucesso')
def sucesso():
    return render_template('sucesso.html')

if __name__=='__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)