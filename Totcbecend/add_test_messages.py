from app.database import SessionLocal
from app.models import User, TeacherMessage
from datetime import datetime

db = SessionLocal()

# Get teacher and students
teacher = db.query(User).filter(User.email == "teacher@example.com").first()
student1 = db.query(User).filter(User.email == "student1@example.com").first()
student2 = db.query(User).filter(User.email == "student2@example.com").first()

if not teacher or not student1 or not student2:
    print("❌ Teacher or students not found!")
    db.close()
    exit(1)

# Clear existing messages
db.query(TeacherMessage).delete()
db.commit()

# Add test messages
messages = [
    TeacherMessage(
        sender_id=student1.id,
        receiver_id=teacher.id,
        message="Assalamu alaikum! Darsning 1-qismi haqida savol bor",
        is_read=0,
        timestamp=datetime.now()
    ),
    TeacherMessage(
        sender_id=teacher.id,
        receiver_id=student1.id,
        message="Wa alaikum assalam! Qanday savol?",
        is_read=1,
        timestamp=datetime.now()
    ),
    TeacherMessage(
        sender_id=student2.id,
        receiver_id=teacher.id,
        message="Javob berish vaqti qachon?",
        is_read=0,
        timestamp=datetime.now()
    ),
]

for msg in messages:
    db.add(msg)

db.commit()

print("✅ Test messages added!")
print(f"   Student 1: {student1.username}")
print(f"   Student 2: {student2.username}")
print(f"   Teacher: {teacher.username}")
print("\n📨 Messages created successfully!")

db.close()
