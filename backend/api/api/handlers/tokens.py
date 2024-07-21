from fastapi import APIRouter, Form, HTTPException, status, Request,  File, UploadFile, Depends
import pymongo
from api.services.tokens_services import TokenServices
from api.api.helpers.save_picture import save_picture
from api.api.deps.user_deps import get_current_user, is_admin

token_router = APIRouter()

@token_router.get("/read/{data}")
async def read_token(data:str):
    try:
        return await TokenServices.read_tokens(data)
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Token not found"
        )

@token_router.post("/create", summary="Create new token")
async def create_token(data:str, current_user = Depends(get_current_user)):
    try:
        return await TokenServices.create_tokens(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Token already exists."
        )
        
@token_router.delete("/delete/{data}", summary="Delete banner")
async def delete_token(data: str, current_user = Depends(is_admin)):
    try:
        return await TokenServices.delete_token(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Token not found."
        )
        



