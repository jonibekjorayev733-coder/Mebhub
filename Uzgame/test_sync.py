import sys
sys.path.insert(0, '.')
from app.database import sessionLocal
from app.database_users import UsersSessionLocal
from app.models.base import Med
from app.models.user_accounts import UserAccount
from app.auth.auth import get_password_hash

users_db = UsersSessionLocal()
med_db = sessionLocal()

try:
    hashed = get_password_hash('testpass123')
    
    # users.db ga qo'shish
    new_user = UserAccount(
        email='directtest@example.com',
        hashed_password=hashed,
        full_name='Direct Test',
        provider='email',
        is_active=True
    )
    users_db.add(new_user)
    users_db.commit()
    print('✓ Added to users.db')
    
    # med table ga qo'shish
    med_user = Med(
        email='directtest@example.com',
        hashed_password=hashed,
        full_name='Direct Test',
        provider='email',
        is_active=True
    )
    med_db.add(med_user)
    med_db.commit()
    print('✓ Added to med table')
    
    print('\n✓ BOTH DATABASES UPDATED!')
    
except Exception as e:
    print(f'Error: {e}')
finally:
    users_db.close()
    med_db.close()
