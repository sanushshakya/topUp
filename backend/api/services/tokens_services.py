from api.models.tokens_model import Tokens
from fastapi import HTTPException, status
from bson import ObjectId

class TokenServices:
    @staticmethod
    async def read_tokens(data:str):
        try:
            token_doc = await Tokens.find({"data": data}).to_list()
            return token_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def create_tokens(data:str):
        token_doc = Tokens(
            data = data
        ) 
        await token_doc.save()
        return token_doc
    
    @staticmethod
    async def delete_token(data: str):
        token = await Tokens.find_one(data == Tokens.data)
        await token.delete()
        return "Token Deleted Successfully"
        
        
    
   

    
