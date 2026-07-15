from infra.mongo_manager import MongoManager
from entidade.user import User

class MongoUserRepository:
    def __init__(self, manager: MongoManager):
        self.db = manager.connect()["testes"]

    def create_user(self, user):
        self.db.users.insert_one(user.__dict__)

    def find_user_by_name(self, full_name):
        data = self.db.users.find_one({
            "full_name": full_name
        })

        if not data:
            return None

        return User(
            full_name=data["full_name"],
            email=data["email"],
            password=data["password"]
        )

    def find_user_by_email(self, email):

        data = self.db.users.find_one({
            "email": email
        })

        if not data:
            return None

        return User(
            full_name=data["full_name"],
            email=data["email"],
            password=data["password"]
        )
    
    def find_all_users(self):
        users = self.db.users.find()
        return [
        User(
            full_name=user["full_name"],
            email=user["email"],
            password=user["password"]
        )
        for user in users
    ]