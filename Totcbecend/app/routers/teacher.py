from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..ws_manager import manager as ws_manager

from ..database import get_db
from ..models import User, TeacherMessage
from .auth import get_current_user

router = APIRouter(prefix="/teacher", tags=["teacher"])


class SendMessageRequest(BaseModel):
    student_id: int
    message: str


class EditMessageRequest(BaseModel):
    message: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    is_read: int
    timestamp: datetime
    sender_name: str
    receiver_name: str

    class Config:
        from_attributes = True


class StudentListItem(BaseModel):
    id: int
    username: str
    email: str
    unread_count: int
    last_message: str | None
    last_message_time: datetime | None

    class Config:
        from_attributes = True


@router.post("/send-message", response_model=MessageResponse)
def send_message_to_student(
    request: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Teacher sends message to student"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can use this endpoint")
    
    # Verify student exists
    student = db.query(User).filter(User.id == request.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Create message
    message = TeacherMessage(
        sender_id=current_user.id,
        receiver_id=request.student_id,
        message=request.message,
        is_read=0
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # Get sender and receiver names
    sender = db.query(User).filter(User.id == message.sender_id).first()
    receiver = db.query(User).filter(User.id == message.receiver_id).first()
    
    response = MessageResponse(
        id=message.id,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        message=message.message,
        is_read=message.is_read,
        timestamp=message.timestamp,
        sender_name=sender.username if sender else "Unknown",
        receiver_name=receiver.username if receiver else "Unknown"
    )

    # Broadcast via WebSocket
    import asyncio
    try:
        asyncio.create_task(ws_manager.send_personal_message(response.dict(), request.student_id))
    except Exception:
        pass
    
    return response


@router.get("/students", response_model=List[StudentListItem])
def get_students_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of students who have messaged the teacher, with unread counts"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can use this endpoint")
    
    # Get all students who have exchanged messages with this teacher
    students_query = db.query(User).join(
        TeacherMessage,
        or_(
            and_(TeacherMessage.sender_id == User.id, TeacherMessage.receiver_id == current_user.id),
            and_(TeacherMessage.receiver_id == User.id, TeacherMessage.sender_id == current_user.id)
        )
    ).filter(User.role == "student").distinct()
    
    students = students_query.all()
    
    result = []
    for student in students:
        # Count unread messages from this student
        unread_count = db.query(TeacherMessage).filter(
            TeacherMessage.sender_id == student.id,
            TeacherMessage.receiver_id == current_user.id,
            TeacherMessage.is_read == 0
        ).count()
        
        # Get last message
        last_msg = db.query(TeacherMessage).filter(
            or_(
                and_(TeacherMessage.sender_id == student.id, TeacherMessage.receiver_id == current_user.id),
                and_(TeacherMessage.receiver_id == student.id, TeacherMessage.sender_id == current_user.id)
            )
        ).order_by(TeacherMessage.timestamp.desc()).first()
        
        result.append(StudentListItem(
            id=student.id,
            username=student.username,
            email=student.email,
            unread_count=unread_count,
            last_message=last_msg.message if last_msg else None,
            last_message_time=last_msg.timestamp if last_msg else None
        ))
    
    # Sort by last message time (most recent first)
    result.sort(key=lambda x: x.last_message_time or datetime.min, reverse=True)
    
    return result


@router.get("/messages/{student_id}", response_model=List[MessageResponse])
def get_messages_with_student(
    student_id: int,
    after: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all messages between teacher and specific student"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can use this endpoint")
    
    # Base query for messages between teacher and student
    query = db.query(TeacherMessage).filter(
        or_(
            and_(TeacherMessage.sender_id == current_user.id, TeacherMessage.receiver_id == student_id),
            and_(TeacherMessage.sender_id == student_id, TeacherMessage.receiver_id == current_user.id)
        )
    )

    # Filter by message ID if 'after' is provided
    if after is not None:
        query = query.filter(TeacherMessage.id > after)

    messages = query.order_by(TeacherMessage.timestamp).all()
    
    # Get sender and receiver names
    result = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        receiver = db.query(User).filter(User.id == msg.receiver_id).first()
        result.append(MessageResponse(
            id=msg.id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            message=msg.message,
            is_read=msg.is_read,
            timestamp=msg.timestamp,
            sender_name=sender.username if sender else "Unknown",
            receiver_name=receiver.username if receiver else "Unknown"
        ))
    
    return result


@router.put("/mark-read/{student_id}")
def mark_messages_as_read(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all messages from student as read"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can use this endpoint")
    
    # Update all unread messages from this student
    db.query(TeacherMessage).filter(
        TeacherMessage.sender_id == student_id,
        TeacherMessage.receiver_id == current_user.id,
        TeacherMessage.is_read == 0
    ).update({"is_read": 1})
    
    db.commit()
    
    return {"message": "Messages marked as read"}


@router.put("/messages/{message_id}")
def edit_message(
    message_id: int,
    request: EditMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Edit a sent message"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can use this endpoint")
    
    message = db.query(TeacherMessage).filter(
        TeacherMessage.id == message_id,
        TeacherMessage.sender_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.message = request.message
    db.commit()
    
    sender = db.query(User).filter(User.id == message.sender_id).first()
    receiver = db.query(User).filter(User.id == message.receiver_id).first()
    
    return MessageResponse(
        id=message.id,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        message=message.message,
        is_read=message.is_read,
        timestamp=message.timestamp,
        sender_name=sender.username if sender else "Unknown",
        receiver_name=receiver.username if receiver else "Unknown"
    )


@router.delete("/messages/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a sent message"""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can use this endpoint")
    
    message = db.query(TeacherMessage).filter(
        TeacherMessage.id == message_id,
        TeacherMessage.sender_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    
    return {"message": "Message deleted successfully"}