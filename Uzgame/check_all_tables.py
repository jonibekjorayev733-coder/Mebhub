from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection
POSTGRESQL_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"
pg_engine = create_engine(POSTGRESQL_URL)
PgSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)

print("=" * 70)
print("DATABASE TEKSHIRUVI")
print("=" * 70)

try:
    pg_session = PgSessionLocal()
    
    # Med table
    print("\n1. MED TABLE (Login qilganlar):")
    med_users = pg_session.execute(text("SELECT id, email, full_name, provider FROM med")).fetchall()
    print(f"   Jami: {len(med_users)} user")
    for user in med_users:
        print(f"   - {user[1]} ({user[3]}) - {user[2]}")
    
    # EmailUser table
    print("\n2. EMAILUSER TABLE (Email/Parol):")
    emailuser_users = pg_session.execute(text("SELECT id, email, full_name FROM emailuser")).fetchall()
    print(f"   Jami: {len(emailuser_users)} user")
    for user in emailuser_users:
        print(f"   - {user[1]} - {user[2]}")
    
    # Users table
    print("\n3. USERS TABLE (Legacy):")
    users = pg_session.execute(text("SELECT id, email, full_name FROM users")).fetchall()
    print(f"   Jami: {len(users)} user")
    for user in users:
        print(f"   - {user[1]} - {user[2]}")
    
    # User Accounts table
    print("\n4. USER_ACCOUNTS TABLE (users.db):")
    user_accounts = pg_session.execute(text("SELECT id, email, full_name FROM user_accounts")).fetchall()
    print(f"   Jami: {len(user_accounts)} user")
    for user in user_accounts:
        print(f"   - {user[1]} - {user[2]}")
    
    pg_session.close()
    
    print("\n" + "=" * 70)
    
except Exception as e:
    print(f"❌ Xato: {e}")
    import traceback
    traceback.print_exc()
