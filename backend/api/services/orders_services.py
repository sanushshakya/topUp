from typing import Optional
from api.models.orders_model import Order
from fastapi import HTTPException, status
from bson import ObjectId
from api.api.helpers.send_email import send_email, send_email_awaiting

class OrdersServices:
    @staticmethod
    async def read_order():
        return await Order.find_all().to_list()
    
    @staticmethod
    async def read_orders_by_user(user_id: str):
        try:

            order_doc = await Order.find({"user_id": user_id}).to_list()
            return order_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    async def read_orders_by_status():
        try:
            order_doc = await Order.find({"status": "pending"}).to_list()
            return order_doc
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @staticmethod
    async def create_order(name: str, email: str, game_name: str, player_id: str, product: str, user_id: str ):
        order_doc = Order(
            name = name,
            email = email,
            game_name  = game_name,
            player_id = player_id,
            product = product,
            user_id = user_id,
            status ='pending'
        )
        await order_doc.save()
        # Attempt to send the email
        try:
            send_email_awaiting(email)
        except Exception as email_error:
            # Handle the email sending error here (e.g., log the error)
            print(f"Email sending error: {str(email_error)}")
            # Optionally, you can choose to retry sending the email here
        return order_doc
    
    @staticmethod
    async def update_order(order_id: str, email: str):
        try:
            order_id = ObjectId(order_id)
            order = await Order.find_one(order_id == Order.id)
            
            # Attempt to send the email
            try:
                send_email(email)
            except Exception as email_error:
                # Handle the email sending error here (e.g., log the error)
                print(f"Email sending error: {str(email_error)}")
                # Optionally, you can choose to retry sending the email here
            
            order.status = 'complete'
            await order.save()
            
            return order
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @staticmethod
    async def delete_order(order_id:str):
        order_id = ObjectId(order_id)
        order = await Order.find_one(order_id == Order.id)
        await order.delete()
        return "Order Deleted Successfully"
        
        
    
   

    
