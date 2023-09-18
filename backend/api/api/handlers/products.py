from fastapi import APIRouter, Form, HTTPException, status, Request,  File, UploadFile
import pymongo
from api.services.products_services import ProductsServices
from api.api.helpers.save_picture import save_picture

product_router = APIRouter()

@product_router.get("/read")
async def read_product():
    try:
        return await ProductsServices.read_products()
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Products not found"
        )
@product_router.get("/read_by_id/{product_id}")
async def read_products_by_id(product_id: str):
    try:
        return await ProductsServices.read_products_by_id(product_id)
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Products not found"
        )

@product_router.get("/read_products_by_cat_name/{cat_name}")
async def read_products_by_cat_name(cat_name: str):
    try:
        return await ProductsServices.read_products_by_cat_name(cat_name)
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Products not found"
        )

@product_router.post("/create", summary="Create new product")
async def create_product(product_name: str = Form(...), 
                      cat_name: str = Form(...),
                      description:str = Form(...), 
                      price: str = Form(...),
                      image_url: UploadFile = File(...)):
    try:
        imageUrl = save_picture(file=image_url, folderName='products', fileName = product_name)
        return await ProductsServices.create_products(product_name, cat_name, description, price, imageUrl)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Proudct already exists."
        )

@product_router.put("/update/{product_id}", summary="Update product")
async def update_product(product_id: str,
                      product_name: str = Form(default=None), 
                      cat_name: str = Form(default=None),   
                      description:str = Form(default=None), 
                      price:str = Form(default=None),
                      image_url: UploadFile = File(default=None),
                      status: str = Form(default=None)):
    try:
        if image_url is None:
            return await ProductsServices.update_products(product_id, product_name, cat_name, description, price, image_url, status)
        image_url = save_picture(file=image_url, folderName='products', fileName = product_name)
        return await ProductsServices.update_products(product_id, product_name, cat_name, description, price, image_url, status)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Product not found."
        )
        
@product_router.delete("/delete/{product_id}", summary="Delete product")
async def deleteEvent(product_id: str):
    try:
        return await ProductsServices.delete_product(product_id)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Product not found."
        )
        



