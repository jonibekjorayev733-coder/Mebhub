from app.auth.auth import authenticate_user
from app.database import get_db
from sqlalchemy.orm import Session
import logging

logging.basicConfig(level=logging.DEBUG)

# Get a database session
db_gen = get_db()
db = next(db_gen)

try:
    result = authenticate_user(db, 'demo@example.com', 'demo123')
    print(f'\nResult: {result}')
    print(f'Result type: {type(result)}')
    print(f'Result bool: {bool(result)}')
    
    if result:
        print(f'Email: {result.email}')
        print(f'Admin: {result.is_admin}')
    else:
        print('Authentication failed')
        
finally:
    db.close()
