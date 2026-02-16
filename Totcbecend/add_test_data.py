"""
Test data qo'shish uchun script
"""
from app.database import SessionLocal, engine, Base
from app.models import Course
from sqlalchemy import text

db = SessionLocal()

# Avval courses jadvali bo'sh ekanini tekshiramiz
result = db.query(Course).first()
if result:
    print("⚠️  Courses jadvalida allaqachon ma'lumot bor")
    db.close()
    exit()

# Test courses qo'shish
test_courses = [
    {
        "title": "AWS Certified Solutions Architect",
        "category": "Cloud",
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
        "author": "John Smith",
        "price": 99.99
    },
    {
        "title": "Web Development Bootcamp",
        "category": "Development",
        "image_url": "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500",
        "author": "Sarah Johnson",
        "price": 79.99
    },
    {
        "title": "UI/UX Design Masterclass",
        "category": "Design",
        "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
        "author": "Mike Chen",
        "price": 89.99
    },
    {
        "title": "Python for Data Science",
        "category": "Data Science",
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500",
        "author": "Emma Davis",
        "price": 74.99
    },
    {
        "title": "Digital Marketing 2024",
        "category": "Marketing",
        "image_url": "https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=500",
        "author": "Robert Wilson",
        "price": 59.99
    },
    {
        "title": "Photography Fundamentals",
        "category": "Photography",
        "image_url": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
        "author": "Lisa Anderson",
        "price": 49.99
    },
    {
        "title": "Acting for Beginners",
        "category": "Acting",
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
        "author": "David Thompson",
        "price": 69.99
    },
    {
        "title": "Business Strategy & Leadership",
        "category": "Business",
        "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
        "author": "Jennifer Martinez",
        "price": 84.99
    },
]

# Database ga qo'shish
for course_data in test_courses:
    course = Course(**course_data)
    db.add(course)

db.commit()
print(f"✅ {len(test_courses)} ta test course qo'shildi!")

for i, course in enumerate(db.query(Course).all(), 1):
    print(f"  {i}. {course.title} ({course.category}) - ${course.price}")

db.close()
