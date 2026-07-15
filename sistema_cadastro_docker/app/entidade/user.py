from dataclasses import dataclass,field
from uuid import uuid4

@dataclass
class User:
    user_id : str = field(default_factory=lambda: str(uuid4()), init=False)
    full_name : str = ""
    email : str = ""
    password : str = ""

    def to_dict(self):
        return {
            "full_name": self.full_name,
            "email": self.email
        }