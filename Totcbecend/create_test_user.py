#!/usr/bin/env python
"""Create test user for payment system testing"""
import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

from app.database import SessionLocal
from app.models import User
from app.security import hash_password

db = SessionLocal()

# Check if test user exists
existing = db.query(User).filter(User.email == "test@example.com").first()
if existing:
    print(f"Test user already exists: {existing.email}")
    db.close()
    sys.exit(0)

# Create test user
test_user = User(
    email="test@example.com",
    username="testuser",
    hashed_password=hash_password("test123")
)

db.add(test_user)
db.commit()
db.refresh(test_user)

print(f"[OK] Test user created: {test_user.email}")
print(f"     Username: {test_user.username}")
print(f"     ID: {test_user.id}")

db.close()
