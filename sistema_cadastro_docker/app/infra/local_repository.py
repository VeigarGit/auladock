
from infra.user_repository_interface import RepositoryInterface
from entidade.user import User

class LocalRepository(RepositoryInterface):
    def __init__(self):
        super().__init__()
        self.users: list[User] = []

    def create_user(self, user):
        self.users.append(user)
        print(f"User : {user.user_id} Password {user.password}")

    def find_user_by_name(self, full_name):
         for user in self.users:
            if user.full_name == full_name:
                print("Usuário encontrado")
                return user

    def find_email(self, email):
        for user in self.users:
            if user.email == email:
                print(f"O email {user.email} já existe")
            
    def list_users(self):
        print("\n")
        print("============================ USER LIST ============================")
        for user in self.users:
            print(user)


if __name__ == "__main__":
    user_list = [
        User("João Silva", "joao@gmail.com", "123"),
        User("Maria Souza", "maria@gmail.com", "abc123"),
        User("Pedro Santos", "pedro@gmail.com", "senha456"),
        User("Ana Oliveira", "ana@gmail.com", "qwerty"),
        User("Carlos Lima", "carlos@gmail.com", "teste123"),
        User("Fernanda Costa", "fernanda@gmail.com", "minhasenha"),
        User("Lucas Almeida", "lucas@gmail.com", "python"),
        User("Juliana Rocha", "juliana@gmail.com", "flask"),
        User("Rafael Gomes", "rafael@gmail.com", "123456"),
        User("Beatriz Martins", "beatriz@gmail.com", "segredo"),
    ]

    repo = LocalRepository()

    for user in user_list:
        repo.create_user(user)

    repo.list_users()

    print(f"O usário {repo.find_user_by_name('Rafael Gomes')} foi encontrado")

    repo.find_email('beatriz@gmail.com')