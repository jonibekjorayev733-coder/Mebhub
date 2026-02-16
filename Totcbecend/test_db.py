import sys
sys.path.insert(0, '.')
try:
    from app.database import SessionLocal
    from app.models import Course
    
    # Test database connection
    db = SessionLocal()
    courses = db.query(Course).limit(1).all()
    print(f"✅ Database connected! Found {len(courses)} course(s)")
    if courses:
        print(f"   First course: {courses[0].title}")
    db.close()
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
