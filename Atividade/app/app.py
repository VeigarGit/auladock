import re
import pymysql
import os
from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'Denis.jr'

def conectar():
    return pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', 'senh@d0root'),
        database=os.getenv('DB_NAME', 'cadastro_db'),
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=5
    )

# ─── Cria a tabela ao iniciar ────────────────────────────
try:
    conn = conectar()
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
    conn.commit()
    conn.close()
except pymysql.Error as e:
    print(f"AVISO: Não foi possível conectar ao banco de dados: {e}")
    print("O app funcionará, mas as rotas que usam banco de dados exibirão erro.")

# ─── VALIDAÇÕES ──────────────────────────────────────────

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        nome = request.form.get('nome', '').strip()
        email = request.form.get('email', '').strip()
        senha = request.form.get('senha', '')
        confirmacao = request.form.get('confirmacao', '')

        if not nome:
            flash('Nome é obrigatório')
        elif not EMAIL_REGEX.match(email):
            flash('Email inválido')
        elif len(senha) < 6:
            flash('Senha deve ter no mínimo 6 caracteres')
        elif senha != confirmacao:
            flash('Senhas não coincidem')
        else:
            try:
                conn = conectar()
                with conn.cursor() as cur:
                    cur.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
                    if cur.fetchone():
                        flash('Este email já está cadastrado')
                    else:
                        senha_hash = generate_password_hash(senha)
                        cur.execute(
                            "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)",
                            (nome, email, senha_hash)
                        )
                        conn.commit()
                        conn.close()
                        return redirect(url_for('login'))
                conn.close()
            except pymysql.Error as e:
                flash(f'Erro ao acessar o banco de dados: {e}')

    return render_template('cadastro.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        senha = request.form.get('senha', '')

        if not email or not senha:
            flash('Preencha todos os campos')
        else:
            try:
                conn = conectar()
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
                    usuario = cur.fetchone()
                conn.close()

                if usuario and check_password_hash(usuario.get('senha', ''), senha):
                    return redirect(url_for('sucesso'))
                else:
                    flash('Email ou senha incorretos')
            except pymysql.Error as e:
                flash(f'Erro ao acessar o banco de dados: {e}')

    return render_template('login.html')

@app.route('/sucesso')
def sucesso():
    return render_template('sucesso.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)