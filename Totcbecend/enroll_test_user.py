from app.database import SessionLocal
from app.models import User, Course, UserCourse
import sys

db = SessionLocal()

# Get test user
user = db.query(User).filter(User.username == "testuser").first()
if not user:
    print("❌ Test user not found!")
    sys.exit(1)

# Get first course
course = db.query(Course).first()
if not course:
    print("❌ No courses found!")
    sys.exit(1)

# Check if already enrolled
exists = db.query(UserCourse).filter(
    UserCourse.user_id == user.id, 
    UserCourse.course_id == course.id
).first()

if exists:
    print(f"ℹ️ User {user.username} already enrolled in {course.title}")
else:
    enrollment = UserCourse(user_id=user.id, course_id=course.id)
    db.add(enrollment)
    db.commit()
    print(f"✅ User {user.username} enrolled in {course.title}")

db.close()
