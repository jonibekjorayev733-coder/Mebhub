from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import google.generativeai as genai
import os
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db, SessionLocal
from ..models import User, ChatHistory
from ..routers.auth import get_current_user
from dotenv import load_dotenv

# Force reload .env
load_dotenv(override=True)

router = APIRouter(
    prefix="/ai",
    tags=["ai"]
)

# Configure Gemini API at startup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # List available models at startup
    try:
        models = genai.list_models()
        print("Available Gemini models:")
        for model in models:
            if "generateContent" in model.supported_generation_methods:
                print(f"  - {model.name}")
    except Exception as e:
        print(f"Could not list models: {e}")

class ChatRequest(BaseModel):
    course_id: int
    message: str
    context: str = "" 

class HistoryItem(BaseModel):
    id: int
    sender: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

@router.post("/chat")
def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"DEBUG: Chat request from {current_user.username}")
    
    # Save User Request
    user_msg = ChatHistory(
        user_id=current_user.id,
        course_id=request.course_id,
        sender="user",
        message=request.message
    )
    db.add(user_msg)
    db.commit()
    
    # Generator for streaming response
    def iter_file():
        full_text = ""
        try:
            # Use latest model - gemini-2.5-flash
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            prompt = f"""
            You are a helpful AI tutor for an online course platform.
            Context: {request.context}
            User Question: {request.message}
            Answer concisely and helpfully.
            """
            
            print(f"DEBUG: requesting from gemini-2.5-flash (no streaming)...")
            response = model.generate_content(prompt, stream=False)
            full_text = response.text
            yield full_text
            
            print("DEBUG: Streaming completed.")
            
            if not full_text:
                yield "..."

            # Save full response
            with SessionLocal() as db_session:
                ai_msg = ChatHistory(
                    user_id=current_user.id,
                    course_id=request.course_id,
                    sender="ai",
                    message=full_text,
                    timestamp=datetime.utcnow()
                )
                db_session.add(ai_msg)
                db_session.commit()

        except Exception as e:
            print(f"ERROR: AI Stream failed: {e}")
            err_text = f"Xatolik: {str(e)}"
            yield err_text
            # Try to save error to DB
            try:
                with SessionLocal() as db_session:
                    ai_msg = ChatHistory(
                        user_id=current_user.id,
                        course_id=request.course_id,
                        sender="ai",
                        message=err_text,
                        timestamp=datetime.utcnow()
                    )
                    db_session.add(ai_msg)
                    db_session.commit()
            except:
                pass

    return StreamingResponse(iter_file(), media_type="text/plain")

@router.get("/history/{course_id}", response_model=list[HistoryItem])
def get_chat_history(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get chat history for a specific course and current user
    """
    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id,
        ChatHistory.course_id == course_id
    ).order_by(ChatHistory.timestamp).all()
    
    return history
