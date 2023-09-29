from fastapi import APIRouter
health_check_router = APIRouter()

@health_check_router.get("/", summary="Check app health")
def check_health():
    return {"status":"ok"}