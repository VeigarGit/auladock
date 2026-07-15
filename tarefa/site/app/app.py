from flask import Flask, render_template, request, redirect, url_for
from werkzeug.security import generate_password_hash

app = Flask(__name__)

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

    # TODO: Inserir no banco MySQL (etapa seguinte)

    return redirect(url_for('sucesso'))

@app.route('/sucesso')
def sucesso():
    return render_template('sucesso.html')