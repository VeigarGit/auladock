from flask import Flask, request, render_template, flash, redirect, url_for
from werkzeug.security import generate_password_hash
import mysql.connector
import os
import time

'''Na estrutura do gitub pede o app.py, como nao mostra um codigo separado para o database, penso que tenha de ser posto junto ao app.py (main) direto'''

app = Flask(__name__) #cria a variavel app e utiliza o flask pra fazer a conexao web, o name é pra adotar o nome doa rquivo atual
app.secret_key = 'key'

def conectar():
    host = os.getenv("DB_HOST", "db_final")
    for i in range(15):
        try:
            return mysql.connector.connect(
                host=host,
                user=os.getenv("DB_USER", "user_app"),
                password=os.getenv("DB_PASSWORD", "apppassword"),
                database=os.getenv("DB_NAME", "app_db")
            )
        except mysql.connector.Error:
            time.sleep(3)
    return mysql.connector.connect(
        host=host,
        user=os.getenv("DB_USER", "user_app"),
        password=os.getenv("DB_PASSWORD", "apppassword"),
        database=os.getenv("DB_NAME", "app_db")
    )

def criar_tabela():
    conexao = conectar()
    cursor = conexao.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL 
        )
    ''')
    conexao.commit()
    conexao.close()
    print(f'Database criado e inicializado com sucesso')

def inserir_usuario(nome,email,senha_hash):
    conexao = conectar()
    cursor = conexao.cursor()
    cursor.execute(
        '''INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)''',
        (nome, email, senha_hash)
    )
    conexao.commit()
    conexao.close()

@app.route('/')
def index():
    criar_tabela() 
    return render_template('cadastro.html')

@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    nome = request.form.get('nome')
    email = request.form.get('email')
    senha = request.form.get('senha')
    confirmacao = request.form.get('confirmacao')

    if len(senha) < 6:
        flash("Erro: A senha deve ter no mínimo 6 caracteres!")
        return redirect(url_for('index'))

    if senha != confirmacao:
        flash("Erro: As senhas não coincidem!")
        return redirect(url_for('index'))

    senha_hash = generate_password_hash(senha)

    try:
        inserir_usuario(nome, email, senha_hash) 
        return render_template('sucesso.html', nome_usuario=nome)
    except mysql.connector.IntegrityError:
        flash("Erro: Este email já está cadastrado no sistema!")
        return redirect(url_for('index'))
    except Exception as e:
        flash(f"Erro interno: {e}")
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
