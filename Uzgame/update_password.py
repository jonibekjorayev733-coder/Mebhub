import bcrypt
from app.database import sessionLocal
from app.models.base import Med

# Update admin password with new bcrypt implementation
with sessionLocal() as db:
    admin = db.query(Med).filter(Med.email == "admin@example.com").first()
    if admin:
        print(f'Found admin user: {admin.email}')
        try:
            # Generate new password hash using bcrypt directly
            password = "admin123"
            password_bytes = password[:72].encode('utf-8')
            salt = bcrypt.gensalt(rounds=12)
            hashed = bcrypt.hashpw(password_bytes, salt)
            
            admin.hashed_password = hashed.decode('utf-8')
            db.commit()
            print('✓ Password updated successfully')
            print(f'New hash: {admin.hashed_password[:50]}...')
        except Exception as e:
            print(f'Error: {e}')
            db.rollback()
    else:
        print('Admin user not found')
