from pydantic import Field
from beanie import Document, Indexed
from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Optional


class Categories(Document):
    cat_name: Indexed(str, unique = True)
    description: Optional[str] = None
    image_url: str

    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class collection:
        name = "categories"