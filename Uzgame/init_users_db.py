#!/usr/bin/env python3
"""Initialize Users Database"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

# Import models BEFORE creating tables
from app.models.user_accounts import UserAccount
from app.database_users import users_engine, UsersBase, UsersSessionLocal
from app.auth.auth import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
UsersBase.metadata.create_all(bind=users_engine)
print("✓ Users database tables created successfully!")

# Add test users
db = UsersSessionLocal()
try:
    test_users = [
        {
            "email": "test@example.com",
            "password": "test123",
            "full_name": "Test User",
            "phone": "+998-90-123-45-67"
        },
        {
            "email": "john@example.com",
            "password": "john123",
            "full_name": "John Doe",
            "phone": "+998-91-234-56-78"
        },
        {
            "email": "jane@example.com",
            "password": "jane123",
            "full_name": "Jane Smith",
            "phone": "+998-92-345-67-89"
        },
        {
            "email": "admin@example.com",
            "password": "admin123",
            "full_name": "Administrator",
            "phone": "+998-93-456-78-90"
        }
    ]
    
    for user_data in test_users:
        existing_user = db.query(UserAccount).filter(
            UserAccount.email == user_data["email"]
        ).first()
        if existing_user:
            print(f"✓ User {user_data['email']} already exists")
            continue
        
        hashed_password = get_password_hash(user_data["password"])
        user = UserAccount(
            email=user_data["email"],
            hashed_password=hashed_password,
            full_name=user_data["full_name"],
            phone=user_data["phone"],
            provider="email",
            is_active=True
        )
        db.add(user)
        print(f"✓ Added user: {user_data['email']} (password: {user_data['password']})")
    
    db.commit()
    
    # Show all users
    all_users = db.query(UserAccount).all()
    print(f"\n{'='*70}")
    print(f"✓ Users database initialized with {len(all_users)} accounts")
    print(f"{'='*70}")
    print("\nUser Accounts in users.db:")
    for user in all_users:
        print(f"  📧 {user.email} | {user.full_name} | {user.phone}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
