from fastapi import APIRouter, Form, HTTPException, status, Request,  File, UploadFile, Depends
import pymongo
from api.services.tournaments_services import TournamentsServices
from api.api.helpers.save_picture import save_picture
from api.api.deps.user_deps import get_current_user, is_admin

tournament_router = APIRouter()

@tournament_router.get("/read")
async def read_tournament():
    try:
        return await TournamentsServices.read_tournament()
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Tournaments not found"
        )

@tournament_router.post("/create", summary="Create new tournament")
async def create_tournament(name: str = Form(...),
                            price: str = Form(...), 
                            description:str = Form(...), 
                            image_url: UploadFile = File(...),
                            current_user = Depends(is_admin)):
    try:
        imageUrl = save_picture(file=image_url, folderName='tournaments', fileName = name)
        return await TournamentsServices.create_tournament(name, price, description, imageUrl)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Tournament already exists."
        )

@tournament_router.put("/update/{tour_id}", summary="Update tournament")
async def update_tournament(tour_id: str,
                            name: str = Form(default=None),   
                            price: str = Form(default=None),
                            description:str = Form(default=None), 
                            image_url: UploadFile = File(default=None),
                            current_user = Depends(is_admin)):
    try:
        if image_url is None:
            return await TournamentsServices.update_tournament(tour_id, name, price, description, image_url)
        image_url = save_picture(file=image_url, folderName='tournaments', fileName = name)
        return await TournamentsServices.update_tournament(tour_id, name, price, description, image_url)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Tournaments not found."
        )
        
@tournament_router.delete("/delete/{tour_id}", summary="Delete tournament")
async def delete_tournament(tour_id: str, current_user = Depends(is_admin)):
    print(tour_id)
    try:
        return await TournamentsServices.delete_tournament(tour_id)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Tournament not found."
        )
        



