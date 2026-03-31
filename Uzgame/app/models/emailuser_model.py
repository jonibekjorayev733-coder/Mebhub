from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base


class EmailUser(Base):
    """EmailUser table - Login qilgan foydalanuvchilar"""
    __tablename__ = "emailuser"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    profile_picture = Column(Text, nullable=True)
    create_time = Column(DateTime(timezone=True), server_default=func.now())
