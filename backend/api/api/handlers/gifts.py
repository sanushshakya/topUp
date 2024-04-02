from fastapi import APIRouter, Depends, HTTPException, status, Form
from api.models.gifts_model import Gifts
from api.services.gifts_services import GiftServices
from api.api.deps.user_deps import get_current_user, is_admin

gift_router = APIRouter()

@gift_router.post("/create", summary="Create gift")
async def create_gift(product_name: str = Form(...), 
                      tokens: str = Form(...), 
                      current_user = Depends(is_admin)):
    tokens = tokens.split(",") if tokens else None
    try:
        return await GiftServices.create_gift(product_name, tokens)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create gift."
        ) from e

@gift_router.get("/read", summary="Read all gifts")
async def read_all_gifts(current_user = Depends(is_admin)):
    try:
        return await GiftServices.read_all_gifts()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read all gifts."
        ) from e

@gift_router.get("/read/{gift_id}", summary="Read gift by ID")
async def read_gift_by_id(gift_id: str, current_user = Depends(get_current_user)):
    try:
        return await GiftServices.read_gift_by_id(gift_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read gift by ID."
        ) from e

@gift_router.put("/update", summary="Update gift tokens")
async def update_gift_tokens(product_name: str = Form(default=None),
                            tokens: str = Form(default=None), 
                            current_user = Depends(is_admin)):
    tokens = tokens.split(",") if tokens else None
    try:
        return await GiftServices.update_gift_tokens(product_name, tokens)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update gift tokens."
        ) from e

@gift_router.delete("/delete/{product_name}", summary="Delete gift")
async def delete_gift(product_name: str, current_user = Depends(is_admin)):
    try:
        return await GiftServices.delete_gift(product_name)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete gift."
        ) from e

@gift_router.post("/buy/{product_name}", summary="Buy gift token")
async def buy_gift_token(product_name: str, current_user = Depends(get_current_user)):
    try:
        result = await GiftServices.buy_gift_token(product_name, current_user.email)
        if result:
            return {"token": result}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token not available for purchase."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to buy gift token."
        ) from e
        
@gift_router.delete("/delete-token/{gift_id}/{token_to_delete}", summary="Delete token from gift")
async def delete_token_from_gift(gift_id: str, token_to_delete: str, current_user = Depends(get_current_user)):
    try:
        result = await GiftServices.delete_token_from_gift(gift_id, token_to_delete)
        if result == "Token deleted successfully.":
            return {"message": "Token deleted successfully."}
        elif result == "Token not found in the gift.":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Token not found in the gift."
            )
        elif result == "Gift not found.":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Gift not found."
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete token from gift."
        ) from e
