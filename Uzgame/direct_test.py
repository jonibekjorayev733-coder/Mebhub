from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker
from datetime import datetime

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
pg_engine = create_engine(POSTGRESQL_URL)
PgSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)

# Try the same logic as auth.py
session = PgSessionLocal()

try:
    print("🧪 Testing register flow...")
    
    # Simulate MedCreate object
    class TestMed:
        email = "direct.test@example.com"
        password = "hashedpassword123"
        full_name = "Direct Test"
    
    med = TestMed()
    
    # Simulate get_password_hash
    hashed = "hashed_" + med.password
    
    # Step 1: Add to Med table
    from app.models.base import Med
    db_user = Med(
        email=med.email,
        hashed_password=hashed,
        full_name=med.full_name,
        provider="email",
        is_active=True
    )
    
    print(f"1️⃣ Adding to med table: {med.email}")
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    print(f"   ✓ Med table add successful, ID={db_user.id}")
    
    # Step 2: Add to EmailUser table
    from app.models.emailuser_model import EmailUser
    emailuser = EmailUser(
        email=med.email,
        password=hashed,
        full_name=med.full_name
    )
    
    print(f"2️⃣ Adding to emailuser table: {med.email}")
    session.add(emailuser)
    session.commit()
    print(f"   ✓ EmailUser table add successful")
    
    # Step 3: Verify both
    print(f"\n3️⃣ Verifying in database...")
    med_check = session.execute(text("SELECT id FROM med WHERE email = :email"), {"email": med.email}).fetchone()
    email_check = session.execute(text("SELECT id FROM emailuser WHERE email = :email"), {"email": med.email}).fetchone()
    
    if med_check and email_check:
        print(f"   ✅ BOTH tables saved successfully!")
        print(f"      Med ID: {med_check[0]}")
        print(f"      EmailUser ID: {email_check[0]}")
    else:
        print(f"   ❌ NOT in database!")
        print(f"      Med table: {med_check}")
        print(f"      EmailUser table: {email_check}")
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print(f"   Type: {type(e).__name__}")
    session.rollback()
finally:
    session.close()
