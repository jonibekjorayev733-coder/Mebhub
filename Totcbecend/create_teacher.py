#!/usr/bin/env python
"""Create a teacher user for testing"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User
from app.security import hash_password

def create_teacher():
    db = SessionLocal()
    
    try:
        # Check if teacher already exists
        existing = db.query(User).filter(User.email == "teacher@example.com").first()
        if existing:
            print("✅ Teacher already exists!")
            return
        
        # Create teacher
        teacher = User(
            email="teacher@example.com",
            username="teacher",
            hashed_password=hash_password("teacher123"),
            role="teacher"
        )
        
        db.add(teacher)
        db.commit()
        db.refresh(teacher)
        
        print("✅ Teacher created successfully!")
        print(f"📧 Email: teacher@example.com")
        print(f"🔐 Password: teacher123")
        print(f"👤 Username: teacher")
        print(f"🎓 Role: teacher")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_teacher()
