from app.database import SessionLocal
from app.models import User
from app.security import hash_password

db = SessionLocal()

# O'tgan teacher user o'chirish
db.query(User).filter(User.email == "teacher@example.com").delete()
db.commit()

# Yangi teacher user qo'shish
teacher = User(
    username="teacher",
    email="teacher@example.com",
    hashed_password=hash_password("teacher123"),
    role="teacher"
)
db.add(teacher)
db.commit()
db.refresh(teacher)

print(f"✅ Teacher user created: {teacher.email} (ID: {teacher.id})")
print(f"   Username: teacher")
print(f"   Password: teacher123")
print(f"   Role: {teacher.role}")

db.close()
