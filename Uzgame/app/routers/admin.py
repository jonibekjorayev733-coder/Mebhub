"""
Admin Panel Routes
Admin uchun mavzular, o'rganish elementlari va test savollarini qo'shish
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.base import Med, AdminRole
from app.models.medical import MedicalTopic, LearningItem, TestQuestion
from app.auth.auth import get_current_user
from pydantic import BaseModel
from typing import List
import logging

logger = logging.getLogger(__name__)
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
    logger.info(f"[ADMIN] Checking admin access for: {current_user.email}, is_admin: {current_user.is_admin}")
    if not current_user.is_admin:
        logger.error(f"[ADMIN] Access denied - user not admin: {current_user.email}")
        raise HTTPException(status_code=403, detail="Admin access required")
    logger.info(f"[ADMIN] Access granted for: {current_user.email}")
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
        logger.info(f"[ADMIN] CREATE TOPIC - Request: {request.name}")
        # Check if topic already exists
        existing = db.query(MedicalTopic).filter(
            MedicalTopic.name == request.name
        ).first()
        
        if existing:
            logger.warning(f"[ADMIN] CREATE TOPIC - Already exists: {request.name}")
            raise HTTPException(status_code=400, detail="Topic already exists")
        
        new_topic = MedicalTopic(
            name=request.name,
            description=request.description,
            order=request.order
        )
        
        logger.info(f"[ADMIN] CREATE TOPIC - Adding and committing: {request.name}")
        db.add(new_topic)
        db.commit()
        logger.info(f"[ADMIN] CREATE TOPIC - SUCCESS! ID: {new_topic.id}")
        db.refresh(new_topic)
        
        return {
            "id": new_topic.id,
            "name": new_topic.name,
            "description": new_topic.description,
            "order": new_topic.order
        }
    except Exception as e:
        logger.error(f"[ADMIN] CREATE TOPIC - ERROR: {str(e)}", exc_info=True)
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
        logger.info(f"[ADMIN] CREATE ITEM - Request: topic_id={request.topic_id}, latin={request.latin_term}")
        # Check if topic exists
        topic = db.query(MedicalTopic).filter(
            MedicalTopic.id == request.topic_id
        ).first()
        
        if not topic:
            logger.warning(f"[ADMIN] CREATE ITEM - Topic not found: {request.topic_id}")
            raise HTTPException(status_code=404, detail="Topic not found")
        
        new_item = LearningItem(
            topic_id=request.topic_id,
            latin_term=request.latin_term,
            uzbek_term=request.uzbek_term,
            description=request.description,
            order=request.order
        )
        
        logger.info(f"[ADMIN] CREATE ITEM - Adding and committing: {request.latin_term}")
        db.add(new_item)
        db.commit()
        logger.info(f"[ADMIN] CREATE ITEM - SUCCESS! ID: {new_item.id}")
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
        logger.error(f"[ADMIN] CREATE ITEM - ERROR: {str(e)}", exc_info=True)
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
        logger.info(f"[ADMIN] CREATE QUESTION - Request: topic_id={request.topic_id}")
        # Check if topic exists
        topic = db.query(MedicalTopic).filter(
            MedicalTopic.id == request.topic_id
        ).first()
        
        if not topic:
            logger.warning(f"[ADMIN] CREATE QUESTION - Topic not found: {request.topic_id}")
            raise HTTPException(status_code=404, detail="Topic not found")
        
        new_question = TestQuestion(
            topic_id=request.topic_id,
            question_text=request.question_text,
            correct_answer=request.correct_answer,
            options=request.options,
            difficulty=request.difficulty,
            order=request.order
        )
        
        logger.info(f"[ADMIN] CREATE QUESTION - Adding and committing")
        db.add(new_question)
        db.commit()
        logger.info(f"[ADMIN] CREATE QUESTION - SUCCESS! ID: {new_question.id}")
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
        logger.error(f"[ADMIN] CREATE QUESTION - ERROR: {str(e)}", exc_info=True)
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
        topics = db.query(MedicalTopic).order_by(MedicalTopic.id.desc()).all()
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
        items = db.query(LearningItem).order_by(LearningItem.id.desc()).all()
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
        questions = db.query(TestQuestion).order_by(TestQuestion.id.desc()).all()
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


# UPDATE TOPIC
class UpdateTopicRequest(BaseModel):
    name: str = None
    description: str = None
    order: int = None


@router.put("/topics/{topic_id}")
async def update_topic(
    topic_id: int,
    request: UpdateTopicRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Mavzuni yangilash
    PUT /admin/topics/{topic_id}
    """
    try:
        topic = db.query(MedicalTopic).filter(
            MedicalTopic.id == topic_id
        ).first()
        
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        if request.name is not None:
            topic.name = request.name
        if request.description is not None:
            topic.description = request.description
        if request.order is not None:
            topic.order = request.order
        
        db.commit()
        db.refresh(topic)
        
        return {
            "id": topic.id,
            "name": topic.name,
            "description": topic.description,
            "order": topic.order,
            "message": "Topic updated successfully"
        }
    except Exception as e:
        db.rollback()
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
        logger.info(f"[ADMIN] DELETE TOPIC - ID: {topic_id}")
        
        topic = db.query(MedicalTopic).filter(
            MedicalTopic.id == topic_id
        ).first()
        
        if not topic:
            logger.warning(f"[ADMIN] DELETE TOPIC - Not found: {topic_id}")
            raise HTTPException(status_code=404, detail="Topic not found")
        
        logger.info(f"[ADMIN] DELETE TOPIC - Found topic: {topic.name}")
        
        # Delete related items and questions
        items_deleted = db.query(LearningItem).filter(
            LearningItem.topic_id == topic_id
        ).delete()
        logger.info(f"[ADMIN] DELETE TOPIC - Deleted {items_deleted} learning items")
        
        questions_deleted = db.query(TestQuestion).filter(
            TestQuestion.topic_id == topic_id
        ).delete()
        logger.info(f"[ADMIN] DELETE TOPIC - Deleted {questions_deleted} questions")
        
        db.delete(topic)
        db.commit()
        logger.info(f"[ADMIN] DELETE TOPIC - SUCCESS! Deleted ID: {topic_id}")
        
        return {"message": "Topic deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ADMIN] DELETE TOPIC - ERROR: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# UPDATE LEARNING ITEM
class UpdateItemRequest(BaseModel):
    latin_term: str = None
    uzbek_term: str = None
    description: str = None
    order: int = None


@router.put("/learning-items/{item_id}")
async def update_learning_item(
    item_id: int,
    request: UpdateItemRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    O'rganish elementini yangilash
    PUT /admin/learning-items/{item_id}
    """
    try:
        item = db.query(LearningItem).filter(
            LearningItem.id == item_id
        ).first()
        
        if not item:
            raise HTTPException(status_code=404, detail="Learning item not found")
        
        if request.latin_term is not None:
            item.latin_term = request.latin_term
        if request.uzbek_term is not None:
            item.uzbek_term = request.uzbek_term
        if request.description is not None:
            item.description = request.description
        if request.order is not None:
            item.order = request.order
        
        db.commit()
        db.refresh(item)
        
        return {
            "id": item.id,
            "topic_id": item.topic_id,
            "latin_term": item.latin_term,
            "uzbek_term": item.uzbek_term,
            "description": item.description,
            "order": item.order,
            "message": "Learning item updated successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# DELETE LEARNING ITEM
@router.delete("/learning-items/{item_id}")
async def delete_learning_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    O'rganish elementini o'chirish
    DELETE /admin/learning-items/{item_id}
    """
    try:
        logger.info(f"[ADMIN] DELETE LEARNING ITEM - ID: {item_id}")
        
        item = db.query(LearningItem).filter(
            LearningItem.id == item_id
        ).first()
        
        if not item:
            logger.warning(f"[ADMIN] DELETE LEARNING ITEM - Not found: {item_id}")
            raise HTTPException(status_code=404, detail="Learning item not found")
        
        logger.info(f"[ADMIN] DELETE LEARNING ITEM - Found item: {item.latin_term}")
        db.delete(item)
        db.commit()
        logger.info(f"[ADMIN] DELETE LEARNING ITEM - SUCCESS! Deleted ID: {item_id}")
        
        return {"message": "Learning item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ADMIN] DELETE LEARNING ITEM - ERROR: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
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


# UPDATE QUESTION
class UpdateQuestionRequest(BaseModel):
    question_text: str = None
    correct_answer: str = None
    options: List[str] = None
    difficulty: str = None
    order: int = None


@router.put("/questions/{question_id}")
async def update_question(
    question_id: int,
    request: UpdateQuestionRequest,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Test savolini yangilash
    PUT /admin/questions/{question_id}
    """
    try:
        logger.info(f"[ADMIN] UPDATE QUESTION - ID: {question_id}")
        
        question = db.query(TestQuestion).filter(
            TestQuestion.id == question_id
        ).first()
        
        if not question:
            logger.warning(f"[ADMIN] UPDATE QUESTION - Not found: {question_id}")
            raise HTTPException(status_code=404, detail="Question not found")
        
        if request.question_text is not None:
            question.question_text = request.question_text
        if request.correct_answer is not None:
            question.correct_answer = request.correct_answer
        if request.options is not None:
            question.options = request.options
        if request.difficulty is not None:
            question.difficulty = request.difficulty
        if request.order is not None:
            question.order = request.order
        
        db.commit()
        db.refresh(question)
        logger.info(f"[ADMIN] UPDATE QUESTION - SUCCESS! ID: {question_id}")
        
        return {
            "id": question.id,
            "topic_id": question.topic_id,
            "question_text": question.question_text,
            "correct_answer": question.correct_answer,
            "options": question.options,
            "difficulty": question.difficulty,
            "order": question.order,
            "message": "Question updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ADMIN] UPDATE QUESTION - ERROR: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# DELETE QUESTION
@router.delete("/questions/{question_id}")
async def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin: Med = Depends(check_admin)
):
    """
    Test savolini o'chirish
    DELETE /admin/questions/{question_id}
    """
    try:
        logger.info(f"[ADMIN] DELETE QUESTION - ID: {question_id}")
        
        question = db.query(TestQuestion).filter(
            TestQuestion.id == question_id
        ).first()
        
        if not question:
            logger.warning(f"[ADMIN] DELETE QUESTION - Not found: {question_id}")
            raise HTTPException(status_code=404, detail="Question not found")
        
        logger.info(f"[ADMIN] DELETE QUESTION - Found question: {question.question_text}")
        db.delete(question)
        db.commit()
        logger.info(f"[ADMIN] DELETE QUESTION - SUCCESS! Deleted ID: {question_id}")
        
        return {"message": "Question deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ADMIN] DELETE QUESTION - ERROR: {str(e)}", exc_info=True)
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
        
        # Create AdminRole entry
        existing_role = db.query(AdminRole).filter(AdminRole.user_id == user.id).first()
        if not existing_role:
            admin_role = AdminRole(
                user_id=user.id,
                email=user.email,
                role="admin",
                permissions="manage_topics,manage_users,manage_admins"
            )
            db.add(admin_role)
            db.commit()
        
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
        
        # Delete AdminRole entry
        db.query(AdminRole).filter(AdminRole.user_id == user.id).delete()
        db.commit()
        
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
