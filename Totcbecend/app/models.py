from sqlalchemy import Column, Integer, String, Float, ForeignKey, UniqueConstraint, Index, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum
from .database import Base

class PaymentStatus(str, PyEnum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False, index=True)  # 'student' or 'teacher'
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    courses = relationship("UserCourse", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")
    sent_messages = relationship("TeacherMessage", foreign_keys="TeacherMessage.sender_id", back_populates="sender", cascade="all, delete-orphan")
    received_messages = relationship("TeacherMessage", foreign_keys="TeacherMessage.receiver_id", back_populates="receiver", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    image_url = Column(String, nullable=True)
    author = Column(String, nullable=True, index=True)
    price = Column(Float, default=0)
    total_lessons = Column(Integer, default=0)
    current_lesson = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    users = relationship("UserCourse", back_populates="course", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan", lazy="joined")
    payments = relationship("Payment", back_populates="course", cascade="all, delete-orphan")

    __table_args__ = (
        Index('idx_course_category', 'category'),
        Index('idx_course_title', 'title'),
    )

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    video_url = Column(String, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="lessons")

    __table_args__ = (
        Index('idx_lesson_course', 'course_id'),
        Index('idx_lesson_order', 'course_id', 'order'),
    )

class UserCourse(Base):
    __tablename__ = "user_courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    enrolled_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="courses")
    course = relationship("Course", back_populates="users")

    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_user_course"),
        Index('idx_user_course_user', 'user_id'),
        Index('idx_user_course_course', 'course_id'),
    )

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # To'lov ma'lumotlari
    amount = Column(Float, nullable=False)  # To'lov miqdori
    currency = Column(String, default="UZS")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING, index=True)
    
    # Payme API ma'lumotlari
    payme_id = Column(String, unique=True, nullable=True, index=True)  # Payme transaction ID
    payme_account_id = Column(String, nullable=True)  # Payme account ID
    
    # Karta ma'lumotlari (encrypted)
    card_number_encrypted = Column(String, nullable=True)  # Shifrashtirilgan karta raqami
    card_expiry = Column(String, nullable=True)  # Shifrashtirilgan muddat
    card_holder = Column(String, nullable=True)  # Karta egasi ismi
    
    # Vaqtlar
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Xatolar va eslatmalar
    error_message = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="payments")
    course = relationship("Course", back_populates="payments")

    __table_args__ = (
        Index('idx_payment_user', 'user_id'),
        Index('idx_payment_course', 'course_id'),
        Index('idx_payment_status', 'status'),
        Index('idx_payment_created', 'created_at'),
        Index('idx_payment_user_status', 'user_id', 'status'),
    )


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    sender = Column(String, nullable=False) # 'user' or 'ai'
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User")
    course = relationship("Course")


class TeacherMessage(Base):
    __tablename__ = "teacher_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    is_read = Column(Integer, default=0, nullable=False)  # 0 = unread, 1 = read
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")

    __table_args__ = (
        Index('idx_teacher_msg_sender', 'sender_id'),
        Index('idx_teacher_msg_receiver', 'receiver_id'),
        Index('idx_teacher_msg_read', 'is_read'),
        Index('idx_teacher_msg_conversation', 'sender_id', 'receiver_id'),
    )
