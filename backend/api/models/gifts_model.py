from beanie import Document, Indexed
from pydantic import Field
from typing import List, Optional

class Gifts(Document):
    product_name: Indexed(str, unique=True)
    tokens: Optional[List[str]] = Field(default=None)

    class collection:
        name = "gifts"
