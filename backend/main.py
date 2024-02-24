import os
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi import FastAPI
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from api.core.config import settings
from api.models.products_model import Products
from api.models.categories_model import Categories
from api.models.banners_model import Banners
from api.models.tournament_model import Tournaments
from api.models.users_model import Users
from api.models.orders_model import Order
from api.models.wallets_model import Wallets
from api.models.gifts_model import Gifts
from api.models.transactions_model import Transactions
from api.api.routers import router
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.APP_NAME}/openapi.json"
)

# Set up CORS
origins = [
    "*",
    "http://localhost:5173"
]

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Startup Event
@app.on_event("startup")
async def startup_db_client():
    env = os.getenv("ENV", "LOCAL")
    if env == "STAGE":
        db_url = settings.DB_STAGE_URL
    elif env == "PROD":
        db_url = settings.DB_PROD_URL
    else:
        db_url = settings.DB_LOCAL_URL
    db_client = AsyncIOMotorClient(db_url).topup

    await init_beanie(
        database = db_client,
        document_models= [
            Products,
            Categories,
            Banners,
            Users,
            Order,
            Tournaments,
            Wallets,
            Gifts,
            Transactions
        ]
    )

#include our  API router
app.include_router(router,prefix=settings.APP_NAME)

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="localhost",
        port=8000,
        reload=settings.DEBUG_MODE
        )
