from typing import Optional
from fastapi import HTTPException, status
from api.models.users_model import Users
from bson import ObjectId
from api.core.security import getPassword, verifyPassword

class UsersServices:
    @staticmethod
    async def read_users():
        return await Users.find_all().to_list()
    
    @staticmethod
    async def read_user_by_id(id: str):
        return await Users.find_one(id == Users.user_id)
    
    @staticmethod
    async def read_user_by_email(email:str):
        return await Users.find_one(email == Users.email)
    
    @staticmethod
    async def authenticate(email:str, password:str) -> Optional[Users]:
        user = await UsersServices.read_user_by_email(email=email)
        if not user:
            return None
        if not verifyPassword(password=password, hashedPass=user.hashed_password):
            return None
        return user

    @staticmethod
    async def create_user(username: str, email: str, password: str, phone: str):
        user = await UsersServices.read_user_by_email(email=email)
        if not user:
            user_doc = Users(
                username = username,
                email = email,
                hashed_password = getPassword(password),
                phone = phone,
                role = 'user'
            ) 
            await user_doc.save()
            return user_doc
        else:
            return "User already exists."
    
    @staticmethod
    async def update_user(user_id: str, username: str = None, password: str = None, phone: str = None, role: str = None):
        user_id = ObjectId(user_id)
        user = await Users.find_one(user_id == Users.id)
        if username is not None:
            user.username = username
        if password is not None:
            user.hashed_password = getPassword(password)
        if phone is not None:
            user.phone = phone
        if role is not None:
            user.role = role
        await user.save()
        return user
    
    @staticmethod
    async def delete_user(user_id:str):
        user_id = ObjectId(user_id)
        user = await Users.find_one(user_id == Users.id)
        await user.delete()
        return "User Deleted Successfully"
        
        
    
   

    
