from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Course

# Database session yaratish
db = SessionLocal()

# Test courses yaratish
test_courses = [
    Course(
        title="AWS Certified solutions Architect",
        category="Development",
        image_url="https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="Lina",
        price=57.00,
        total_lessons=7,
        current_lesson=5
    ),
    Course(
        title="AWS Certified solutions Architect",
        category="Development",
        image_url="https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="John Smith",
        price=57.00,
        total_lessons=7,
        current_lesson=3
    ),
    Course(
        title="Learn Ethical Hacking from beginner",
        category="Design",
        image_url="https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="Sarah Johnson",
        price=49.99,
        total_lessons=7,
        current_lesson=6
    ),
    Course(
        title="Advanced Python Programming",
        category="Development",
        image_url="https://images.pexels.com/photos/574283/pexels-photo-574283.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="Mike Davis",
        price=65.00,
        total_lessons=10,
        current_lesson=7
    ),
    Course(
        title="Web Design Fundamentals",
        category="Design",
        image_url="https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="Emma Wilson",
        price=45.00,
        total_lessons=8,
        current_lesson=5
    ),
    Course(
        title="Business Strategy Mastery",
        category="Business",
        image_url="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="Robert Brown",
        price=79.99,
        total_lessons=12,
        current_lesson=8
    ),
    Course(
        title="Digital Marketing Essentials",
        category="Marketing",
        image_url="https://images.pexels.com/photos/3771109/pexels-photo-3771109.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="Lisa Anderson",
        price=39.99,
        total_lessons=6,
        current_lesson=4
    ),
    Course(
        title="Professional Photography",
        category="Photography",
        image_url="https://images.pexels.com/photos/1820994/pexels-photo-1820994.jpeg?auto=compress&cs=tinysrgb&w=600",
        author="Tom Miller",
        price=55.00,
        total_lessons=9,
        current_lesson=3
    ),
]

# Database da mavjud kurslarni o'chirish (opsional)
db.query(Course).delete()
db.commit()

# Yangi kurslarni qo'shish
for course in test_courses:
    db.add(course)
    db.commit()
    print(f"✅ Added: {course.title}")

db.close()
print("\n✅ Test data successfully added!")
