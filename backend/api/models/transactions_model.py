from beanie import Document
from pydantic import Field
from datetime import datetime

class Transactions(Document):
    user_id: str
    email: str
    transaction_type: str
    amount: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class collection:
        name = "transactions"
