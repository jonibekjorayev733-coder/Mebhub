from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

POSTGRESQL_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"
pg_engine = create_engine(POSTGRESQL_URL)
PgSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

print("=" * 70)
print("MANUAL: jonibekjorayev733@gmail.com NI ADD QILISH")
print("=" * 70)

try:
    pg_session = PgSessionLocal()
    
    # Med table - ID automatic bo'lsin
    insert_med = f"""
    INSERT INTO med (email, hashed_password, full_name, is_active, google_id, provider)
    VALUES ('{email}', '{dummy_password}', '{full_name}', TRUE, '105583218070864757364', 'google')
    ON CONFLICT (email) DO UPDATE SET provider = 'google'
    """
    pg_session.execute(text(insert_med))
    print(f"✓ Med tableiga qo'shildi: {email}")
    
    # EmailUser table
    emailuser_password = pwd_context.hash("google_backup_password")
    insert_emailuser = f"""
    INSERT INTO emailuser (email, password, full_name, create_time)
    VALUES ('{email}', '{emailuser_password}', '{full_name}', NOW())
    ON CONFLICT (email) DO NOTHING
    """
    pg_session.execute(text(insert_emailuser))
    print(f"✓ EmailUser tableiga qo'shildi: {email}")
    
    pg_session.commit()
    
    # Verify
    print("\n" + "=" * 70)
    print("VERIFICATION")
    print("=" * 70)
    
    med_check = pg_session.execute(text(f"SELECT id, email, provider FROM med WHERE email = '{email}'")).fetchone()
    print(f"Med: {med_check}")
    
    emailuser_check = pg_session.execute(text(f"SELECT id, email FROM emailuser WHERE email = '{email}'")).fetchone()
    print(f"EmailUser: {emailuser_check}")
    
    pg_session.close()
    
    print("\n✅ TAYYOR!")
    
except Exception as e:
    print(f"❌ Xato: {e}")
    import traceback
    traceback.print_exc()
