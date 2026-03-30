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


# Create alias endpoints for frontend compatibility
@router.post("/learning-items")
async def create_learning_item(
    request: CreateItemRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Yangi o'rganish elementi qo'shish (alias)
    POST /admin/learning-items
    """
    return await create_item(request, db, admin)


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


# GET ALL LEARNING ITEMS
@router.get("/learning-items")
async def get_all_learning_items(
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Barcha o'rganish elementlarini olish
    GET /admin/learning-items
    """
    try:
        items = db.query(LearningItem).order_by(LearningItem.order).all()
        return [
            {
                "id": item.id,
                "topic_id": item.topic_id,
                "latin_term": item.latin_term,
                "uzbek_term": item.uzbek_term,
                "description": item.description,
                "order": item.order
            }
            for item in items
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET ALL QUESTIONS
@router.get("/questions")
async def get_all_questions(
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Barcha test savollarini olish
    GET /admin/questions
    """
    try:
        questions = db.query(TestQuestion).order_by(TestQuestion.order).all()
        return [
            {
                "id": question.id,
                "topic_id": question.topic_id,
                "question_text": question.question_text,
                "correct_answer": question.correct_answer,
                "options": question.options,
                "difficulty": question.difficulty,
                "order": question.order
            }
            for question in questions
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET ALL USERS
@router.get("/users")
async def get_all_users(
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Barcha foydalanuvchilarni olish
    GET /admin/users
    """
    try:
        users = db.query(Med).all()
        return [
            {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_admin": user.is_admin,
                "created_at": str(user.created_at) if hasattr(user, 'created_at') else None
            }
            for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# DELETE TOPIC
@router.delete("/topics/{topic_id}")
async def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Mavzuni o'chirish
    DELETE /admin/topics/{topic_id}
    """
    try:
        topic = db.query(MedicalTopic).filter(
            MedicalTopic.id == topic_id
        ).first()
        
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        # Delete related items and questions
        db.query(LearningItem).filter(
            LearningItem.topic_id == topic_id
        ).delete()
        db.query(TestQuestion).filter(
            TestQuestion.topic_id == topic_id
        ).delete()
        
        db.delete(topic)
        db.commit()
        
        return {"message": "Topic deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# DELETE USER
@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Foydalanuvchini o'chirish
    DELETE /admin/users/{user_id}
    """
    try:
        user = db.query(Med).filter(Med.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.delete(user)
        db.commit()
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Create Admin User
class CreateAdminRequest(BaseModel):
    email: str
    password: str
    full_name: str = ""


@router.post("/create-admin")
async def create_admin(
    request: CreateAdminRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Yangi admin foydalanuvchi qo'shish
    POST /admin/create-admin
    """
    try:
        from app.auth.auth import get_password_hash
        
        # Check if user already exists
        existing = db.query(Med).filter(Med.email == request.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create new admin
        new_admin = Med(
            email=request.email,
            password_hash=get_password_hash(request.password),
            full_name=request.full_name,
            is_admin=True
        )
        
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        
        return {
            "id": new_admin.id,
            "email": new_admin.email,
            "full_name": new_admin.full_name,
            "is_admin": new_admin.is_admin,
            "message": "Admin created successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Update User to Admin
@router.put("/users/{user_id}/make-admin")
async def make_user_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Foydalanuvchini admin qilish
    PUT /admin/users/{user_id}/make-admin
    """
    try:
        user = db.query(Med).filter(Med.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.is_admin = True
        db.commit()
        db.refresh(user)
        
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_admin": user.is_admin,
            "message": "User promoted to admin"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Remove Admin Status
@router.put("/users/{user_id}/remove-admin")
async def remove_user_admin(
    user_id: int,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Foydalanuvchini admin statusdan chiqarish
    PUT /admin/users/{user_id}/remove-admin
    """
    try:
        user = db.query(Med).filter(Med.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.is_admin = False
        db.commit()
        db.refresh(user)
        
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_admin": user.is_admin,
            "message": "Admin status removed"
        }
    except Exception as e:
        db.rollback()
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
