from typing import Optional
from api.models.banners_model import Banners
from fastapi import HTTPException, status
from bson import ObjectId

class BannersServices:
    @staticmethod
    async def read_banners():
        return await Banners.find_all().to_list()
    
    @staticmethod
    async def read_banner_by_id(banner_id: str):
        try:
            object_id = ObjectId(banner_id)
            banner_doc = await Banners.find_one({"_id": object_id})
            return banner_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def create_banner(image_url):
        banner_doc = Banners(
            image_url = image_url
        ) 
        await banner_doc.save()
        return banner_doc
       
    @staticmethod
    async def update_banner(banner_id: str, image_url):
        banner_id = ObjectId(banner_id)
        banner = await Banners.find_one(banner_id == Banners.id)
        if image_url is not None:
            banner.image_url = image_url
        
        await banner.save()
        return banner
    
    @staticmethod
    async def delete_banner(banner_id:str):
        banner_id = ObjectId(banner_id)
        banner= await Banners.find_one(banner_id == Banners.id)
        await banner.delete()
        return "Banner Deleted Successfully"
        
        
    
   

    
