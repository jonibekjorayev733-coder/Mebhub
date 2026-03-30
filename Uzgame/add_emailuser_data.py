from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from datetime import datetime

# PostgreSQL connection
POSTGRESQL_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"
pg_engine = create_engine(POSTGRESQL_URL)
PgSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

print("=" * 70)
print("EMAILUSER TABLEIGA TEST MA'LUMOTLARI QO'SHILMOQDA")
print("=" * 70)

# Test users
test_users = [
    {"email": "user1@example.com", "password": "password123", "full_name": "User One"},
    {"email": "user2@example.com", "password": "password456", "full_name": "User Two"},
    {"email": "user3@example.com", "password": "password789", "full_name": "User Three"},
    {"email": "test.user@example.com", "password": "testpass123", "full_name": "Test User"},
    {"email": "admin.user@example.com", "password": "adminpass123", "full_name": "Admin User"},
]

try:
    pg_session = PgSessionLocal()
    
    for user in test_users:
        # Parolni hash qil
        hashed_pwd = hash_password(user["password"])
        
        # Insert query
        insert_query = f"""
        INSERT INTO emailuser (email, password, full_name, create_time)
        VALUES ('{user['email']}', '{hashed_pwd}', '{user['full_name']}', '{datetime.now()}')
        ON CONFLICT (email) DO NOTHING
        """
        
        pg_session.execute(text(insert_query))
        print(f"✓ Added: {user['email']} - {user['full_name']}")
    
    pg_session.commit()
    
    # Verify
    verify_query = "SELECT COUNT(*) FROM emailuser"
    result = pg_session.execute(text(verify_query)).fetchone()
    total_users = result[0]
    
    print(f"\n✓ Jami emailuser: {total_users}")
    
    # Show all users
    print("\nEmailuser table dagi users:")
    users = pg_session.execute(text("SELECT id, email, full_name, create_time FROM emailuser")).fetchall()
    for user in users:
        print(f"  {user[0]}. {user[1]} ({user[2]}) - {user[3]}")
    
    pg_session.close()
    
    print("\n" + "=" * 70)
    print("✅ MA'LUMOTLAR QO'SHILDI!")
    print("=" * 70)
    
except Exception as e:
    print(f"❌ Xato: {e}")
    pg_session.rollback()
