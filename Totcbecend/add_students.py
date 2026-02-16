from app.database import SessionLocal
from app.models import User
from app.security import hash_password

db = SessionLocal()

# Test students qo'shish
students_data = [
    {"username": "student1", "email": "student1@example.com"},
    {"username": "student2", "email": "student2@example.com"},
    {"username": "student3", "email": "student3@example.com"},
]

for data in students_data:
    existing = db.query(User).filter(User.email == data["email"]).first()
    if existing:
        continue
    
    student = User(
        username=data["username"],
        email=data["email"],
        hashed_password=hash_password("student123"),
        role="student"
    )
    db.add(student)
    print(f"✅ Added: {data['username']}")

db.commit()
db.close()
print("\n✅ All students added!")
