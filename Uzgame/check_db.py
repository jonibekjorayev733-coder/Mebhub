#!/usr/bin/env python3
"""Check database contents"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import sessionLocal
from app.models.base import Med

db = sessionLocal()
try:
    users = db.query(Med).all()
    print(f"\n{'='*70}")
    print(f"Database Status: Found {len(users)} users in 'med' table")
    print(f"{'='*70}\n")
    
    if users:
        print("Users in database:")
        for i, user in enumerate(users, 1):
            print(f"{i}. Email: {user.email}")
            print(f"   Name: {user.full_name}")
            print(f"   Provider: {user.provider}")
            print(f"   Active: {user.is_active}")
            print(f"   Created: {user.created_at}")
            print()
    else:
        print("❌ No users found in database!")
        print("\nTo add test users, run: python init_db.py")
        
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
