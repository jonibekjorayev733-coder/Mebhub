from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import Med
from app.schemas.med_schemas import TokenData
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

# Authentication constants
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Passwordni verify qilish - bcrypt 72 byte limitini hisobga olish"""
    try:
        # Bcrypt has a 72 byte limit - truncate if necessary
        truncated_password = plain_password[:72]
        return pwd_context.verify(truncated_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Password xeshini olish - bcrypt 72 byte limitini hisobga olish"""
    # Bcrypt has a 72 byte limit - truncate if necessary
    truncated_password = password[:72]
    return pwd_context.hash(truncated_password)


def authenticate_user(db: Session, email: str, password: str) -> Optional[Med]:
    """Userni email va password orqali authenticate qilish"""
    try:
        user = db.query(Med).filter(Med.email == email).first()
        if not user:
            return False
        if not user.hashed_password or not verify_password(password, user.hashed_password):
            return False
        return user
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Access token yaratish"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Med:
    """Hozirgi userni token orqali olish"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(Med).filter(Med.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Med = Depends(get_current_user),
) -> Med:
    """Faol userni olish"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_or_create_user_from_google(db: Session, google_token_info: dict) -> Med:
    """Google token info orqali user yaratish yoki olish"""
    # Google ID orqali user topish
    user = db.query(Med).filter(Med.google_id == google_token_info["sub"]).first()
    
    if user:
        # User mavjud bo'lsa, ma'lumotlarni update qilish
        user.google_email = google_token_info["email"]
        user.full_name = google_token_info.get("name", user.full_name)
        user.profile_picture = google_token_info.get("picture")
        db.commit()
        db.refresh(user)
        return user
    
    # Yangi user yaratish
    new_user = Med(
        email=google_token_info["email"],
        google_id=google_token_info["sub"],
        google_email=google_token_info["email"],
        full_name=google_token_info.get("name"),
        profile_picture=google_token_info.get("picture"),
        provider="google",
        is_active=True,
        hashed_password=None  # Google login uchun password kerak emas
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"New user created via Google: {new_user.email}")
    return new_user

