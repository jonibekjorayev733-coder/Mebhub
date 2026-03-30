"""
Create Admin User
Admin user yaratish uchun script
"""

from app.database import sessionLocal
from app.models.base import Med
from app.auth.auth import get_password_hash

def create_admin():
    db = sessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(Med).filter(Med.email == "admin@example.com").first()
        
        if admin:
            print("✓ Admin already exists")
            return
        
        # Create admin
        admin_user = Med(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_active=True,
            is_admin=True,
            provider="email"
        )
        
        db.add(admin_user)
        db.commit()
        
        print("✓ Admin user created successfully")
        print("  Email: admin@example.com")
        print("  Password: admin123")
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
