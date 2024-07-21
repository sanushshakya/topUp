from fastapi import APIRouter
from api.api.handlers import products, categories, banners, users, orders, tournaments, wallets, gifts, transactions, tokens
from api.api.auth.jwt import auth_router
from api.api.health.health_check import health_check_router

router =  APIRouter()

router.include_router(products.product_router, prefix="/product", tags=["product"])
router.include_router(categories.cat_router, prefix="/category", tags=["category"])
router.include_router(banners.banner_router, prefix="/banner", tags=["banner"])
router.include_router(users.user_router, prefix="/user", tags=["user"])
router.include_router(orders.order_router, prefix="/order", tags=["order"])
router.include_router(tournaments.tournament_router, prefix="/tournament", tags=["tournament"])
router.include_router(wallets.wallet_router, prefix="/wallet", tags=["wallet"])
router.include_router(gifts.gift_router, prefix="/gift", tags=["gift"])
router.include_router(transactions.transaction_router, prefix="/transaction", tags=["transaction"])
router.include_router(tokens.token_router, prefix="/token", tags=["token"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(health_check_router, prefix="/health",tags=["health"])
