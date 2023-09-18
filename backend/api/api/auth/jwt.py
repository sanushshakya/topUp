from fastapi import APIRouter, Depends, HTTPException,status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from api.api.deps.user_deps import get_current_user
from api.services.users_services import UsersServices
from api.core.security import createAccessToken, createRefreshToken

auth_router = APIRouter()

@auth_router.post("/login", summary="Create access and refresh token")
async def login(formData: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await UsersServices.authenticate(email = formData.username, password = formData.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Wrong Credentials"
        )
    return {
        "accessToken": createAccessToken(user.user_id),
        "refreshToken": createRefreshToken(user.user_id),
    }
    
@auth_router.post("/refresh-token", summary="Refresh access token")
async def refresh_token(refresh_token: str):
    user = await get_current_user(refresh_token)
    return user
    
@auth_router.post("/test-token/{accessToken}", summary="Test if the token is valid")
async def testToken(accessToken: str):
    user = await get_current_user(accessToken)
    return user