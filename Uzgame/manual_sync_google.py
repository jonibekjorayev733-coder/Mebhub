from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

s = sessionmaker(bind=create_engine('postgresql://postgres:jonibek@127.0.0.1:5432/med'))()

# Manually add hellojonibek to emailuser to show it SHOULD be there
try:
    s.execute(text(
        "INSERT INTO emailuser (email, password, full_name) VALUES ('hellojonibek123@gmail.com', 'dummy_google_pass', 'Hello Hello') ON CONFLICT (email) DO NOTHING"
    ))
    s.commit()
    print("Added hellojonibek123@gmail.com to emailuser table")
except Exception as e:
    print(f"Error: {e}")
    s.rollback()

# Verify
med = s.execute(text("SELECT id FROM med WHERE email = 'hellojonibek123@gmail.com'")).fetchone()
email = s.execute(text("SELECT id FROM emailuser WHERE email = 'hellojonibek123@gmail.com'")).fetchone()

print('')
print('hellojonibek123@gmail.com:')
print(f'  Med table: {med}')
print(f'  EmailUser table: {email}')

if med and email:
    print('')
    print('✅ Now SYNCED to both tables!')

s.close()
