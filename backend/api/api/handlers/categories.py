from fastapi import APIRouter, Form, HTTPException, status, Request,  File, UploadFile
import pymongo
from api.services.categories_services import CategoriesServices
from api.api.helpers.save_picture import save_picture

cat_router = APIRouter()

@cat_router.get("/read")
async def read_cat():
    try:
        return await CategoriesServices.read_categories()
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Categories not found"
        )

@cat_router.post("/create", summary="Create new category")
async def create_cat(cat_name: str = Form(...), 
                      description:str = Form(...), 
                      image_url: UploadFile = File(...)):
    try:
        imageUrl = save_picture(file=image_url, folderName='categories', fileName = cat_name)
        return await CategoriesServices.create_category(cat_name, description, imageUrl)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Category already exists."
        )

@cat_router.put("/update/{cat_id}", summary="Update category")
async def update_cat(cat_id: str,
                      cat_name: str = Form(default=None),   
                      description:str = Form(default=None), 
                      image_url: UploadFile = File(default=None)):
    try:
        if image_url is None:
            return await CategoriesServices.update_category(cat_id, cat_name, description, image_url)
        image_url = save_picture(file=image_url, folderName='categories', fileName = cat_name)
        return await CategoriesServices.update_category(cat_id, cat_name, description, image_url)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Category not found."
        )
        
@cat_router.delete("/delete/{cat_id}", summary="Delete category")
async def delete_cat(cat_id: str):
    try:
        return await CategoriesServices.delete_category(cat_id)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Category not found."
        )
        



