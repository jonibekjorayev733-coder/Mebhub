from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Course, Lesson

db = SessionLocal()

# Test courses bilan lessons yaratish - har bir mavzu uchun turli videolar
courses_data = [
    {
        "title": "AWS Certified solutions Architect",
        "category": "Development",
        "image_url": "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=600",
        "author": "Lina",
        "price": 57.00,
        "total_lessons": 7,
        "current_lesson": 5,
        "description": "AWS Architecture haqida to'liq kurs",
        "lessons": [
            {"title": "AWS Fundamentals", "description": "AWS asoslari", "video_url": "https://www.youtube.com/embed/ZB5yWaLT5sU", "order": 1},
            {"title": "EC2 Instances", "description": "EC2 turlari va sozlash", "video_url": "https://www.youtube.com/embed/27y0y8Ik-_o", "order": 2},
            {"title": "S3 Storage", "description": "S3 dan foydalanish", "video_url": "https://www.youtube.com/embed/77lAGoMXu3E", "order": 3},
            {"title": "VPC & Security", "description": "Network security", "video_url": "https://www.youtube.com/embed/woC6l8FHw-0", "order": 4},
            {"title": "Databases", "description": "RDS va DynamoDB", "video_url": "https://www.youtube.com/embed/oe21Nlq8GS4", "order": 5},
            {"title": "Load Balancing", "description": "ELB konfiguratsiyasi", "video_url": "https://www.youtube.com/embed/xEH0Dtz2YM0", "order": 6},
            {"title": "Monitoring", "description": "CloudWatch monitoring", "video_url": "https://www.youtube.com/embed/Ey3C-eHlzf0", "order": 7},
        ]
    },
    {
        "title": "Learn Ethical Hacking from beginner",
        "category": "Design",
        "image_url": "https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=600",
        "author": "Sarah Johnson",
        "price": 49.99,
        "total_lessons": 7,
        "current_lesson": 6,
        "description": "Ethical Hacking bo'yicha kurs",
        "lessons": [
            {"title": "Networking Basics", "description": "Network fundamentals", "video_url": "https://www.youtube.com/embed/eO6ibDQeFEo", "order": 1},
            {"title": "Penetration Testing", "description": "Pen testing asoslari", "video_url": "https://www.youtube.com/embed/jMRYaMDtWHs", "order": 2},
            {"title": "Web Security", "description": "Web application security", "video_url": "https://www.youtube.com/embed/GrJ70Z9d41Q", "order": 3},
            {"title": "Cryptography", "description": "Encryption methods", "video_url": "https://www.youtube.com/embed/jhXCTbFnK8o", "order": 4},
            {"title": "Malware Analysis", "description": "Malware detection", "video_url": "https://www.youtube.com/embed/lW3-zPDS5Xk", "order": 5},
            {"title": "Vulnerability Assessment", "description": "Zaaiflik tahlili", "video_url": "https://www.youtube.com/embed/6AyNVPb8P0Q", "order": 6},
            {"title": "Ethical Hacking Tools", "description": "Tools va teknikalar", "video_url": "https://www.youtube.com/embed/fNzrRe2SmTM", "order": 7},
        ]
    },
    {
        "title": "Advanced Python Programming",
        "category": "Development",
        "image_url": "https://images.pexels.com/photos/574283/pexels-photo-574283.jpeg?auto=compress&cs=tinysrgb&w=600",
        "author": "Mike Davis",
        "price": 65.00,
        "total_lessons": 10,
        "current_lesson": 7,
        "description": "Python dasturlash bo'yicha ilg'or kurs",
        "lessons": [
            {"title": "Python Basics", "description": "Python fundamentals", "video_url": "https://www.youtube.com/embed/_uQrJ0TkSuc", "order": 1},
            {"title": "OOP Concepts", "description": "Object-Oriented Programming", "video_url": "https://www.youtube.com/embed/Ej_02ICOIgs", "order": 2},
            {"title": "Decorators", "description": "Python decorators", "video_url": "https://www.youtube.com/embed/FsAPt_9Bf3U", "order": 3},
            {"title": "Generators", "description": "Generator functions", "video_url": "https://www.youtube.com/embed/bD05uGo_sVI", "order": 4},
            {"title": "Async Programming", "description": "Asynchronous code", "video_url": "https://www.youtube.com/embed/JrJlKL4-4DQ", "order": 5},
            {"title": "List Comprehensions", "description": "Advanced list operations", "video_url": "https://www.youtube.com/embed/vcQUI2cFV8M", "order": 6},
            {"title": "Error Handling", "description": "Exception handling", "video_url": "https://www.youtube.com/embed/NIWwJbo-9_8", "order": 7},
            {"title": "Modules & Packages", "description": "Code organization", "video_url": "https://www.youtube.com/embed/f1DZkFCv8n8", "order": 8},
            {"title": "Testing", "description": "Unit testing va pytest", "video_url": "https://www.youtube.com/embed/bbp_849-RZ4", "order": 9},
            {"title": "Performance", "description": "Code optimization", "video_url": "https://www.youtube.com/embed/oLgfLX3GXyE", "order": 10},
        ]
    }
]

# Database'da mavjud ma'lumotlarni o'chirish
db.query(Lesson).delete()
db.query(Course).delete()
db.commit()

# Database'ga qo'shish
for course_data in courses_data:
    lessons = course_data.pop("lessons", [])
    course = Course(**course_data)
    db.add(course)
    db.commit()
    db.refresh(course)
    
    # Lessons qo'shish
    for lesson_data in lessons:
        lesson = Lesson(course_id=course.id, **lesson_data)
        db.add(lesson)
    
    db.commit()
    print(f"✅ Added course with lessons: {course.title}")

db.close()
print("\n✅ Complete test data successfully added with real video URLs!")
