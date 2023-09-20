from pydantic import Field
from beanie import Document, Indexed, PydanticObjectId
from datetime import datetime
from typing import Optional

class Order(Document):
    name: str
    email: str
    game_name: str
    player_id: str 
    product: str
    user_id: str
    status: str

    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class collection:
        name = "order"