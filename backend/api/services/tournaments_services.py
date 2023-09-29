from typing import Optional
from api.models.tournament_model import Tournaments
from beanie.operators import Eq, In
from fastapi import HTTPException, status
from bson import ObjectId

class TournamentsServices:
    @staticmethod
    async def read_tournament():
        return await Tournaments.find_all().to_list()

    @staticmethod
    async def create_tournament(name: str, price:str, description:str, image_url: str):
        tour_doc = Tournaments(
            name = name,
            price=price,
            description = description,
            image_url = image_url,
        ) 
        await tour_doc.save()
        return tour_doc
       
    @staticmethod
    async def update_tournament(tour_id: str, name:str, price:str, description:str, image_url: str):
        tour_id = ObjectId(tour_id)
        tournaments = await Tournaments.find_one(tour_id == Tournaments.id)
        if name is not None:
            tournaments.name = name
        if price is not None:
            tournaments.price = price
        if description is not None:
            tournaments.description = description
        if image_url is not None:
            tournaments.image_url = image_url
        await tournaments.save()
        return tournaments
    
    @staticmethod
    async def delete_tournament(tour_id:str):
        print(tour_id)
        tour_id = ObjectId(tour_id)
        tournaments = await Tournaments.find_one(tour_id == Tournaments.id)
        await tournaments.delete()
        return "Tournaments Deleted Successfully"
        
        
    
   

    
