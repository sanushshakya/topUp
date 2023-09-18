from fastapi import APIRouter, Form, HTTPException, status, Request,  File, UploadFile
import pymongo
from api.services.banners_services import BannersServices
from api.api.helpers.save_picture import save_picture

banner_router = APIRouter()

@banner_router.get("/read")
async def read_banner():
    try:
        return await BannersServices.read_banners()
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Banners not found"
        )

@banner_router.post("/create", summary="Create new banner")
async def create_banner(image_url: UploadFile = File(...)):
    try:
        imageUrl = save_picture(file=image_url, folderName='banners', fileName = "image")
        return await BannersServices.create_banner(imageUrl)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Banner already exists."
        )

@banner_router.put("/update/{banner_id}", summary="Update banner")
async def update_banner(banner_id: str,
                      image_url: UploadFile = File(default=None)):
    try:
        imageUrl = save_picture(file=image_url, folderName='banners', fileName = 'image')
        return await BannersServices.create_banner(imageUrl)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Banner not found."
        )
        
@banner_router.delete("/delete/{banner_id}", summary="Delete banner")
async def delete_banner(banner_id: str):
    try:
        return await BannersServices.delete_banner(banner_id)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Banner not found."
        )
        



