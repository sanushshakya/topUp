from pydantic import BaseModel
from uuid import UUID

class TokenSchema(BaseModel):
    accessToken: str
    refreshToken: str

class TokenPayload(BaseModel):
    sub: UUID = None
    exp: int = None
   

