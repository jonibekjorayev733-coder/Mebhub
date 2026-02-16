from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..ws_manager import manager as ws_manager

from ..database import get_db
from ..models import User, TeacherMessage
from .auth import get_current_user

router = APIRouter(prefix="/students", tags=["students"])


class SendMessageRequest(BaseModel):
    teacher_id: int
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


class TeacherInfo(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


@router.get("/teacher", response_model=TeacherInfo)
def get_teacher(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get default teacher (first teacher found)"""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use this endpoint")
    
    teacher = db.query(User).filter(User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    return TeacherInfo(
        id=teacher.id,
        username=teacher.username,
        email=teacher.email
    )


@router.post("/send-message", response_model=MessageResponse)
def send_message_to_teacher(
    request: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Student sends message to teacher"""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use this endpoint")
    
    # Verify teacher exists
    teacher = db.query(User).filter(User.id == request.teacher_id).first()
    if not teacher or teacher.role != "teacher":
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Create message
    message = TeacherMessage(
        sender_id=current_user.id,
        receiver_id=request.teacher_id,
        message=request.message,
        is_read=0
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
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
        asyncio.create_task(ws_manager.send_personal_message(response.dict(), request.teacher_id))
    except Exception:
        pass

    return response


@router.get("/messages/{teacher_id}", response_model=List[MessageResponse])
def get_messages_with_teacher(
    teacher_id: int,
    after: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all messages between student and teacher"""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use this endpoint")
    
    # Base query for messages between student and teacher
    query = db.query(TeacherMessage).filter(
        or_(
            and_(TeacherMessage.sender_id == current_user.id, TeacherMessage.receiver_id == teacher_id),
            and_(TeacherMessage.sender_id == teacher_id, TeacherMessage.receiver_id == current_user.id)
        )
    )

    print(f"DEBUG: get_messages_with_teacher teacher_id={teacher_id} after={after} user={current_user.id}")
    # Filter by message ID if 'after' is provided
    if after is not None:
        query = query.filter(TeacherMessage.id > after)

    messages = query.order_by(TeacherMessage.timestamp).all()
    print(f"DEBUG: found {len(messages)} messages")
    if messages:
        print(f"DEBUG: last message id={messages[-1].id}")
    
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


@router.put("/mark-read/{teacher_id}")
def mark_messages_as_read(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all messages from teacher as read"""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use this endpoint")
    
    # Update all unread messages from this teacher
    db.query(TeacherMessage).filter(
        TeacherMessage.sender_id == teacher_id,
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
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use this endpoint")
    
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
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use this endpoint")
    
    message = db.query(TeacherMessage).filter(
        TeacherMessage.id == message_id,
        TeacherMessage.sender_id == current_user.id
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    
    return {"message": "Message deleted successfully"}
