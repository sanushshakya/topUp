from fastapi import APIRouter, Depends, HTTPException, status, Form
from api.models.wallets_model import Wallets
from api.services.wallets_services import WalletServices
from api.api.deps.user_deps import get_current_user, is_admin

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
                             balance: str = Form(default=None), 
                             current_user = Depends(is_admin)):
    try:
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
