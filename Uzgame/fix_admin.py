from app.database import sessionLocal
from app.models.base import Med

db = sessionLocal()
admin = db.query(Med).filter(Med.email == 'admin@example.com').first()

if admin:
    print(f"Before: is_admin = {admin.is_admin}")
    admin.is_admin = True
    db.commit()
    print(f"After: is_admin = {admin.is_admin}")
    print("✓ Admin user updated!")
else:
    print("Admin user not found!")

db.close()
