from infra.database_manager import DatabaseManager
from pymongo import MongoClient

class MongoManager(DatabaseManager):
    def __init__(self,username, password,host):
        self.username = username
        self.password = password
        self.host = host
        self.client = None

    def connect(self):
        self.client = MongoClient(
            f"mongodb://{self.username}:{self.password}@{self.host}:27017/"
        )
        return self.client

    def disconnect(self):
        if self.client:
            self.client.close()