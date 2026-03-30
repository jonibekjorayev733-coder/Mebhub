#!/usr/bin/env python3
"""Database initialization script with test users"""
import sys
import os
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import Base, engine, sessionLocal
from app.models.base import Med, User, Game, TestSet, Question, Option, Score, MultiplayerRoom
from app.auth.auth import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create all tables
Base.metadata.create_all(bind=engine)
print("✓ Database tables created successfully!")

# Add test users
db = sessionLocal()
try:
    test_users = [
        {
            "email": "test@example.com",
            "password": "test123",
            "full_name": "Test User",
            "provider": "email"
        },
        {
            "email": "john@example.com",
            "password": "john123",
            "full_name": "John Doe",
            "provider": "email"
        },
        {
            "email": "jane@example.com",
            "password": "jane123",
            "full_name": "Jane Smith",
            "provider": "email"
        },
        {
            "email": "admin@example.com",
            "password": "admin123",
            "full_name": "Administrator",
            "provider": "email"
        }
    ]
    
    for user_data in test_users:
        existing_user = db.query(Med).filter(Med.email == user_data["email"]).first()
        if existing_user:
            print(f"✓ User {user_data['email']} already exists")
            continue
        
        hashed_password = get_password_hash(user_data["password"])
        user = Med(
            email=user_data["email"],
            hashed_password=hashed_password,
            full_name=user_data["full_name"],
            provider=user_data["provider"],
            is_active=True
        )
        db.add(user)
        print(f"✓ Added user: {user_data['email']} (password: {user_data['password']})")
    
    db.commit()
    
    # Show all users
    all_users = db.query(Med).all()
    print(f"\n{'='*60}")
    print(f"✓ Med table initialized with {len(all_users)} users")
    print(f"{'='*60}")
    print("\nDatabase Users:")
    for user in all_users:
        print(f"  📧 {user.email} | Name: {user.full_name} | Provider: {user.provider}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
