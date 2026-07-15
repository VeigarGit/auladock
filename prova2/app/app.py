from flask import Flask, render_template, request, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import pymysql
import os

app = Flask(__name__) 
app.config['SECRET_KEY'] = 'uma_chave_segura' 

def connect(): 
    return pymysql.connect(
        host='db',
        user='root',
        password='senha_segura',
        database='cadastro_db',
        cursorclass=pymysql.cursors.DictCursor
    )

def init():   
    conexao = connect()
    cursor = conexao.cursor()
    cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL
         )
    """)
    cursor.close()    
    conexao.commit()
    conexao.close()
    print("Banco de dados inicializado com sucesso!")  

@app.route('/')
def index():
    # Isso vai mandar quem acessar "http://localhost:5000" direto para a página de cadastro
    return redirect(url_for('cadastro')) # <-- AQUI!
"""
#  ROTA DE LOGIN- como melhoria par a interface do site de cadastro 
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('senha')

        # Validações de campos vazios
        if not email or not email.strip():
            return "<h2>Erro: O campo E-mail é obrigatório.</h2><a href='/login'>Voltar ao login</a>"
        if not senha or not senha.strip():
            return "<h2>Erro: O campo Senha é obrigatório.</h2><a href='/login'>Voltar ao login</a>"

        try:
            conexao = connect()
            cursor = conexao.cursor()
            
            # Busca o usuário pelo e-mail
            cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
            usuario = cursor.fetchone()
            
            cursor.close()
            conexao.close()
            
            # Se o usuário existir, validamos a senha criptografada
            if usuario and check_password_hash(usuario['senha'], senha):
                # Se tudo bater com sucesso, redireciona
                return redirect(url_for('sucesso'))
            else:
                # Segurança: Nunca diga exatamente se foi o e-mail ou a senha que errou
                return "<h2>Erro: E-mail ou Senha incorretos.</h2><a href='/login'>Tentar novamente</a>"
                
        except Exception as e:
            return f"<h2>Erro de conexão com o banco: {e}</h2><a href='/login'>Voltar ao login</a>"

    return render_template('login.html')
"""

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro(): 
    if request.method == 'POST': 
        nome = request.form.get('nome')
        email = request.form.get('email')
        senha = request.form.get('senha')
        confirmacao = request.form.get('confirmacao')

        if not nome or not nome.strip():
            return "<h2>Erro: O campo Nome é obrigatório.</h2><a href='/cadastro'>Voltar ao cadastro</a>"
        if not email or not email.strip():
            return "<h2>Erro: O campo E-mail é obrigatório.</h2><a href='/cadastro'>Voltar ao cadastro</a>"
        if len(senha) < 6:
            return "<h2>Erro: A senha deve ter no mínimo 6 caracteres.</h2><a href='/cadastro'>Voltar ao cadastro</a>"
        if senha != confirmacao:
            return "<h2>Erro: As senhas não coincidem.</h2><a href='/cadastro'>Voltar ao cadastro</a>" 
            
        try:
            conexao = connect()
            cursor = conexao.cursor()
            cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
            usuario_existente = cursor.fetchone()
            cursor.close()
            conexao.close()
            
            if usuario_existente:
                return "<h2>Erro: Este e-mail já está cadastrado!</h2><a href='/cadastro'>Voltar ao cadastro</a>"
        except Exception as e:
            return f"<h2>Erro de conexão com o banco: {e}</h2><a href='/cadastro'>Voltar ao cadastro</a>"

        senha_criptografada = generate_password_hash(senha) 
        
        try:
            conexao = connect()
            cursor = conexao.cursor()
            cursor.execute("INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)", (nome, email, senha_criptografada))
            cursor.close()
            conexao.commit()
            conexao.close()
            return redirect(url_for('sucesso'))
        except Exception as e:
            return f"<h2>Erro ao salvar usuário no banco: {e}</h2><a href='/cadastro'>Voltar ao cadastro</a>"
        
    return render_template('cadastro.html')

@app.route('/sucesso') 
def sucesso(): 
     return render_template('sucesso.html') 

if __name__ == '__main__':
    init()
    app.run(host='0.0.0.0', port=5000, debug=True)