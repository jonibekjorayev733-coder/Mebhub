"""
Certificate Router
Sertifikat yaratish va ko'rish uchun endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.medical import UserCertificate
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter(prefix="/certificate", tags=["certificate"])


class CertificateCreate(BaseModel):
    """Create certificate request"""
    user_id: int
    full_name: str
    email: str
    profile_picture: Optional[str] = None
    total_topics: int
    completed_topics: int
    total_questions: int
    correct_answers: int


class CertificateResponse(BaseModel):
    """Certificate response"""
    id: int
    certificate_number: str
    full_name: str
    email: str
    total_topics: int
    completed_topics: int
    total_questions: int
    correct_answers: int
    percentage: float
    issued_date: datetime
    signature: Optional[str] = None
    
    class Config:
        from_attributes = True


@router.post("/create", response_model=CertificateResponse)
async def create_certificate(
    cert_data: CertificateCreate,
    db: Session = Depends(get_db)
):
    """
    Create new certificate for user
    POST /certificate/create
    """
    try:
        # Calculate percentage
        if cert_data.total_questions > 0:
            percentage = (cert_data.correct_answers / cert_data.total_questions) * 100
        else:
            percentage = 0
        
        # Generate unique certificate number
        cert_number = f"CERT-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Create certificate
        certificate = UserCertificate(
            user_id=cert_data.user_id,
            full_name=cert_data.full_name,
            email=cert_data.email,
            profile_picture=cert_data.profile_picture,
            total_topics=cert_data.total_topics,
            completed_topics=cert_data.completed_topics,
            total_questions=cert_data.total_questions,
            correct_answers=cert_data.correct_answers,
            percentage=percentage,
            certificate_number=cert_number,
            signature="OXU University"  # Default signature
        )
        
        db.add(certificate)
        db.commit()
        db.refresh(certificate)
        
        print(f"[CERTIFICATE] Created certificate {cert_number} for user {cert_data.user_id}")
        
        return certificate
    except Exception as e:
        db.rollback()
        print(f"[CERTIFICATE ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create certificate: {str(e)}")


@router.get("/user/{user_id}", response_model=Optional[CertificateResponse])
async def get_user_certificate(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get user's certificate if exists
    GET /certificate/user/{user_id}
    """
    try:
        certificate = db.query(UserCertificate).filter(
            UserCertificate.user_id == user_id
        ).first()
        
        if not certificate:
            raise HTTPException(status_code=404, detail="Certificate not found")
        
        return certificate
    except HTTPException:
        raise
    except Exception as e:
        print(f"[CERTIFICATE ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{certificate_id}", response_model=CertificateResponse)
async def get_certificate(
    certificate_id: int,
    db: Session = Depends(get_db)
):
    """
    Get certificate by ID
    GET /certificate/{certificate_id}
    """
    try:
        certificate = db.query(UserCertificate).filter(
            UserCertificate.id == certificate_id
        ).first()
        
        if not certificate:
            raise HTTPException(status_code=404, detail="Certificate not found")
        
        return certificate
    except HTTPException:
        raise
    except Exception as e:
        print(f"[CERTIFICATE ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
