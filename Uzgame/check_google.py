from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
session = sessionmaker(bind=create_engine(POSTGRESQL_URL))()

print('=' * 60)
print('🔍 GOOGLE LOGIN SYNC CHECK')
print('=' * 60)

# Check Google users in med
print('\n📋 Med table - Google users:')
google_users = session.execute(text("SELECT id, email, full_name, provider FROM med WHERE provider = 'google'")).fetchall()

if google_users:
    for u in google_users:
        print(f'   [{u[0]}] {u[1]} - {u[2]}')
        
        # Check if this user is in emailuser
        emailuser_check = session.execute(text("SELECT id FROM emailuser WHERE email = :email"), {"email": u[1]}).fetchone()
        if emailuser_check:
            print(f'       ✅ IN emailuser table (ID={emailuser_check[0]})')
        else:
            print(f'       ❌ MISSING from emailuser table')
else:
    print('   ❌ No Google users found in med table')

# Check all users
print(f'\n📊 Total users: Med={session.execute(text("SELECT COUNT(*) FROM med")).scalar()}, EmailUser={session.execute(text("SELECT COUNT(*) FROM emailuser")).scalar()}')

# Show last 3 med users
print('\n📋 Last 3 med users:')
recent = session.execute(text("SELECT id, email, provider FROM med ORDER BY id DESC LIMIT 3")).fetchall()
for u in recent:
    print(f'   [{u[0]}] {u[1]} ({u[2]})')

session.close()
