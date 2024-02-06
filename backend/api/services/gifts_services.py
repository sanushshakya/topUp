from api.models.gifts_model import Gifts
from typing import List
from bson import ObjectId
from api.api.helpers.send_email import send_email, send_email_awaiting

class GiftServices:
    @staticmethod
    async def create_gift(product_name: str, tokens: List):
        gift_doc = Gifts(
            product_name = product_name,
            tokens = list(tokens),
        )
        await gift_doc.save()
        return gift_doc

    @staticmethod
    async def read_all_gifts():
        return await Gifts.find_all().to_list()

    @staticmethod
    async def read_gift_by_id(gift_id: str):
        gift_id = ObjectId(gift_id)
        return await Gifts.find_one(Gifts.id == gift_id)

    @staticmethod
    async def update_gift_tokens(product_name: str, tokens: str):
        gift = await Gifts.find_one(Gifts.product_name == product_name)
        if gift:
            gift.product_name = product_name
            gift.tokens.append(tokens)
            await gift.save()
            return gift

    @staticmethod
    async def delete_gift(product_name: str):
        gift = await Gifts.find_one(Gifts.product_name == product_name)
        if gift:
            await gift.delete()
            return "Gift Deleted Successfully"

    @staticmethod
    async def buy_gift_token(product_name: str, email):
        gift = await Gifts.find_one(Gifts.product_name ==  product_name)
        if gift:
            tok = gift.tokens[0]
            gift.tokens.remove(tok)  # Remove purchased token
            await gift.save()
            # Attempt to send the email
            try:
                send_email_awaiting(email, tok)
            except Exception as email_error:
                # Handle the email sending error here (e.g., log the error)
                print(f"Email sending error: {str(email_error)}")
                # Optionally, you can choose to retry sending the email here
            return tok
            
    @staticmethod
    async def delete_token_from_gift(gift_id: str, token_to_delete: str):
        gift_id = ObjectId(gift_id)
        gift = await Gifts.find_one(Gifts.id == gift_id)
        if gift:
            if gift.tokens and token_to_delete in gift.tokens:
                gift.tokens.remove(token_to_delete)
                await gift.save()
                return "Token deleted successfully."
            else:
                return "Token not found in the gift."
        else:
            return "Gift not found."
