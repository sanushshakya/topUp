from pydantic import Field
from beanie import Document, Indexed, PydanticObjectId
from datetime import datetime
from typing import Optional

class Order(Document):
    name: str
    email: str
    product: str
    user_id: str
    created_at: Optional[datetime] = None

    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class collection:
        name = "order"