from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from pydantic import BaseModel
from typing import List
from datetime import datetime

from ..database import get_db
from ..models import User, TeacherMessage
from .auth import get_current_user

router = APIRouter(prefix="/student", tags=["student"])


class SendMessageToTeacherRequest(BaseModel):
    message: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    is_read: int
    timestamp: datetime
    sender_name: str
    is_from_teacher: bool

    class Config:
        from_attributes = True


@router.post("/send-message")
def send_message_to_teacher(
    request: SendMessageToTeacherRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Student sends message to teacher"""
    
    # Find a teacher (for now, just get the first teacher)
    # TODO: In future, allow student to select specific teacher
    teacher = db.query(User).filter(User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="No teacher available")
    
    # Create message
    message = TeacherMessage(
        sender_id=current_user.id,
        receiver_id=teacher.id,
        message=request.message,
        is_read=0
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return {"message": "Message sent to teacher successfully", "id": message.id}


@router.get("/messages", response_model=List[MessageResponse])
def get_messages_with_teacher(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all messages between student and teacher"""
    
    # Find teacher
    teacher = db.query(User).filter(User.role == "teacher").first()
    if not teacher:
        return []
    
    # Get all messages between student and teacher
    messages = db.query(TeacherMessage).filter(
        or_(
            and_(TeacherMessage.sender_id == current_user.id, TeacherMessage.receiver_id == teacher.id),
            and_(TeacherMessage.sender_id == teacher.id, TeacherMessage.receiver_id == current_user.id)
        )
    ).order_by(TeacherMessage.timestamp).all()
    
    # Mark teacher's messages as read
    db.query(TeacherMessage).filter(
        TeacherMessage.sender_id == teacher.id,
        TeacherMessage.receiver_id == current_user.id,
        TeacherMessage.is_read == 0
    ).update({"is_read": 1})
    db.commit()
    
    # Format response
    result = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        result.append(MessageResponse(
            id=msg.id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            message=msg.message,
            is_read=msg.is_read,
            timestamp=msg.timestamp,
            sender_name=sender.username if sender else "Unknown",
            is_from_teacher=(msg.sender_id == teacher.id)
        ))
    
    return result


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of unread messages from teacher"""
    
    # Find teacher
    teacher = db.query(User).filter(User.role == "teacher").first()
    if not teacher:
        return {"unread_count": 0}
    
    # Count unread messages from teacher
    unread_count = db.query(TeacherMessage).filter(
        TeacherMessage.sender_id == teacher.id,
        TeacherMessage.receiver_id == current_user.id,
        TeacherMessage.is_read == 0
    ).count()
    
    return {"unread_count": unread_count}
