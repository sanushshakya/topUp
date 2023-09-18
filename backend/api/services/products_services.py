from typing import Optional
from api.models.products_model import Products
from api.models.categories_model import Categories
from beanie.operators import Eq, In
from fastapi import HTTPException, status
from bson import ObjectId

class ProductsServices:
    @staticmethod
    async def read_products():
        return await Products.find_all().to_list()
    
    @staticmethod
    async def read_products_by_id(product_id):
        try:
            object_id = ObjectId(product_id)
            product_doc = await Products.find_one({"_id": object_id})
            return product_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    @staticmethod
    async def read_products_by_cat_name(cat_name):
        try:
            product_doc = await Products.find({"cat_name": cat_name}).to_list()
            return product_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    async def read_products_by_status_pending():
        return await Products.find({"status": "pending"}).to_list()
    
    @staticmethod
    async def read_products_by_id(product_id: str):
        try:
            object_id = ObjectId(product_id)
            event_doc = await Products.find_one({"_id": object_id})
            return event_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def create_products(product_name: str, cat_name: str, description:str, price:str, image_url: str):
        product_doc = Products(
            product_name = product_name,
            cat_name = cat_name,
            description = description,
            price = price,
            image_url = image_url,
            status = "pending"  # Set the initial status to "pending"
        ) 
        await product_doc.save()
        return product_doc
       
    @staticmethod
    async def update_products(product_id: str, product_name: str, cat_name:str, description:str, price: str, image_url: str, status: str):
        product_id = ObjectId(product_id)
        product = await Products.find_one(product_id == Products.id)
        if product_name is not None:
            product.product_name = product_name
        if cat_name is not None:
            product.cat_name = cat_name
        if description is not None:
            product.description = description
        if price is not None:
             product.price = price
        if image_url is not None:
            product.image_url = image_url
        if status is not None:
            product.status = status
        await product.save()
        return product
    
    @staticmethod
    async def delete_product(product_id:str):
        product_id = ObjectId(product_id)
        product = await Products.find_one(product_id == Products.id)
        await product.delete()
        return "Product Deleted Successfully"
        
        
    
   

    
