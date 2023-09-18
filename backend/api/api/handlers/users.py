from fastapi import APIRouter, Form, HTTPException, status, Request,  File, UploadFile
import pymongo
from api.services.users_services import UsersServices

user_router = APIRouter()

@user_router.get("/read")
async def read_user():
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
async def update_product(user_id: str,
                      username: str = Form(default=None),  
                      password:str = Form(default=None), 
                      phone:str = Form(default=None),
                      role:str = Form(default=None)):
    try:
        return await UsersServices.update_user(user_id, username, password, phone, role)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Product not found."
        )
        
@user_router.delete("/delete/{user_id}", summary="Delete user")
async def delete_user(user_id: str):
    try:
        return await UsersServices.delete_user(user_id)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "User not found."
        )
        



