from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class TeacherTest(Base):
    """O'qituvchi yaratgan test - sarlavha, tavsif, savollar"""
    __tablename__ = "teacher_tests"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    # questions: [{"question": str, "options": [A,B,C,D], "correctAnswer": 0-3}]
    questions = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    teacher = relationship("Teacher", back_populates="tests")
    results = relationship("TestResult", back_populates="test", cascade="all, delete-orphan")
