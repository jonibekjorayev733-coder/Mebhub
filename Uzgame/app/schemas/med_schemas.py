from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class MedBase(BaseModel):
    """Med model uchun base schema"""
    email: EmailStr
    full_name: Optional[str] = None


class MedCreate(MedBase):
    """Med register uchun schema"""
    password: str


class MedLogin(BaseModel):
    """Med login uchun schema"""
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    """Google login uchun request schema"""
    token: str  # Google ID token


class GoogleTokenInfo(BaseModel):
    """Google token info"""
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    sub: str  # Google user ID


class Med(MedBase):
    """Med model response schema"""
    id: int
    is_active: bool
    is_admin: bool = False
    provider: str
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT Token schema"""
    access_token: str
    token_type: str
    user: Med


class TokenData(BaseModel):
    """Token data schema"""
    email: Optional[str] = None


# Eski User schema (compatibility)
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class User(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool
    
    class Config:
        from_attributes = True
