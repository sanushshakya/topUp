from beanie import Document
from pydantic import Field
import datetime

class Wallets(Document):
    user_id: str
    email: str
    balance: float 
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time

    class collection:
        name = "wallets"
