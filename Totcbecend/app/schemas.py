from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum
from datetime import datetime

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CourseCreate(BaseModel):
    title: str
    category: str
    image_url: str
    author: Optional[str] = None
    teacher_id: Optional[int] = None
    price: Optional[float] = None
    total_lessons: Optional[int] = 0
    current_lesson: Optional[int] = 0
    description: Optional[str] = None


class CourseRead(BaseModel):
    id: int
    title: str
    category: str
    image_url: str
    author: Optional[str] = None
    teacher_id: Optional[int] = None
    price: Optional[float] = None
    total_lessons: int
    current_lesson: int
    description: Optional[str] = None

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    order: Optional[int] = 0


class LessonRead(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    order: int

    class Config:
        from_attributes = True


class CourseDetailRead(BaseModel):
    id: int
    title: str
    category: str
    image_url: str
    author: Optional[str] = None
    price: Optional[float] = None
    total_lessons: int
    current_lesson: int
    description: Optional[str] = None
    lessons: list[LessonRead] = []

    class Config:
        from_attributes = True


# ============ PAYMENT SCHEMAS ============

class PaymentCreate(BaseModel):
    course_id: int
    card_number: str = Field(..., min_length=13, max_length=19)
    card_expiry: str = Field(..., pattern=r"^\d{2}/\d{2}$")  # MM/YY formatida
    card_cvv: str = Field(..., min_length=3, max_length=4)
    card_holder: str


class PaymentRead(BaseModel):
    id: int
    user_id: int
    course_id: int
    amount: float
    currency: str
    status: PaymentStatus
    payme_id: Optional[str] = None
    card_holder: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

    class Config:
        from_attributes = True


class PaymentHistoryRead(BaseModel):
    id: int
    user_id: int
    course_id: int
    amount: float
    status: PaymentStatus
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymePaymentRequest(BaseModel):
    """Payme payment initiation"""
    account_id: str  # Course ID
    amount: float  # Miqdor (UZS da)
    order_key: str  # Transaction ID


class PaymeCheckResponse(BaseModel):
    """Payme check response"""
    result: dict
