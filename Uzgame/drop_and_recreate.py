"""
Drop old medical tables and recreate fresh
"""
from sqlalchemy import text
from app.database import engine, Base
from app.models.medical import MedicalTopic, LearningItem, TestQuestion

# Drop existing tables
with engine.begin() as conn:
    conn.execute(text("DROP TABLE IF EXISTS test_questions CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS learning_items CASCADE"))
    conn.execute(text("DROP TABLE IF EXISTS medical_topics CASCADE"))
    conn.commit()
    print("✓ Old tables dropped")

# Create new tables
Base.metadata.create_all(bind=engine)
print("✓ New medical tables created")
print("  - medical_topics")
print("  - learning_items")
print("  - test_questions")
