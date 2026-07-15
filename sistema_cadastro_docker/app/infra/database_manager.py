from abc import abstractmethod,ABC

class DatabaseManager:
    def __init__(self,host,username,password):
        self.host = host
        self.username = username
        self.password = password
    
    @abstractmethod
    def _connect(self):
        pass

    def _disconnect(self):
        pass