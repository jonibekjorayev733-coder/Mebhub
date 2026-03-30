from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
pg_engine = create_engine(POSTGRESQL_URL)
PgSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)
pg_session = PgSessionLocal()

try:
    # Fix med table ID sequence FIRST
    print("🔧 Fixing med table ID sequence...")
    pg_session.execute(text("SELECT setval('med_id_seq', COALESCE((SELECT MAX(id) FROM med), 0) + 1)"))
    pg_session.commit()
    print("✓ ID sequence fixed")
    
    # Check all tables
    med_count = pg_session.execute(text("SELECT COUNT(*) FROM med")).scalar()
    emailuser_count = pg_session.execute(text("SELECT COUNT(*) FROM emailuser")).scalar()
    
    print(f"\n📊 Current state:")
    print(f"   Med table: {med_count} users")
    print(f"   EmailUser table: {emailuser_count} users")
    
    # Check if jonibekjorayev733@gmail.com exists
    check = pg_session.execute(text("SELECT id, email FROM med WHERE email = 'jonibekjorayev733@gmail.com'")).fetchone()
    
    if check:
        print(f"\n✓ User found in med table:")
        print(f"   ID: {check[0]}")
        print(f"   Email: {check[1]}")
        
        # Check emailuser
        email_check = pg_session.execute(text("SELECT id FROM emailuser WHERE email = 'jonibekjorayev733@gmail.com'")).fetchone()
        if email_check:
            print(f"✓ User already in emailuser table (ID: {email_check[0]})")
        else:
            print(f"⚠️  User missing from emailuser table - Adding now...")
            pg_session.execute(text(
                "INSERT INTO emailuser (email, password, full_name, create_time) "
                "VALUES (:email, :password, :full_name, :create_time) "
                "ON CONFLICT (email) DO NOTHING"
            ), {
                'email': 'jonibekjorayev733@gmail.com',
                'password': 'dummy_google_password',
                'full_name': 'Jonibek Jorayev',
                'create_time': datetime.now()
            })
            pg_session.commit()
            print("✓ Added to emailuser table")
    else:
        print(f"\n❌ User 'jonibekjorayev733@gmail.com' NOT found in med table")
        print("   This means Google login hasn't been tested yet")
        print("   Next step: Try logging in with Google from the app")
    
    # Show all users in both tables
    print("\n📋 Med table users:")
    users = pg_session.execute(text("SELECT id, email, full_name FROM med")).fetchall()
    for user in users:
        print(f"   [{user[0]}] {user[1]} - {user[2]}")
    
    print("\n📋 EmailUser table users:")
    users = pg_session.execute(text("SELECT id, email, full_name FROM emailuser")).fetchall()
    for user in users:
        print(f"   [{user[0]}] {user[1]} - {user[2]}")
    
finally:
    pg_session.close()
    print("\n✅ Done!")
