from beanie import Document, Indexed, PydanticObjectId
from datetime import datetime
from typing import Optional

class Banners(Document):
    image_url: Optional[str]

    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    class collection:
        name = "banners"