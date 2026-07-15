# Os meus usecases são responsáveis por codificar e decodificar a senha que fora transformada
from abc import ABC,abstractmethod
from entidade.user import User


class UserRepositoryInterface(ABC):
    #Talvez seja interessante separar Interface de Leitura e Escrita
    #Já que se crescer muito a minha interface, quando eu tiver que evocar ela, demore muito

    @abstractmethod    
    def create_user(self, user : User):
        pass
    
    @abstractmethod
    def find_user_by_name(self,full_name : str):
        pass

    @abstractmethod
    def find_user_by_email(self,email : str):
        pass

    @abstractmethod
    def find_all_users(self,email : str):
        pass