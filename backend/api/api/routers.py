from fastapi import APIRouter
from api.api.handlers import products, categories, banners, users, orders
from api.api.auth.jwt import auth_router

router =  APIRouter()

router.include_router(products.product_router, prefix="/product", tags=["product"])
router.include_router(categories.cat_router, prefix="/category", tags=["category"])
router.include_router(banners.banner_router, prefix="/banner", tags=["banner"])
router.include_router(users.user_router, prefix="/user", tags=["user"])
router.include_router(orders.order_router, prefix="/order", tags=["order"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
