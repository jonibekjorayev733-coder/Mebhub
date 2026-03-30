"""
Medical Learning API Routes
O'rganish rejimi uchun API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medical import MedicalTopic, LearningItem, TestQuestion
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/learning", tags=["learning"])


# Pydantic models for API responses
class TopicResponse(BaseModel):
    id: int
    name: str
    description: str
    
    class Config:
        from_attributes = True


class LearningItemResponse(BaseModel):
    id: int
    latin_term: str
    uzbek_term: str
    description: str
    
    class Config:
        from_attributes = True


class TestQuestionResponse(BaseModel):
    id: int
    question_text: str
    correct_answer: str
    options: List[str]
    difficulty: str
    
    class Config:
        from_attributes = True


@router.get("/topics", response_model=List[TopicResponse])
async def get_all_topics(db: Session = Depends(get_db)):
    """
    Barcha o'rganish mavzularini qaytaradi
    GET /learning/topics
    """
    try:
        topics = db.query(MedicalTopic).order_by(MedicalTopic.order).all()
        return topics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/topics/{topic_id}/items", response_model=List[LearningItemResponse])
async def get_learning_items(topic_id: int, db: Session = Depends(get_db)):
    """
    Bitta mavzu uchun o'rganish elementlarini qaytaradi
    GET /learning/topics/{topic_id}/items
    """
    try:
        items = db.query(LearningItem).filter(
            LearningItem.topic_id == topic_id
        ).order_by(LearningItem.order).all()
        
        if not items:
            return []
        
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/topics/{topic_id}/questions", response_model=List[TestQuestionResponse])
async def get_test_questions(topic_id: int, db: Session = Depends(get_db)):
    """
    Bitta mavzu uchun test savollarini qaytaradi
    GET /learning/topics/{topic_id}/questions
    """
    try:
        questions = db.query(TestQuestion).filter(
            TestQuestion.topic_id == topic_id
        ).order_by(TestQuestion.order).all()
        
        if not questions:
            return []
        
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

