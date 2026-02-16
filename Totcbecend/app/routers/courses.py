from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import Course, UserCourse, User, Lesson
from ..schemas import CourseCreate, CourseRead, LessonCreate, LessonRead, CourseDetailRead
from .auth import get_current_user

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("", response_model=list[CourseRead])
def list_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Barcha kurslarni ol, pagination va filtering bilan
    """
    query = db.query(Course)
    
    if category:
        query = query.filter(Course.category == category)
    
    total = query.count()
    courses = query.order_by(desc(Course.id)).offset(skip).limit(limit).all()
    
    return courses


@router.post("", response_model=CourseRead, status_code=201)
def create_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Yangi kurs yaratish (faqat admin)
    """
    course = Course(**payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.get("/{course_id}", response_model=CourseDetailRead)
def get_course(course_id: int, db: Session = Depends(get_db)):
    """
    Kursning to'liq ma'lumotini lessons bilan birga ol
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs topilmadi")
    
    # Lessons'ni eager load qil
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
    
    course_data = CourseDetailRead.model_validate(course)
    course_data.lessons = lessons
    return course_data


@router.get("/{course_id}/lessons", response_model=list[LessonRead])
def get_course_lessons(course_id: int, db: Session = Depends(get_db)):
    """
    Kursning barcha darslarini ol
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs topilmadi")
    
    lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
    return lessons


@router.post("/{course_id}/lessons", response_model=LessonRead, status_code=201)
def create_lesson(
    course_id: int,
    payload: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Kursga yangi dars qo'shish
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs topilmadi")
    
    lesson = Lesson(course_id=course_id, **payload.model_dump())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.post("/{course_id}/enroll", status_code=201)
def enroll(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Kursga yozilish
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs topilmadi")

    exists = (
        db.query(UserCourse)
        .filter(UserCourse.user_id == current_user.id, UserCourse.course_id == course_id)
        .first()
    )
    if exists:
        raise HTTPException(status_code=400, detail="Siz allaqachon yozilgansiz")

    uc = UserCourse(user_id=current_user.id, course_id=course_id)
    db.add(uc)
    db.commit()
    return {"ok": True, "message": "Kursga muvaffaqiyatli yozildingiz"}


@router.get("/me/enrolled", response_model=list[CourseDetailRead])
def my_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mening yozilgan kurslarim (lessons bilan birga)
    """
    rows = (
        db.query(Course)
        .join(UserCourse, UserCourse.course_id == Course.id)
        .filter(UserCourse.user_id == current_user.id)
        .order_by(desc(UserCourse.id))
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    # Har bir kurs uchun lessons'ni qo'shish
    result = []
    for course in rows:
        lessons = db.query(Lesson).filter(Lesson.course_id == course.id).order_by(Lesson.order).all()
        course_data = CourseDetailRead.model_validate(course)
        course_data.lessons = lessons
        result.append(course_data)
    
    return result


@router.get("/search/by-title")
def search_courses(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    """
    Kurs izlash sarlavha bo'yicha
    """
    courses = db.query(Course).filter(Course.title.ilike(f"%{q}%")).limit(10).all()
    return courses


@router.get("/stats/summary")
def get_stats(db: Session = Depends(get_db)):
    """
    Kurslar statistikasi
    """
    total_courses = db.query(Course).count()
    total_lessons = db.query(Lesson).count()
    total_enrollments = db.query(UserCourse).count()
    
    return {
        "total_courses": total_courses,
        "total_lessons": total_lessons,
        "total_enrollments": total_enrollments,
        "courses": db.query(Course).order_by(desc(Course.id)).limit(5).all()
    }
