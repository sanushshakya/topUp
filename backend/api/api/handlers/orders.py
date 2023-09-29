from fastapi import APIRouter, Form, HTTPException, status, Request, Depends
import pymongo
from api.services.orders_services import OrdersServices
from api.api.deps.user_deps import get_current_user, is_admin

order_router = APIRouter()

@order_router.get("/read")
async def read_order(current_user = Depends(is_admin)):
    try:
        return await OrdersServices.read_order()
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Orders not found"
        )
@order_router.get("/read_order_by_user/{user_id}")
async def read_order_by_user(user_id:str,
                             current_user = Depends(get_current_user)):
    try:
        return await OrdersServices.read_orders_by_user(user_id)
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Orders not found"
        )
        
@order_router.get("/read_order_by_status")
async def read_order_by_status(current_user = Depends(is_admin)):
    try:
        return await OrdersServices.read_orders_by_status()
    except:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Orders not found"
        )

@order_router.post("/create", summary="Create new order")
async def create_order(name: str = Form(default=None), 
                      email:str = Form(default=None), 
                      gname:str = Form(default='None'),
                      playerid:str = Form(default='None'),
                      product: str = Form(default=None),
                      user_id: str = Form(default=None),
                      current_user = Depends(get_current_user)):
    try:
        order = await OrdersServices.create_order(name, email, gname, playerid, product, user_id)
        return order  # Return the created order object
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Order already exists."
        )
        
@order_router.put("/update/{order_id}/{email}", summary="Update order")
async def update_order(order_id: str, email: str, current_user = Depends(get_current_user)):
    try:
        return await OrdersServices.update_order(order_id, email)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Product not found."
        )
        
@order_router.delete("/delete/{order_id}", summary="Delete order")
async def delete_order(order_id: str, current_user = Depends(is_admin)):
    try:
        return await OrdersServices.delete_order(order_id)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = "Order not found."
        )
        



