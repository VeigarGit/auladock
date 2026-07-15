import os
import time
import re
import pymysql
from flask import Flask, request, render_template, redirect, url_for
from werkzeug.security import generate_password_hash

app = Flask(__name__)

# Configuração do banco vinda de variaveis de ambiente 
# Nunca deixe senha fixa no código. O docker-compose.yml injeta esses valores.
DB_CONFIG = {
    "host": os.environ.get("MYSQL_HOST", "db"),
    "user": os.environ.get("MYSQL_USER", "app"),
    "password": os.environ.get("MYSQL_PASSWORD", "app123"),
    "database": os.environ.get("MYSQL_DATABASE", "cadastro"),
    "cursorclass": pymysql.cursors.DictCursor,
}


def get_connection():
    return pymysql.connect(**DB_CONFIG)


def init_db():
    # O MySQL demora pra ficar pronto quando sobe.
    # Tentamos conectar em loop até conseguir (retry).
    for tentativa in range(10):
        try:
            conn = get_connection()
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS usuarios (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(120) NOT NULL,
                        email VARCHAR(120) NOT NULL UNIQUE,
                        senha_hash VARCHAR(255) NOT NULL
                    )
                """)
            conn.commit()
            conn.close()
            print("Banco pronto")
            return
        except pymysql.err.OperationalError:
            print(f"Banco ainda não respondeu (tentativa {tentativa+1}), aguardando...")
            time.sleep(3)
    raise RuntimeError("Não consegui conectar ao MySQL")


EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@app.route("/", methods=["GET"])
def cadastro():
    return render_template("cadastro.html")


@app.route("/cadastrar", methods=["POST"])
def cadastrar():
    nome = request.form.get("nome", "").strip()
    email = request.form.get("email", "").strip().lower()
    senha = request.form.get("senha", "")
    confirmacao = request.form.get("confirmacao", "")

    #  VALIDAÇÕES 
    if not nome or not email or not senha:
        return render_template("cadastro.html", erro="Preencha todos os campos.")

    if not EMAIL_REGEX.match(email):
        return render_template("cadastro.html", erro="Email inválido.")

    if len(senha) < 3:
        return render_template("cadastro.html", erro="A senha deve ter no mínimo 3 caracteres.")

    if senha != confirmacao:
        return render_template("cadastro.html", erro="As senhas não coincidem.")

    # hash
    senha_hash = generate_password_hash(senha)

    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO usuarios (nome, email, senha_hash) VALUES (%s, %s, %s)",
                (nome, email, senha_hash),
            )
        conn.commit()
        conn.close()
    except pymysql.err.IntegrityError:
        # email repetido 
        return render_template("cadastro.html", erro="Email já cadastrado.")

    return redirect(url_for("sucesso", nome=nome))


@app.route("/sucesso")
def sucesso():
    return render_template("sucesso.html", nome=request.args.get("nome", ""))


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
