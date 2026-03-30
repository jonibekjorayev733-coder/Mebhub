from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

s = sessionmaker(bind=create_engine('postgresql://postgres:jonibek@127.0.0.1:5432/med'))()

med = s.execute(text("SELECT id FROM med WHERE email = 'fixed.postgres@example.com'")).fetchone()
email = s.execute(text("SELECT id FROM emailuser WHERE email = 'fixed.postgres@example.com'")).fetchone()

print(f'Med table: {med}')
print(f'EmailUser table: {email}')

if med and email:
    print('')
    print('✅ SUCCESS! User in BOTH PostgreSQL tables!')
else:
    print('')
    print('❌ FAILED')

s.close()
