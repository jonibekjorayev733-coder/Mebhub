import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Load environment
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

print(f"DATABASE_URL from .env: {DATABASE_URL}")
print(f"Engine type: {'PostgreSQL' if 'postgresql' in DATABASE_URL else 'SQLite'}")

# Test insert with this engine
engine = create_engine(DATABASE_URL, echo=False)
Session = sessionmaker(bind=engine)
session = Session()

try:
    # Try a test insert
    from app.models.base import Med
    from app.auth.auth import get_password_hash
    
    test_user = Med(
        email="test.engine@example.com",
        hashed_password=get_password_hash("test123"),
        full_name="Test Engine User",
        provider="email",
        is_active=True
    )
    
    session.add(test_user)
    session.commit()
    print(f"\nInsert SUCCESS - Added test_engine@example.com (ID={test_user.id})")
    
    # Check if it's in database
    check = session.execute(text("SELECT COUNT(*) FROM med WHERE email = 'test.engine@example.com'")).scalar()
    print(f"Verification: {check} user(s) found in med table")
    
    if check > 0:
        print("✅ Data PERSISTED to database")
    else:
        print("❌ Data NOT persisted - commit issue!")
        
except Exception as e:
    print(f"Error: {e}")
    session.rollback()
finally:
    session.close()
