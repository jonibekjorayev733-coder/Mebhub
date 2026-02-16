"""
Payment API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from datetime import datetime

from ..database import get_db
from ..models import Payment, PaymentStatus, User, Course, UserCourse
from ..schemas import PaymentCreate, PaymentRead, PaymentHistoryRead
from .auth import get_current_user
from ..security import (
    validate_card_all,
    encrypt_card_number,
    mask_card_number,
    hash_card_token,
)

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/process", response_model=PaymentRead, status_code=201)
def process_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    To'lovni qayta ishlash
    1. Karta validatsiyasi
    2. Shifrash
    3. Database'ga saqlash
    4. Kursga yozilish
    """
    
    # Kursni tekshirish
    course = db.query(Course).filter(Course.id == payment_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs topilmadi")
    
    # Allaqachon yozilgan yoki sotib olgan?
    existing = db.query(Payment).filter(
        and_(
            Payment.user_id == current_user.id,
            Payment.course_id == payment_data.course_id,
            Payment.status == PaymentStatus.COMPLETED
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Siz allaqachon bu kursni sotib olgansiz")
    
    # Karta validatsiyasi
    is_valid, error_msg = validate_card_all(
        payment_data.card_number,
        payment_data.card_expiry,
        payment_data.card_cvv,
        payment_data.card_holder
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Duplicate payment check (duplicate prevention)
    card_token = hash_card_token(
        payment_data.card_number,
        payment_data.card_expiry,
        payment_data.card_cvv
    )
    
    recent_payment = db.query(Payment).filter(
        and_(
            Payment.user_id == current_user.id,
            Payment.course_id == payment_data.course_id,
            Payment.payme_account_id == card_token
        )
    ).first()
    
    if recent_payment and recent_payment.created_at:
        from datetime import timedelta
        time_diff = datetime.utcnow() - recent_payment.created_at
        if time_diff.total_seconds() < 60:  # 1 daqiqada yana to'lov qilmaslik
            raise HTTPException(status_code=400, detail="Shunga o'xshash to'lov bor. Iltimos, bir oz kuting")
    
    # Shifrash va saqlash
    encrypted_card = encrypt_card_number(payment_data.card_number)
    masked_card = mask_card_number(payment_data.card_number)
    
    # Payment record yaratish
    payment = Payment(
        user_id=current_user.id,
        course_id=payment_data.course_id,
        amount=course.price,
        currency="UZS",
        status=PaymentStatus.PENDING,
        card_number_encrypted=encrypted_card,
        card_expiry=payment_data.card_expiry,
        card_holder=payment_data.card_holder,
        payme_account_id=card_token,
        notes=f"Card: {masked_card}"
    )
    
    db.add(payment)
    db.flush()
    
    # Simulyatsion to'lov qayta ishlash
    try:
        # Bu yerda Payme API chaqiriladi yoki haqiqiy payment gateway
        # Simulyatsiyada - har doim muvaffaqiyatli
        payment.status = PaymentStatus.COMPLETED
        payment.completed_at = datetime.utcnow()
        
        db.commit()
        
        # Kursga yozilish
        existing_enrollment = db.query(UserCourse).filter(
            and_(
                UserCourse.user_id == current_user.id,
                UserCourse.course_id == payment_data.course_id
            )
        ).first()
        
        if not existing_enrollment:
            enrollment = UserCourse(
                user_id=current_user.id,
                course_id=payment_data.course_id
            )
            db.add(enrollment)
            db.commit()
        
        db.refresh(payment)
        return payment
    
    except Exception as e:
        db.rollback()
        payment.status = PaymentStatus.FAILED
        payment.error_message = str(e)
        db.commit()
        raise HTTPException(status_code=400, detail=f"To'lov xatosi: {str(e)}")


@router.get("/history", response_model=list[PaymentHistoryRead])
def payment_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mening to'lovlar tarixi
    """
    query = db.query(Payment).filter(Payment.user_id == current_user.id)
    
    if status:
        query = query.filter(Payment.status == status)
    
    payments = query.order_by(desc(Payment.created_at)).offset(skip).limit(limit).all()
    return payments


@router.get("/stats", response_model=dict)
def payment_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mening to'lovlar statistikasi
    """
    total_paid = db.query(Payment).filter(
        and_(
            Payment.user_id == current_user.id,
            Payment.status == PaymentStatus.COMPLETED
        )
    ).count()
    
    total_amount = sum([p.amount for p in db.query(Payment).filter(
        and_(
            Payment.user_id == current_user.id,
            Payment.status == PaymentStatus.COMPLETED
        )
    ).all()]) or 0
    
    failed = db.query(Payment).filter(
        and_(
            Payment.user_id == current_user.id,
            Payment.status == PaymentStatus.FAILED
        )
    ).count()
    
    return {
        "total_payments": total_paid,
        "total_amount": total_amount,
        "currency": "UZS",
        "failed_payments": failed
    }


@router.get("/{payment_id}", response_model=PaymentRead)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Bitta to'lovni ko'rish (faqat o'zingikini)
    """
    payment = db.query(Payment).filter(
        and_(
            Payment.id == payment_id,
            Payment.user_id == current_user.id
        )
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="To'lov topilmadi")
    
    return payment


@router.post("/{payment_id}/refund", response_model=dict, status_code=200)
def refund_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    To'lovni qaytarish (refund)
    Faqat 24 soat ichida
    """
    payment = db.query(Payment).filter(
        and_(
            Payment.id == payment_id,
            Payment.user_id == current_user.id
        )
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="To'lov topilmadi")
    
    if payment.status != PaymentStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Faqat tugatilgan to'lovlarni qaytarish mumkin")
    
    # 24 soatlik check
    from datetime import timedelta
    if datetime.utcnow() - payment.completed_at > timedelta(hours=24):
        raise HTTPException(status_code=400, detail="24 soatdan keyin qaytarish mumkin emas")
    
    # Refund jarayoni
    payment.status = PaymentStatus.REFUNDED
    db.commit()
    
    # Kurs yozilishini o'chirish
    enrollment = db.query(UserCourse).filter(
        and_(
            UserCourse.user_id == current_user.id,
            UserCourse.course_id == payment.course_id
        )
    ).first()
    
    if enrollment:
        db.delete(enrollment)
        db.commit()
    
    return {"ok": True, "message": "To'lov muvaffaqiyatli qaytarildi"}


# ============ ADMIN ENDPOINTS ============

@router.get("/admin/all", response_model=list[PaymentHistoryRead])
def admin_all_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ADMIN ONLY - Barcha to'lovlarni ko'rish
    """
    # Admin check qo'shish kerak (faqat misol)
    
    query = db.query(Payment)
    
    if status:
        query = query.filter(Payment.status == status)
    
    payments = query.order_by(desc(Payment.created_at)).offset(skip).limit(limit).all()
    return payments


@router.get("/admin/stats", response_model=dict)
def admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    ADMIN ONLY - Global to'lovlar statistikasi
    """
    completed = db.query(Payment).filter(Payment.status == PaymentStatus.COMPLETED).count()
    failed = db.query(Payment).filter(Payment.status == PaymentStatus.FAILED).count()
    pending = db.query(Payment).filter(Payment.status == PaymentStatus.PENDING).count()
    
    total_revenue = sum([p.amount for p in db.query(Payment).filter(
        Payment.status == PaymentStatus.COMPLETED
    ).all()]) or 0
    
    return {
        "completed_payments": completed,
        "failed_payments": failed,
        "pending_payments": pending,
        "total_revenue": total_revenue,
        "currency": "UZS"
    }
