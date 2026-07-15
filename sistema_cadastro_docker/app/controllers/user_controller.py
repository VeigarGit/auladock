from flask import Blueprint, request, jsonify, render_template, redirect
from entidade.user import User

# Meus Casos de Uso
from entidade.user_use_cases import (
    CreateUserUc,
    FindEmailUC,
    FindUserUC,
    ListAllUsersUC
)

# O controller Users serve como interface entre Cliente <-> Servidor
# Temos as seguintes rotas (Rotas de Api / Rotas de Serviço Real)
# Rotas de Serviço : users -> Lista os Usuários e renderiza na página de users_list
# Rotas de Serviço : users/create -> Registra novos usuários e renderiza na página de user_created

class UserController:

    def __init__(self, repository, encoder, validator):

        self.repo = repository
        self.encoder = encoder
        self.validator = validator

        #Objetos de cada um dos meus Usecases
        self.create_user_uc = CreateUserUc(repo=self.repo,encoder=self.encoder,validator=self.validator)
        self.find_user_uc = FindUserUC(self.repo)
        self.find_email_uc = FindEmailUC(self.repo)
        self.list_users_uc = ListAllUsersUC(self.repo)

        #Modularização da minha rota de Users
        self.bp = Blueprint("users",__name__)
        self.register_routes()


    def register_routes(self):

        # Rota de Apresentação
        @self.bp.route("/users")
        def list_users_page():
            users = self.list_users_uc.execute()
            return render_template(
                "users_list.html",
                users=users
            )
        
        # Rota de Apresentação
        @self.bp.route("/users/create",methods=["GET", "POST"])
        def create_user_page():
            if request.method == "POST":
                user = User(
                    full_name=request.form["full_name"],
                    email=request.form["email"],
                    password=request.form["password"]
                )
                self.create_user_uc.execute(user)
                # Preiciso ir para a página de sucesso
                return redirect("/users/success")
            return render_template(
                "create_user.html"
            )
        
        # Rota de Apresentação
        @self.bp.route("/users/success")
        def success_user_pages():
            return render_template("user_created.html")
        

        @self.bp.route("/api/users",methods=["GET"])
        def list_users_api():
            try:
                users = self.list_users_uc.execute()
                return jsonify([
                    user.to_dict()
                    for user in users
                ]), 200
            
            except Exception as error:
                return jsonify({
                    "error": str(error)
                }),400

        @self.bp.route("/api/users",methods=["POST"])
        def create_user_api():
            try:
                data = request.json
                user = User(
                    full_name=data["full_name"],
                    email=data["email"],
                    password=data["password"]
                )
                self.create_user_uc.execute(user)
                return jsonify({
                    "message":
                    "Usuário criado com sucesso"
                }),201
            except Exception as error:
                return jsonify({
                    "error":str(error)
                }),400
        

        @self.bp.route("/api/users/<full_name>", methods=["GET"])
        def find_user_api(full_name):

            try:
                user = self.find_user_uc.execute(full_name)
                if not user:
                    return jsonify({
                        "error":
                        "Usuário não encontrado"
                    }),404
                return jsonify(
                    user.to_dict()
                ),200
            except Exception as error:
                return jsonify({
                    "error":str(error)
                }),400

        @self.bp.route("/api/users/email/<email>",methods=["GET"])
        def find_email_api(email):
            try:
                user = self.find_email_uc.execute(email)
                if not user:
                    return jsonify({
                        "error":
                        "Email não encontrado"
                    }),404
                return jsonify(
                    user.to_dict()
                ),200
            except Exception as error:
                return jsonify({
                    "error":str(error)
                }),400