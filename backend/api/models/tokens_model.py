from beanie import Document
from pydantic import Field
import datetime

class Tokens(Document):
    data: str
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time

    class collection:
        name = "token"
