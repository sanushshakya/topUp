from fastapi import APIRouter, Form, HTTPException, status, Request, Depends
import pymongo
from api.services.orders_services import OrdersServices
from api.api.deps.user_deps import get_current_user, is_admin
from fastapi import Query
from typing import Optional
from datetime import datetime
from api.api.helpers.send_email import send_email

order_router = APIRouter()

@order_router.get("/read")
async def read_order(current_user = Depends(get_current_user)):
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
        
@order_router.post("/read_by_date_range")
async def read_orders_by_date_range(
    from_date: Optional[str] = Form(...),
    to_date: Optional[str] = Form(...),
    token: str = Depends(get_current_user)
):
    try:
        return await OrdersServices.read_by_date_range(from_date, to_date)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orders not found"
        )

@order_router.post("/create/{tok}", summary="Create new order")
async def create_order(tok:str,
                        name: str = Form(default=None), 
                        email:str = Form(default=None), 
                        product: str = Form(default=None),
                        user_id: str = Form(default=None),
                        current_user = Depends(get_current_user)):
    try:
        order = await OrdersServices.create_order(name, email, product, user_id, tok)
        send_email(email)
        return order  # Return the created order object
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Order already exists."
        )
        
@order_router.put("/update/{order_id}/{email}", summary="Update order")
async def update_order(order_id: str, email: str, current_user = Depends(is_admin)):
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
        



