from fastapi import APIRouter, HTTPException, Form, Depends, status
from api.services.transactions_services import TransactionsServices
from api.api.deps.user_deps import get_current_user
from typing import Optional
from pymongo.errors import DuplicateKeyError

transaction_router = APIRouter()

@transaction_router.get("/read")
async def read_transaction(current_user = Depends(get_current_user)):
    try:
        return await TransactionsServices.read_transaction(str(current_user.id))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction history not found"
        )

@transaction_router.post("/create")
async def create_transaction(
    transaction_type: str = Form(...),
    amount: str = Form(...),
    current_user = Depends(get_current_user)
):
    try:
        # Convert amount and new_balance to float, handling possible ValueError
        amount_float = float(amount)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid amount or new_balance value"
        )

    try:
        return await TransactionsServices.create_transaction(str(current_user.id), current_user.email, transaction_type, amount_float)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction history already exists."
        )

# Other handlers for updating, deleting transaction history can be added similarly
