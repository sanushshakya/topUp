from pydantic import Field
from beanie import Document, Indexed
from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Optional


class Tournaments(Document):
    name: Indexed(str, unique = True)
    price: str
    description: Optional[str] = None
    image_url: str

    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class collection:
        name = "tournaments"