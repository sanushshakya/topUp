from api.models.wallets_model import Wallets
from bson import ObjectId

class WalletServices:
    @staticmethod
    async def read_wallet_by_user(user_id: str):
        user_id = str(user_id)
        return await Wallets.find_one(Wallets.user_id == user_id)
    
    @staticmethod
    async def read_wallet_by_email(email:str):
        return await Wallets.find_one(Wallets.email == email)

    @staticmethod
    async def create_wallet(user_id: str, email: str):
        wallet = await WalletServices.read_wallet_by_user(user_id)
        user_id = str(user_id)
        if not wallet:
            wallet_doc = Wallets(
                user_id = user_id,
                email = email,
                balance = 0.0
            )
            await wallet_doc.save()
            return wallet_doc
        else:
            return "Wallet already exists."

    @staticmethod
    async def update_wallet_balance(email: str, balance: float):
        wallet = await WalletServices.read_wallet_by_email(email)
        if wallet:
            wallet.email = email
            wallet.balance += balance
            await wallet.save()
            return wallet

    @staticmethod
    async def add_balance(email: str, balance: float):
        return await WalletServices.update_wallet_balance(email, balance)

    @staticmethod
    async def subtract_balance(email: str, balance: float):
        return await WalletServices.update_wallet_balance(email, -balance)

    @staticmethod
    async def delete_wallet(user_id: str):
        wallet = await WalletServices.read_wallet_by_user(user_id)
        if wallet:
            await wallet.delete()
            return "Wallet Deleted Successfully"
