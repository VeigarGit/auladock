from flask import Flask, render_template
from infra.mongo_manager import MongoManager
from infra.mongo_user_repository import MongoUserRepository
from controllers.user_controller import UserController


app = Flask(__name__)


# Acionar configurações do Banco
manager = MongoManager("username","password","mongodb")
repo = MongoUserRepository(manager)


#Rotas Comuns
@app.route("/")
def home():
    return render_template("index.html")


# Serviços Externos que meu Controller precisa por conta dos meus Use Cases
from entidade.user_use_cases import PasswordEncoder
encoder = PasswordEncoder()

from entidade.user_use_cases import UserValidatorService
validator = UserValidatorService()

# Aqui temos o controller do User
user_controller = UserController(
    repository=repo,
    encoder=encoder,
    validator=validator
)

app.register_blueprint(user_controller.bp)


if __name__ == "__main__":
     app.run(host="0.0.0.0",port=5000,debug=True)