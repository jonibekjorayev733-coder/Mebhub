"""
Admin Panel Routes
Admin uchun mavzular, o'rganish elementlari va test savollarini qo'shish
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import Med
from app.models.medical import MedicalTopic, LearningItem, TestQuestion
from app.auth.auth import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/admin", tags=["admin"])


# Pydantic models
class CreateTopicRequest(BaseModel):
    name: str
    description: str
    order: int = 0


class CreateItemRequest(BaseModel):
    topic_id: int
    latin_term: str
    uzbek_term: str
    description: str
    order: int = 0


class CreateQuestionRequest(BaseModel):
    topic_id: int
    question_text: str
    correct_answer: str
    options: List[str]
    difficulty: str = "medium"
    order: int = 0


# Helper: Check if user is admin
def check_admin(current_user: Med = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# CREATE TOPIC
@router.post("/topics")
async def create_topic(
    request: CreateTopicRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Yangi mavzu qo'shish
    POST /admin/topics
    """
    try:
        # Check if topic already exists
        existing = db.query(MedicalTopic).filter(
            MedicalTopic.name == request.name
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Topic already exists")
        
        new_topic = MedicalTopic(
            name=request.name,
            description=request.description,
            order=request.order
        )
        
        db.add(new_topic)
        db.commit()
        db.refresh(new_topic)
        
        return {
            "id": new_topic.id,
            "name": new_topic.name,
            "description": new_topic.description,
            "order": new_topic.order
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# CREATE LEARNING ITEM
@router.post("/items")
async def create_item(
    request: CreateItemRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Yangi o'rganish elementi qo'shish
    POST /admin/items
    """
    try:
        # Check if topic exists
        topic = db.query(MedicalTopic).filter(
            MedicalTopic.id == request.topic_id
        ).first()
        
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        new_item = LearningItem(
            topic_id=request.topic_id,
            latin_term=request.latin_term,
            uzbek_term=request.uzbek_term,
            description=request.description,
            order=request.order
        )
        
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        return {
            "id": new_item.id,
            "topic_id": new_item.topic_id,
            "latin_term": new_item.latin_term,
            "uzbek_term": new_item.uzbek_term,
            "description": new_item.description,
            "order": new_item.order
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# CREATE TEST QUESTION
@router.post("/questions")
async def create_question(
    request: CreateQuestionRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Yangi test savoli qo'shish
    POST /admin/questions
    """
    try:
        # Check if topic exists
        topic = db.query(MedicalTopic).filter(
            MedicalTopic.id == request.topic_id
        ).first()
        
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        new_question = TestQuestion(
            topic_id=request.topic_id,
            question_text=request.question_text,
            correct_answer=request.correct_answer,
            options=request.options,
            difficulty=request.difficulty,
            order=request.order
        )
        
        db.add(new_question)
        db.commit()
        db.refresh(new_question)
        
        return {
            "id": new_question.id,
            "topic_id": new_question.topic_id,
            "question_text": new_question.question_text,
            "correct_answer": new_question.correct_answer,
            "options": new_question.options,
            "difficulty": new_question.difficulty,
            "order": new_question.order
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# GET ALL TOPICS
@router.get("/topics")
async def get_all_topics(
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Barcha mavzularni olish
    GET /admin/topics
    """
    try:
        topics = db.query(MedicalTopic).order_by(MedicalTopic.order).all()
        return [
            {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description,
                "order": topic.order
            }
            for topic in topics
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET STATS
@router.get("/stats")
async def get_stats(
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Admin statistikasini olish
    GET /admin/stats
    """
    try:
        topics_count = db.query(MedicalTopic).count()
        items_count = db.query(LearningItem).count()
        questions_count = db.query(TestQuestion).count()
        users_count = db.query(Med).count()
        
        return {
            "total_topics": topics_count,
            "total_items": items_count,
            "total_questions": questions_count,
            "total_users": users_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
