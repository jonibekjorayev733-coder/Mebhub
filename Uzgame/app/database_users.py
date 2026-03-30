"""
Users Database Configuration
Alohida users database uchun SQLAlchemy setup
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging

logger = logging.getLogger(__name__)

# Users database URL (alohida)
USERS_DATABASE_URL = "sqlite:///./users.db"

# Base class (models bu basega attach qilina)
UsersBase = declarative_base()

# Engine yaratish
users_engine = create_engine(
    USERS_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# Session factory
UsersSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=users_engine)


def get_users_db():
    """Users database session dependency"""
    db = UsersSessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_users_db():
    """Initialize users database tables"""
    try:
        # Models ni import qilish (jadvalni register qilish uchun)
        from app.models.user_accounts import UserAccount
        
        UsersBase.metadata.create_all(bind=users_engine)
        logger.info("✓ Users database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating users database tables: {e}")
