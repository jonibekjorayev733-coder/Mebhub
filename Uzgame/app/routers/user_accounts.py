"""
User Accounts Authentication Router
Alohida users database uchun login/register endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from app.database_users import get_users_db
from app.database import get_db
from app.models.user_accounts import UserAccount
from app.models.base import Med
from app.schemas.user_account_schemas import (
    UserAccountCreate, UserAccountLogin, UserAccountResponse, UserAccountToken
)
from app.auth.auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["User Accounts"])


def authenticate_user_account(db: Session, email: str, password: str):
    """User account authentication"""
    user = db.query(UserAccount).filter(UserAccount.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


@router.post("/register", response_model=UserAccountResponse)
async def register_user(
    user: UserAccountCreate, 
    users_db: Session = Depends(get_users_db),
    med_db: Session = Depends(get_db)
):
    """
    Yangi user ro'yxatdan o'tkazish (users database + med table)
    """
    # Email allaqachon ro'yxatdan o'tganmi tekshirish (users.db da)
    db_user = users_db.query(UserAccount).filter(UserAccount.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email allaqachon ro'yxatdan o'tgan"
        )
    
    # Yangi user yaratish (users.db da)
    hashed_password = get_password_hash(user.password)
    db_user = UserAccount(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        phone=user.phone,
        provider="email",
        is_active=True
    )
    
    users_db.add(db_user)
    users_db.commit()
    users_db.refresh(db_user)
    logger.info(f"✓ New user registered in users.db: {db_user.email}")
    
    # Med table ga ham qo'shish (app.db da)
    try:
        med_user = Med(
            email=db_user.email,
            hashed_password=hashed_password,
            full_name=db_user.full_name,
            provider="email",
            is_active=True
        )
        med_db.add(med_user)
        med_db.commit()
        logger.info(f"✓ User synced to med table: {db_user.email}")
    except Exception as e:
        logger.error(f"Error syncing to med table: {e}")
        med_db.rollback()
    
    return db_user


@router.post("/login", response_model=UserAccountToken)
async def login_user(
    credentials: UserAccountLogin, 
    users_db: Session = Depends(get_users_db),
    med_db: Session = Depends(get_db)
):
    """
    User login (users database + med table)
    """
    # User authenticate qilish (users.db dan)
    user = authenticate_user_account(users_db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email yoki parol noto'g'ri",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Last login vaqtini yangilash (users.db da)
    user.last_login = datetime.utcnow()
    users_db.commit()
    
    # Med table ga ham qo'shish (app.db da)
    try:
        # Agar med table da mavjud bo'lsa, skip qilish
        existing_med_user = med_db.query(Med).filter(Med.email == user.email).first()
        if not existing_med_user:
            med_user = Med(
                email=user.email,
                hashed_password=user.hashed_password,
                full_name=user.full_name,
                provider="email",
                is_active=True
            )
            med_db.add(med_user)
            med_db.commit()
            logger.info(f"✓ User synced to med table: {user.email}")
        else:
            logger.info(f"✓ User already in med table: {user.email}")
    except Exception as e:
        logger.error(f"Error syncing to med table: {e}")
        med_db.rollback()
    
    # Access token yaratish
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    logger.info(f"✓ User logged in: {user.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserAccountResponse)
async def get_current_user_account(db: Session = Depends(get_users_db)):
    """
    Hozirgi user ma'lumotlarini olish
    """
    # Token dan email olish (auth.py da get_current_active_user dan)
    # Hozircha dummy user return qiladi
    user = db.query(UserAccount).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user


@router.post("/logout")
async def logout_user(db: Session = Depends(get_users_db)):
    """
    User logout (frontend tokenni o'chiradi)
    """
    return {"message": "Muvaffaqiyatli logout qildingiz"}
