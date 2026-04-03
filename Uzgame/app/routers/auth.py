from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.base import Med
from app.schemas.med_schemas import MedCreate, MedLogin, Med as MedSchema, Token, GoogleLoginRequest
from app.auth.auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_or_create_user_from_google
)
from app.core.google_oauth import verify_google_token
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


class ProfileUpdate(BaseModel):
    full_name: str | None = None
    profile_picture: str | None = None


@router.post("/register", response_model=Token)
async def register(med: MedCreate, db: Session = Depends(get_db)):
    """
    Med jadvali uchun yangi foydalanuvchi ro'yxatdan o'tkazish
    """
    # Email tekshirish
    db_user = db.query(Med).filter(Med.email == med.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email allaqachon ro'yxatdan o'tgan"
        )
    
    logger.info(f"[REGISTER] New register attempt: {med.email}")
    
    # Yangi user yaratish
    hashed_password = get_password_hash(med.password)
    db_user = Med(
        email=med.email,
        hashed_password=hashed_password,
        full_name=med.full_name,
        provider="email",
        is_active=True
    )
    
    try:
        # MED TABLE-GA QO'SH
        db.add(db_user)
        db.flush()  # Ensure ID is assigned
        db.commit()
        logger.info(f"✓ User added to med table: {db_user.email} (ID={db_user.id})")
        
        # EMAILUSER TABLE-GA SYNC QIL
        from app.models.emailuser_model import EmailUser
        
        try:
            existing = db.query(EmailUser).filter(EmailUser.email == med.email).first()
            if not existing:
                emailuser = EmailUser(
                    email=med.email,
                    password=hashed_password,
                    full_name=med.full_name
                )
                db.add(emailuser)
                db.commit()
                logger.info(f"✓ User synced to emailuser table: {med.email}")
        except Exception as e:
            logger.error(f"Warning: Could not sync to emailuser table: {str(e)}")
            db.rollback()
            # Don't fail registration if emailuser sync fails
        
        # CRITICAL: Explicit refresh to pull latest from database
        db.refresh(db_user)
        logger.info(f"✓ REGISTERED: {db_user.email} (ID={db_user.id})")
        
        # Create access token and return Token response
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email},
            expires_delta=access_token_expires
        )
        
        logger.info(f"User registered and logged in: {db_user.email}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": db_user
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"ERROR in register: {str(e)}")
        logger.error(f"Type: {type(e).__name__}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration error: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(med: MedLogin, db: Session = Depends(get_db)):
    """
    Med jadvali uchun login jarayoni (email + password)
    
    - **email**: Foydalanuvchining emaili
    - **password**: Parol
    
    Returns: JWT access token
    """
    logger.info(f"[LOGIN] Login request received for: {med.email}")
    # Foydalanuvchini authenticate qilish
    user = authenticate_user(db, med.email, med.password)
    logger.info(f"[LOGIN] Authentication result: {user}, type: {type(user)}, bool: {bool(user)}")
    if not user:
        logger.warning(f"[LOGIN] Authentication failed for {med.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email yoki parol noto'g'ri",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Access token yaratish
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    logger.info(f"User logged in: {user.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/google-login", response_model=Token)
async def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Google OAuth login jarayoni
    """
    # Google tokenni verify qilish
    google_token_info = verify_google_token(request.token)
    
    if not google_token_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token verification failed",
        )
    
    # User yaratish yoki olish
    user = get_or_create_user_from_google(db, google_token_info)
    
    # EMAILUSER TABLE-GA HAM SYNC QIL
    from app.models.emailuser_model import EmailUser
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    try:
        # Tekshir - Google user emailuser tableida mavjudmi?
        emailuser = db.query(EmailUser).filter(EmailUser.email == user.email).first()
        if not emailuser:
            # Agar yo'q bo'lsa, qo'sh
            dummy_password = pwd_context.hash(f"google_{user.google_id}")
            
            emailuser = EmailUser(
                email=user.email,
                password=dummy_password,
                full_name=user.full_name
            )
            db.add(emailuser)
            db.commit()
            logger.info(f"✓ Google user synced to emailuser table: {user.email}")
    except Exception as e:
        logger.warning(f"Could not sync Google user to emailuser table: {str(e)}")
        db.rollback()
        # Don't fail login if sync fails
    
    # Backend access token yaratish
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    logger.info(f"✓ Google login SUCCESS: {user.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=MedSchema)
async def get_current_user_info(current_user: Med = Depends(get_current_active_user)):
    """
    Hozirgi login qilgan foydalanuvchining ma'lumotlarini olish
    """
    return current_user


@router.post("/logout")
async def logout(current_user: Med = Depends(get_current_active_user)):
    """
    Logout (frontend tokenni o'chiradi)
    """
    logger.info(f"User logged out: {current_user.email}")
    return {"message": "Muvaffaqiyatli logout qildingiz"}


@router.get("/me", response_model=MedSchema)
async def get_current_user_info(current_user: Med = Depends(get_current_active_user)):
    """
    Hozirgi foydalanuvchining ma'lumotlarini olish
    """
    logger.info(f"[AUTH] User info requested: {current_user.email}")
    return current_user


@router.put("/profile", response_model=MedSchema)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: Med = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Profil ma'lumotlarini yangilash
    """
    try:
        # Update Med table
        if profile_data.full_name:
            current_user.full_name = profile_data.full_name
        
        if profile_data.profile_picture:
            current_user.profile_picture = profile_data.profile_picture
        
        db.commit()
        db.refresh(current_user)
        logger.info(f"✓ Updated Med profile: {current_user.email}")
        
        # EmailUser table'ga ham sync qilish
        from app.models.emailuser_model import EmailUser
        try:
            emailuser = db.query(EmailUser).filter(EmailUser.email == current_user.email).first()
            if emailuser:
                if profile_data.full_name:
                    emailuser.full_name = profile_data.full_name
                if profile_data.profile_picture:
                    emailuser.profile_picture = profile_data.profile_picture
                db.commit()
                db.refresh(emailuser)
                logger.info(f"✓ Synced EmailUser profile: {current_user.email}")
        except Exception as e:
            logger.error(f"Error syncing EmailUser profile: {str(e)}")
            # Don't fail the request if EmailUser sync fails
        
        logger.info(f"Profile updated: {current_user.email}")
        return current_user
        
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating profile: {str(e)}"
        )

