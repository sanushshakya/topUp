from fastapi import APIRouter, Depends, HTTPException, status, Form
from api.models.wallets_model import Wallets
from api.services.wallets_services import WalletServices
from api.api.deps.user_deps import get_current_user, is_admin
from api.api.helpers.send_email import send_email_balance_request
from api.core.config import settings
from datetime import datetime, timedelta
from jose import jwt

wallet_router = APIRouter()

@wallet_router.get("/read", summary="Read user's wallet")
async def read_wallet(current_user = Depends(get_current_user)):
    try:
        return await WalletServices.read_wallet_by_user(current_user.id)
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wallet not found"
        )

@wallet_router.post("/create", summary="Create user's wallet")
async def create_wallet(current_user = Depends(get_current_user)):
    try:
        return await WalletServices.create_wallet(current_user.id, current_user.email)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID."
        ) from ve
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create wallet."
        ) from e

@wallet_router.put("/update_add", summary="Update user's wallet balance")
async def add_wallet_balance(email:str = Form(default=None), 
                             token: str = Form(default=None), 
                             current_user = Depends(is_admin)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        balance = payload.get("sub")
        return await WalletServices.add_balance(email, float(balance))
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update wallet balance"
        )
        
@wallet_router.put("/update_subtract/{balance}", summary="Update user's wallet balance")
async def subtract_wallet_balance(balance: str, 
                                  current_user = Depends(get_current_user)):
    try:
        return await WalletServices.subtract_balance(current_user.email, float(balance))
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update wallet balance"
        )

@wallet_router.delete("/delete", summary="Delete user's wallet")
async def delete_wallet(current_user = Depends(get_current_user)):
    try:
        return await WalletServices.delete_wallet(current_user.id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete wallet"
        )
        
@wallet_router.post("/recharge_request")
async def request_recharge(email: str = Form(...), amount: str = Form(...), code: str = Form(...)):
    token_data = {
        "sub": str(amount),
        "exp": datetime.utcnow() + timedelta(hours=3)  # Token valid for 3 hour
    }
    token = jwt.encode(token_data, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    # Send email to admin
    approval_link = f"https://www.esportscardnepal.com/approve_recharge?email={email}&token={token}"
    # approval_link = f"http://localhost:5173/approve_recharge?email={email}&token={token}"
    
    email_content = f"""
    A user has requested a wallet recharge.
    Email: {email}
    Amount: {amount}
    Transaction Id: {code}
    <a href="{approval_link}">Approve Recharge</a>
    """
    
    send_email_balance_request(email_content)
    return {"msg": "Recharge request sent to admin."}
