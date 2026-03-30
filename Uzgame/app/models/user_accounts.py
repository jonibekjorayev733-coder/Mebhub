"""
Alohida Users Database Models
Login/Register ma'lumotlarini saqlaydigan alohida database
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func


# Import UsersBase from database_users
def get_users_base():
    from app.database_users import UsersBase
    return UsersBase


class UserAccount(get_users_base()):
    """User Accounts table - Login/Register ma'lumotlari"""
    __tablename__ = "user_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Authentication provider
    provider = Column(String(50), default="email")  # "email" yoki "google"
    google_id = Column(String(255), unique=True, index=True, nullable=True)
    google_email = Column(String(255), nullable=True)
    
    # Profile info
    profile_picture = Column(String(500), nullable=True)
    bio = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<UserAccount(email={self.email}, provider={self.provider})>"
