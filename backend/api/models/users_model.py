from beanie import Document, Indexed
from pydantic import Field
import datetime
from uuid import UUID, uuid4

class Users(Document):
    user_id: UUID = Field(default_factory=uuid4)
    username: str
    email: Indexed(str, unique = True)
    hashed_password: str
    phone: str
    role: str

    def __repr__(self) -> str:
        return f"<user {self.email}>"
    
    def __str__(self) -> str:
        return self.email
    
    def __hash__(self) -> str:
        return hash (self.email)
    
    def __eq__(self, other: object) -> bool:
        if isinstance(other, Users):
            return self.email == other.email
        return False

    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    @classmethod
    async def by_email(self, email:str) -> "Users":
        return await self.find_one(self.email == email)
    
    class collection:
        name = "users"