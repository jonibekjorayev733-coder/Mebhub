from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

session = sessionmaker(bind=create_engine('postgresql://postgres:jonibek@127.0.0.1:5432/med'))()

med_count = session.execute(text('SELECT COUNT(*) FROM med')).scalar()
email_count = session.execute(text('SELECT COUNT(*) FROM emailuser')).scalar()

# Check logging.test
med_check = session.execute(text("SELECT id FROM med WHERE email = 'logging.test@example.com'")).fetchone()
email_check = session.execute(text("SELECT id FROM emailuser WHERE email = 'logging.test@example.com'")).fetchone()

print(f'Med table: {med_count} users')
print(f'EmailUser table: {email_count} users')
print('')
print(f'logging.test@example.com:')
print(f'  Med: {med_check}')
print(f'  EmailUser: {email_check}')

if med_check and email_check:
    print('')
    print('✅ SUCCESS: User in BOTH tables!')
else:
    print('')
    print('❌ FAILURE: User missing from one or both tables')

session.close()
