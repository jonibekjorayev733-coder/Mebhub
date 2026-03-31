#!/usr/bin/env python
import sys
sys.path.insert(0, '.')
from app.database import sessionLocal
from app.models.base import Med

db = sessionLocal()

# Check all users
users = db.query(Med).all()
print(f"Total users: {len(users)}\n")
print("ADMIN USERS:")
print("-" * 70)
for user in users:
    if user.is_admin:
        print(f"[ADMIN] Email: {user.email:30} | is_active: {user.is_active}")

print("\nREGULAR USERS:")
print("-" * 70)
for user in users:
    if not user.is_admin:
        print(f"[USER] Email: {user.email:30}")

db.close()
