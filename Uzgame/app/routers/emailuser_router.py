from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import get_db
from app.models.emailuser_model import EmailUser
from app.models.base import Med
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/emailuser", tags=["emailuser"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class EmailUserCreate(BaseModel):
    email: str
    password: str
    full_name: str


class EmailUserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    create_time: datetime
    
    class Config:
        from_attributes = True


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/register", response_model=EmailUserResponse)
def register_emailuser(user_data: EmailUserCreate, db: Session = Depends(get_db)):
    """Yangi foydalanuvchi ro'yxatga olish"""
    
    # Tekshir - email already exists?
    existing_email = db.query(EmailUser).filter(EmailUser.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Parolni hash qil
    hashed_pwd = hash_password(user_data.password)
    
    # EmailUser table-ga qo'sh
    new_user = EmailUser(
        email=user_data.email,
        password=hashed_pwd,
        full_name=user_data.full_name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Med table-ga ham qo'sh (sync)
    med_user = Med(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name,
        provider="email",
        is_active=True
    )
    db.add(med_user)
    db.commit()
    
    return new_user


@router.post("/login")
def login_emailuser(email: str, password: str, db: Session = Depends(get_db)):
    """Login - emailuser table-dan tekshir"""
    
    # EmailUser-dan topish
    user = db.query(EmailUser).filter(EmailUser.email == email).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Med table-da ham mavjud ekanligini tekshir, agar yo'q bo'lsa qo'sh
    med_user = db.query(Med).filter(Med.email == email).first()
    if not med_user:
        med_user = Med(
            email=email,
            hashed_password=user.password,
            full_name=user.full_name,
            provider="email",
            is_active=True
        )
        db.add(med_user)
        db.commit()
    
    return {
        "status": "success",
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }


@router.get("/users/{user_id}", response_model=EmailUserResponse)
def get_emailuser(user_id: int, db: Session = Depends(get_db)):
    """Foydalanuvchi ma'lumotlarini olish"""
    
    user = db.query(EmailUser).filter(EmailUser.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.get("/all")
def get_all_emailusers(db: Session = Depends(get_db)):
    """Barcha emailuser-larni olish"""
    
    users = db.query(EmailUser).all()
    
    return {
        "total": len(users),
        "users": users
    }
