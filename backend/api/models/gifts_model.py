from beanie import Document, Indexed
from pydantic import Field
from typing import List, Optional

class Gifts(Document):
    product_name: Indexed(str, unique=True)
    tokens: List[str] = Field(default_factory=list)

    class collection:
        name = "gifts"
