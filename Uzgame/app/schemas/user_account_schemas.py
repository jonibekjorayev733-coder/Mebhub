"""
User Account Schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserAccountCreate(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserAccountLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class UserAccountUpdate(BaseModel):
    """User profile update"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None


class UserAccountResponse(BaseModel):
    """User account response (without password)"""
    id: int
    email: str
    full_name: Optional[str]
    phone: Optional[str]
    is_active: bool
    provider: str
    profile_picture: Optional[str]
    bio: Optional[str]
    created_at: datetime
    last_login: Optional[datetime]
    
    class Config:
        from_attributes = True


class UserAccountToken(BaseModel):
    """Login response with token"""
    access_token: str
    token_type: str
    user: UserAccountResponse
