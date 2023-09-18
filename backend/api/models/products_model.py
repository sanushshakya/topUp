from pydantic import Field
from beanie import Document, Indexed, PydanticObjectId
from datetime import datetime
from typing import Optional

class Products(Document):
    product_name: str
    cat_name: str
    description: str
    price: str
    image_url: Optional[str]
    status: str = Field(default="pending")

    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class collection:
        name = "products"