from app.database import sessionLocal
from app.models.base import Med
from app.auth.auth import get_password_hash

db = sessionLocal()

# Check if test user exists
test_email = "test@example.com"
existing = db.query(Med).filter(Med.email == test_email).first()

if not existing:
    # Create test user
    test_user = Med(
        email=test_email,
        hashed_password=get_password_hash("test123"),
        full_name="Test User",
        provider="email",
        is_active=True
    )
    db.add(test_user)
    db.commit()
    print(f"✓ Created test user: {test_email} (password: test123)")
else:
    print(f"✓ Test user already exists: {test_email}")

db.close()
