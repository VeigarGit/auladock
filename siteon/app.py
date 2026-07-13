from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return """
    <html>
        <head>
            <title>🚀 Pipeline Docker - Aula</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background: #f0f2f5; }
                .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
                h1 { color: #2563eb; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Olá, turma! 👋</h1>
                <p>Esta aplicação está rodando <strong>dentro de um container Docker</strong>!</p>
                <p>O pipeline CI/CD funcionou perfeitamente 🎉</p>
                <hr>
                <p><small>Disciplina de DevOps / Containerização</small></p>
            </div>
        </body>
    </html>
    """

@app.route('/health')
def health():
    return jsonify({"status": "ok", "message": "Aplicação saudável!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)