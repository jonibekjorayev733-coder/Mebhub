from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base


class Med(Base):
    """Med table - Login, Register va Google OAuth ma'lumotlari"""
    __tablename__ = "med"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)  # Google login uchun null bo'lishi mumkin
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)  # Admin flag
    
    # Google OAuth fields
    google_id = Column(String(255), unique=True, index=True, nullable=True)
    google_email = Column(String(255), nullable=True)
    provider = Column(String(50), default="email")  # "email" yoki "google"
    profile_picture = Column(String(500), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())



# Eski User model uchun compatibility
class User(Base):
    """User table - Eski model (compatibility uchun)"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# Game, TestSet, Question, Option, Score, MultiplayerRoom - eski modellar
class Game(Base):
    """Game model"""
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(String(500))


class TestSet(Base):
    """TestSet model - O'rganish va test to'plamlari"""
    __tablename__ = "test_sets"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)  # Anatomiya, Fiziologiya, etc.
    description = Column(String(500), nullable=True)
    difficulty_level = Column(String(50), default="Medium")  # Beginner, Medium, Advanced
    total_questions = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Question(Base):
    """Question model - Test savollar"""
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    test_set_id = Column(Integer, nullable=False, index=True)  # TestSet-ga bog'lanish
    question_text = Column(String(500), nullable=False)
    question_number = Column(Integer, nullable=False)  # Savol ketma-ketligi
    explanation = Column(String(1000), nullable=True)  # To'g'ri javob izohchisi
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Option(Base):
    """Option model - Savol variantlari"""
    __tablename__ = "options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, nullable=False, index=True)  # Question-ga bog'lanish
    option_text = Column(String(255), nullable=False)
    is_correct = Column(Boolean, default=False)
    option_number = Column(Integer, nullable=False)  # Variant ketma-ketligi (1-4)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Score(Base):
    """Score model"""
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    score = Column(Integer)


class MultiplayerRoom(Base):
    """MultiplayerRoom model"""
    __tablename__ = "multiplayer_rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    room_name = Column(String(255))
