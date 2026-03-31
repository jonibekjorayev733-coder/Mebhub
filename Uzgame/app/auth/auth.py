from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import Med
from app.schemas.med_schemas import TokenData
import os
from dotenv import load_dotenv
import logging
import bcrypt

load_dotenv()
logger = logging.getLogger(__name__)

# Authentication constants
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash"""
    if not plain_password or not hashed_password:
        return False
    
    try:
        plain_bytes = plain_password[:72].encode('utf-8')
        hash_bytes = hashed_password.encode('utf-8') if isinstance(hashed_password, str) else hashed_password
        result = bcrypt.checkpw(plain_bytes, hash_bytes)
        logger.debug(f"[AUTH] Password verification result: {result}")
        return result
    except Exception as e:
        logger.debug(f"[AUTH] Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Generate bcrypt hash from password"""
    try:
        password_bytes = password[:72].encode('utf-8')
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode('utf-8')
    except Exception as e:
        logger.error(f"[AUTH] Error hashing password: {e}")
        raise



def authenticate_user(db: Session, email: str, password: str) -> Optional[Med]:
    """Userni email va password orqali authenticate qilish"""
    logger.info(f"[AUTH] Authenticating user: {email}")
    user = db.query(Med).filter(Med.email == email).first()
    if not user:
        logger.warning(f"[AUTH] User not found: {email}")
        return False
    if not user.hashed_password:
        logger.warning(f"[AUTH] User has no password hash: {email}")
        return False
    
    password_valid = verify_password(password, user.hashed_password)
    logger.info(f"[AUTH] Password valid for {email}: {password_valid}")
    
    if not password_valid:
        return False
    
    logger.info(f"[AUTH] User authenticated successfully: {email}")
    return user


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
    logger.info(f"[AUTH] get_current_user called, token: {token[:50] if token else 'None'}...")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.info(f"[AUTH] Token decoded successfully, payload: {payload}")
        email: str = payload.get("sub")
        if email is None:
            logger.error(f"[AUTH] No email in token payload")
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError as e:
        logger.error(f"[AUTH] JWT decode error: {e}")
        raise credentials_exception
    user = db.query(Med).filter(Med.email == token_data.email).first()
    if user is None:
        logger.error(f"[AUTH] User not found in DB: {token_data.email}")
        raise credentials_exception
    logger.info(f"[AUTH] User found and authenticated: {user.email}")
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

