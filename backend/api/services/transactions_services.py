from beanie import Document
from api.models.transactions_model import Transactions
from typing import Optional, List
from datetime import datetime
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException, status

class TransactionsServices:
    @staticmethod
    async def create_transaction(user_id: str, email: str, transaction_type: str, amount: float):
        transaction = Transactions(
            user_id=user_id,
            email=email,
            transaction_type=transaction_type,
            amount= amount,
            created_at=datetime.utcnow()
        )
        await transaction.save()
        return transaction

    @staticmethod
    async def read_transaction(user_id: str):
        try:
            return await Transactions.find({"user_id": user_id}).to_list()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Other CRUD operations can be implemented as needed
