from fastapi import APIRouter, Form, HTTPException, status, Request,  File, UploadFile, Depends
import pymongo
from api.services.users_services import UsersServices
from api.api.deps.user_deps import get_current_user, is_admin
from api.models.users_model import Users
from datetime import datetime, timedelta
from jose import jwt
from api.api.helpers.send_email import send_reset_email
from api.core.security import getPassword, verifyPassword
from api.core.config import settings

user_router = APIRouter()

@user_router.get("/read")
async def read_user(current_user = Depends(is_admin)):
    try:
        return await UsersServices.read_users()
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Users not found"
        )

@user_router.post("/create", summary="Create new user")
async def create_user(username: str = Form(...),
                      email: str = Form(...),
                      password: str = Form(...), 
                      phone: str = Form(...)):
    try:
        return await UsersServices.create_user(username, email, password, phone)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "User already exists."
        )
        
@user_router.put("/update/{user_id}", summary="Update user")
async def update_user(user_id: str,
                      username: str = Form(default=None),  
                      password:str = Form(default=None), 
                      phone:str = Form(default=None),
                      role:str = Form(default=None),
                      current_user = Depends(get_current_user)):
    try:
        return await UsersServices.update_user(user_id, username, password, phone, role)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Product not found."
        )
        
@user_router.delete("/delete/{user_id}", summary="Delete user")
async def delete_user(user_id: str,
                      current_user = Depends(is_admin)):
    try:
        return await UsersServices.delete_user(user_id)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "User not found."
        )        

@user_router.post("/resetpassword", summary="Initiate password reset")
async def reset_password(email: str = Form(...)):
    user = await Users.find_one(Users.email == email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Generate token
    token_data = {
        "sub": str(user.email),
        "exp": datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
    }
    token = jwt.encode(token_data, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)


    # Send reset email
    send_reset_email(email, token)
    return {"msg": "Password reset email sent"}

# Endpoint to handle the actual password reset
@user_router.post("/resetpassword/{token}", summary="Handle password reset")
async def handle_reset_password(token: str, new_password: str = Form(...)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        user = await Users.find_one(Users.email == user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Update user's password (hash the password before saving)
        user.hashed_password = getPassword(new_password)
        await user.save()
        return {"msg": "Password reset successful"}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")


