"""
Bu script barcha jadvallarni yaratadi
"""
from app.database import engine, Base
from app.models import User, Course, UserCourse

# Barcha modelsni yaratish
Base.metadata.create_all(bind=engine)

print("✅ Barcha jadvallar yaratildi!")
print("📊 Yaratilgan jadvallar:")
print("  - users")
print("  - courses")
print("  - user_courses")
