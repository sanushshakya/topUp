from typing import Optional
from api.models.categories_model import Categories
from beanie.operators import Eq, In
from fastapi import HTTPException, status
from bson import ObjectId

class CategoriesServices:
    @staticmethod
    async def read_categories():
        return await Categories.find_all().to_list()
    
    @staticmethod
    async def read_categories_by_id(cat_id: str):
        try:
            object_id = ObjectId(cat_id)
            cat_doc = await Categories.find_one({"_id": object_id})
            return cat_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def create_category(cat_name: str, description:str, image_url: str):
        cat_doc = Categories(
            cat_name = cat_name,
            description = description,
            image_url = image_url,
        ) 
        await cat_doc.save()
        return cat_doc
       
    @staticmethod
    async def update_category(cat_id: str, cat_name:str, description:str, image_url: str):
        cat_id = ObjectId(cat_id)
        cat = await Categories.find_one(cat_id == Categories.id)
        if cat_name is not None:
            cat.cat_name = cat_name
        if description is not None:
            cat.description = description
        if image_url is not None:
            cat.image_url = image_url
        await cat.save()
        return cat
    
    @staticmethod
    async def delete_category(cat_id:str):
        cat_id = ObjectId(cat_id)
        cat = await Categories.find_one(cat_id == Categories.id)
        await cat.delete()
        return "Category Deleted Successfully"
        
        
    
   

    
