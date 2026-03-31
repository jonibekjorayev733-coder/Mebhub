"""
Medical Terminology Models
Tibbiy terminologiya modellari
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class MedicalTopic(Base):
    """Medical topic/subject"""
    __tablename__ = "medical_topics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    
    # Relationships
    learning_items = relationship("LearningItem", back_populates="topic", cascade="all, delete-orphan")
    test_questions = relationship("TestQuestion", back_populates="topic", cascade="all, delete-orphan")


class LearningItem(Base):
    """Learning item - Latin term with Uzbek translation"""
    __tablename__ = "learning_items"
    
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("medical_topics.id"), nullable=False)
    latin_term = Column(String(255), nullable=False)
    uzbek_term = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    
    # Relationship
    topic = relationship("MedicalTopic", back_populates="learning_items")


class TestQuestion(Base):
    """Test question for medical topics"""
    __tablename__ = "test_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("medical_topics.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    correct_answer = Column(String(500), nullable=False)
    options = Column(JSON, nullable=False)  # List of options as JSON
    difficulty = Column(String(50), default="medium")  # easy, medium, hard
    order = Column(Integer, default=0)
    
    # Relationship
    topic = relationship("MedicalTopic", back_populates="test_questions")


class UserCertificate(Base):
    """User certificate - issued when all tests are completed"""
    __tablename__ = "user_certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    profile_picture = Column(Text, nullable=True)  # Base64 or URL
    total_topics = Column(Integer, nullable=False)
    completed_topics = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    issued_date = Column(DateTime, default=datetime.utcnow)
    certificate_number = Column(String(50), nullable=False, unique=True, index=True)  # Unique certificate ID
    signature = Column(String(255), nullable=True)  # Name of signer/institution
    created_at = Column(DateTime, default=datetime.utcnow)

