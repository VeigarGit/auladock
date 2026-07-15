from werkzeug.security import generate_password_hash,check_password_hash
from infra.mongo_user_repository import MongoUserRepository
from infra.mongo_manager import MongoManager
from entidade.user import User

#Serviços Externos
class UserValidatorService:
    def validate(self, user): # Gostei dessa pois é o S todinho
        self.validate_email(user.email)
        self.validate_password(user.password)

    def validate_email(self, email):
        if not email:
            raise Exception("Email é obrigatório")

        if "@" not in email or "." not in email:
            raise Exception("Email inválido")

    def validate_password(self, password):
        if not password:
            raise Exception("Senha é obrigatória")

        if len(password) < 6:
            raise Exception("Senha deve ter no mínimo 6 caracteres")

class PasswordEncoder:
    def encrypt(self,password):
         return generate_password_hash(password=password,method="scrypt")
    
    #def check_encrypt(self,full_name,user_password_input):
    #    user = repo.find_user_by_name(full_name)
    #    #print("==========a Validando Usuários ==========")
    #    #print(f"Nome digitado {full_name}")
    #    #print(f"Senha Digitada {user_password_input}")
    #    #print("========================================")
    #    if full_name == user.full_name:
    #        #print(f"O usuário de nome {user.full_name} existe")
    #        #print(f"A sua senha encriptada é {user.password}")
    #        if check_password_hash(user.password,user_password_input):
    #            print("Password combina")
    #        else:
    #            print("Password dá erro")

#Casos de uso
class CreateUserUc:
    def __init__(self, repo, encoder, validator):
        self.repo = repo
        self.encoder = encoder
        self.validator = validator
        
    def execute(self, user : User):
        self.validator.validate(user)
        
        if self.repo.find_user_by_email(user.email):
            raise Exception("Usuário já cafastrado")

        user.password = self.encoder.encrypt(user.password)
        return self.repo.create_user(user)
    
class FindUserUC:
    def __init__(self, repo):
        self.repo = repo
    
    def execute(self,full_name):
        return self.repo.find_user_by_name(full_name=full_name)

class FindEmailUC:
    def __init__(self, repo):
        self.repo = repo
    
    def execute(self,email):
        return self.repo.find_user_by_email(email=email)

class ListAllUsersUC:
    def __init__(self, repo):
        self.repo = repo
    
    def execute(self):
        return self.repo.find_all_users()

if __name__ == "__main__":

    hash_secret = "123"
    user_list = [
            User("João Silva", "joao@gmail.com", "12334445"),
            User("Maria Souza", "maria@gmail.com", "abc123"),
            User("Pedro Santos", "pedro@gmail.com", "senha456"),
            User("Ana Oliveira", "ana@gmail.com", "qwerty"),
            User("Carlos Lima", "carlos@gmail.com", "teste123"),
            User("Fernanda Costa", "fernanda@gmail.com", "minhasenha"),
            User("Lucas Almeida", "lucas@gmail.com", "python"),
            User("Juliana Rocha", "juliana@gmail.com", "flask1000"),
            User("Rafael Gomes", "rafael@gmail.com", "123456"),
            User("Beatriz Martins", "beatriz@gmail.com", "segredo"),
        ]

    hash_secret = "123"
    manager = MongoManager("username","password","localhost")
    repo = MongoUserRepository(manager)
    sec = PasswordEncoder()
    validator = UserValidatorService()

    for user in user_list:
        create_user_use_case = CreateUserUc(repo=repo,encoder=sec,validator=validator)
        create_user_use_case.execute(user)

    find_user_by_name_use_case = FindUserUC(repo=repo)
    response = find_user_by_name_use_case.execute("Carlos Lima")
    print(response)

    print("\n")

    find_user_by_email_use_case = FindEmailUC(repo=repo)
    response = find_user_by_email_use_case.execute("fernanda@gmail.com")
    print(response)

    find_all_users_use_case = ListAllUsersUC(repo=repo)
    response = find_all_users_use_case.execute()
    print(response)


