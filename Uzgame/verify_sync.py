from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
pg_engine = create_engine(POSTGRESQL_URL)
session = sessionmaker(bind=pg_engine)()

print('📋 Med table (last 5):')
users = session.execute(text('SELECT id, email, full_name FROM med ORDER BY id DESC LIMIT 5')).fetchall()
for u in users:
    print(f'   [{u[0]}] {u[1]}')

print('')
print('📋 EmailUser table (last 5):')
users = session.execute(text('SELECT id, email, full_name FROM emailuser ORDER BY id DESC LIMIT 5')).fetchall()
for u in users:
    print(f'   [{u[0]}] {u[1]}')

# Check latest emails added
print('')
print('🔍 Checking LATEST users:')

test_emails = ['final.test@example.com', 'direct.test@example.com', 'sync.test2@example.com', 'sync.test@example.com']

for email in test_emails:
    med_check = session.execute(text("SELECT id FROM med WHERE email = :email"), {"email": email}).fetchone()
    email_check = session.execute(text("SELECT id FROM emailuser WHERE email = :email"), {"email": email}).fetchone()
    
    status = ""
    if med_check and email_check:
        status = f"✅ Both tables (med_id={med_check[0]}, email_id={email_check[0]})"
    elif med_check:
        status = f"⚠️ Only med table (ID={med_check[0]})"
    elif email_check:
        status = f"⚠️ Only emailuser table (ID={email_check[0]})"
    else:
        status = "❌ NOT found"
    
    print(f"   {email}: {status}")

session.close()

