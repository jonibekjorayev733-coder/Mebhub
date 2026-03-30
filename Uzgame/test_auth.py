from app.database import sessionLocal
from app.models.base import Med
from app.auth.auth import verify_password, get_password_hash

db = sessionLocal()
user = db.query(Med).filter(Med.email == 'admin@example.com').first()
print(f'User: {user.email}')
print(f'Has password hash: {user.hashed_password is not None}')
if user.hashed_password:
    print(f'Password hash: {user.hashed_password}')
    
    # Try verifying with common passwords
    test_passwords = ['admin', 'password', 'admin123', '123456', 'test', 'jonibek']
    for pwd in test_passwords:
        try:
            result = verify_password(pwd, user.hashed_password)
            print(f'Password "{pwd}": {result}')
        except Exception as e:
            print(f'Password "{pwd}": ERROR - {e}')
            
db.close()
