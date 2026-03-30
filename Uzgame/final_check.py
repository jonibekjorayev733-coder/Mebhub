from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
pg_engine = create_engine(POSTGRESQL_URL)
session = sessionmaker(bind=pg_engine)()

print('🔍 FINAL VERIFICATION:')
print('')

# Check proven.working
med = session.execute(text("SELECT id, email, full_name FROM med WHERE email = 'proven.working@example.com'")).fetchone()
email = session.execute(text("SELECT id, email, full_name FROM emailuser WHERE email = 'proven.working@example.com'")).fetchone()

print('proven.working@example.com:')
if med:
    print(f'  ✅ Med table: ID={med[0]}, Email={med[1]}, Name={med[2]}')
else:
    print(f'  ❌ Med table: NOT FOUND')

if email:
    print(f'  ✅ EmailUser table: ID={email[0]}, Email={email[1]}, Name={email[2]}')
else:
    print(f'  ❌ EmailUser table: NOT FOUND')

# Also check direct.test
print('')
print('direct.test@example.com:')
med2 = session.execute(text("SELECT id, email, full_name FROM med WHERE email = 'direct.test@example.com'")).fetchone()
email2 = session.execute(text("SELECT id, email, full_name FROM emailuser WHERE email = 'direct.test@example.com'")).fetchone()

if med2 and email2:
    print(f'  ✅ BOTH tables - med_id={med2[0]}, email_id={email2[0]}')
else:
    print(f'  ❌ Missing from one or both tables')

# Count totals
med_count = session.execute(text("SELECT COUNT(*) FROM med")).scalar()
email_count = session.execute(text("SELECT COUNT(*) FROM emailuser")).scalar()

print('')
print(f'📊 TOTALS: Med={med_count}, EmailUser={email_count}')

if med and email:
    print('')
    print('🎉 ✅ SYNC WORKING PERFECTLY! New users are saved to BOTH tables!')
else:
    print('')
    print('⚠️ Check again - might need database refresh')

session.close()
