from api.models.gifts_model import Gifts
from typing import List
from bson import ObjectId

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
    async def read_gift_by_product_name(product_name: str):
        gift = await Gifts.find_one(Gifts.product_name == product_name)
        return gift

    @staticmethod
    async def update_gift_tokens(product_name: str, tokens: list[str]):
        gift = await Gifts.find_one(Gifts.product_name == product_name)
        if gift:
            gift.product_name = product_name
            gift.tokens.extend(tokens)
            await gift.save()
            return gift

    @staticmethod
    async def delete_gift(product_name: str):
        gift = await Gifts.find_one(Gifts.product_name == product_name)
        if gift:
            await gift.delete()
            return "Gift Deleted Successfully"

    @staticmethod
    async def buy_gift_token(product_name: str, email: str):
        gift = await Gifts.find_one(Gifts.product_name ==  product_name)
        if gift:
            tok = gift.tokens[0]
            gift.tokens.remove(tok)  
            await gift.save()
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
