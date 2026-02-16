#!/usr/bin/env python
"""
Database-ni to'liq reset qilish va test data qo'shish
"""

from app.database import engine, Base
from app.models import User, Course, UserCourse, Lesson
from add_complete_test_data import courses_data

def reset_database():
    """Database jadvallarni qayta yaratish"""
    print("🔄 Database-ni reset qilmoqda...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("✅ Database-jadvallar yaratildi!")

def seed_database():
    """Test data'ni qo'shish"""
    print("📊 Test data'ni qo'shmoqda...")
    
    from sqlalchemy.orm import Session
    from app.database import SessionLocal
    
    db = SessionLocal()
    
    try:
        # Courses bilan lessons'ni qo'shish
        for course_data in courses_data:
            lessons_data = course_data.pop("lessons", [])
            
            course = Course(**course_data)
            db.add(course)
            db.flush()
            
            # Lessons'ni qo'shish
            for lesson_data in lessons_data:
                lesson = Lesson(course_id=course.id, **lesson_data)
                db.add(lesson)
        
        db.commit()
        print("✅ Barcha ma'lumotlar muvaffaqiyatli qo'shildi!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Xato: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
    seed_database()
