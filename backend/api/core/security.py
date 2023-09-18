from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Union, Any
from api.core.config import settings
from jose import jwt
from pydantic import EmailStr

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def getPassword(password: str) -> str:
    return password_context.hash(password)

def verifyPassword(password: str, hashedPass: str) -> bool:
    return password_context.verify(password, hashedPass) 


def createAccessToken(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    toEncode = {"exp":expires_delta, "sub": str(subject)}
    encodedJwt = jwt.encode(toEncode, settings.JWT_SECRET_KEY, settings.ALGORITHM)
    
    return encodedJwt

def createRefreshToken(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)

    toEncode = {"exp":expires_delta, "sub": str(subject)}
    encodedJwt = jwt.encode(toEncode, settings.JWT_REFRESH_SECRET_KEY, settings.ALGORITHM)

    return encodedJwt