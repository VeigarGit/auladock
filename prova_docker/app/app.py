# Main app
import os
import re
import time
#giving problem in antigravity because i cant select conda envs but its working normally
from flask import Flask, render_template, request, redirect, url_for, flash
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "test_secret_key")

# Conectando o DB
DB_HOST = os.environ.get("DB_HOST", "db")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "admin123")
DB_NAME = os.environ.get("DB_NAME", "test_db")

def get_db_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

def init_db():
    """Inicialização caso o db n exista a priore"""
    print("Connecting to database and initializing structure...")
    connection = None
    for i in range(10):
        try:
            connection = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD
            )
            break
        except mysql.connector.Error as err:
            print(f"MySQL connection attempt {i+1}/10 failed. Database might still be starting. Retrying in 3s...")
            time.sleep(3)
            
    if not connection:
        raise Exception("Failed to connect to MySQL database server after several attempts.")

    try:
        cursor = connection.cursor()
        # Create DB if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        # Connect to the created DB
        cursor.execute(f"USE {DB_NAME}")
        # Create users table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullname VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        """)
        connection.commit()
        print("Database initialized and users table checked/created successfully.")
    except mysql.connector.Error as err:
        print(f"Error during DB initialization: {err}")
        raise
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Initialize DB when starting the application
init_db()

@app.route("/")
def home():
    # Redirect to registration page by default
    return redirect(url_for("register"))

@app.route("/cadastro", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        fullname = request.form.get("fullname", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        # 1. Validation: Empty fields
        if not fullname or not email or not password or not confirm_password:
            flash("Todos os campos devem ser preenchidos.", "danger")
            return render_template("cadastro.html")

        # 2. Validation: Email format
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            flash("Formato de email inválido.", "danger")
            return render_template("cadastro.html")

        # 3. Validation: Password length (min 6 characters)
        if len(password) < 6:
            flash("A senha deve ter no mínimo 6 caracteres.", "danger")
            return render_template("cadastro.html")

        # 4. Validation: Password confirmation match
        if password != confirm_password:
            flash("As senhas não coincidem.", "danger")
            return render_template("cadastro.html")

        # 5. Validation: Email uniqueness in database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if user:
                flash("Email já cadastrado.", "danger")
                return render_template("cadastro.html")
            
            # Secure password hashing
            hashed_password = generate_password_hash(password)
            
            # Insert user
            cursor.execute(
                "INSERT INTO users (fullname, email, password) VALUES (%s, %s, %s)",
                (fullname, email, hashed_password)
            )
            conn.commit()
            flash("Cadastro realizado com sucesso!", "success")
            return redirect(url_for("success"))
        except mysql.connector.Error as err:
            flash(f"Erro no banco de dados: {err}", "danger")
        finally:
            if 'conn' in locals() and conn.is_connected():
                cursor.close()
                conn.close()

    return render_template("cadastro.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        if not email or not password:
            flash("Todos os campos devem ser preenchidos.", "danger")
            return render_template("login.html")

        try:
            conn = get_db_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()

            # Verify credentials and check hashed password
            if user and check_password_hash(user["password"], password):
                flash(f"Bem-vindo(a), {user['fullname']}!", "success")
                return render_template("sucesso.html", user=user)
            else:
                flash("E-mail ou senha incorretos.", "danger")
        except mysql.connector.Error as err:
            flash(f"Erro no banco de dados: {err}", "danger")
        finally:
            if 'conn' in locals() and conn.is_connected():
                cursor.close()
                conn.close()

    return render_template("login.html")

@app.route("/sucesso")
def success():
    return render_template("sucesso.html")

if __name__ == "__main__":
    # Host must be 0.0.0.0 so it is accessible from outside the container
    app.run(host="0.0.0.0", port=5000, debug=True)
