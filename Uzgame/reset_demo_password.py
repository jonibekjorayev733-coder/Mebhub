#!/usr/bin/env python
from app.database import sessionLocal
from app.models.base import Med
from app.auth.auth import get_password_hash

db = sessionLocal()

# Find demo user
demo = db.query(Med).filter(Med.email == 'demo@example.com').first()

if demo:
    # Reset password using proper hashing
    new_hash = get_password_hash('demo123')
    demo.hashed_password = new_hash
    db.commit()
    print(f'✅ Demo user password reset')
    print(f'  Email: {demo.email}')
    print(f'  Hash length: {len(new_hash)}')
else:
    print('❌ Demo user not found')

db.close()
