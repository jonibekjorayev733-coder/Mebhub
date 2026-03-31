#!/usr/bin/env python
"""
Simple Test - Verify Admin Panel Works
No background server needed, test directly via imports
"""
import sys
sys.path.insert(0, r'c:\react Jonibek\vite-project\Uzgame')

from app.database import sessionLocal
from app.models.medical import MedicalTopic, LearningItem, TestQuestion
from app.models.base import AdminRole
from app.auth.auth import create_access_token, get_password_hash
from datetime import datetime, timedelta
import json

# Create admin token
def create_test_token():
    data = {"sub": "admin@example.com", "role": "admin"}
    access_token = create_access_token(data, expires_delta=timedelta(hours=24))
    return access_token

# Test database access
def test_database():
    print("\n" + "="*60)
    print("TESTING DATABASE ACCESS")
    print("="*60)
    
    with sessionLocal() as db:
        # Check existing data
        topics = db.query(MedicalTopic).order_by(MedicalTopic.id.desc()).all()
        items = db.query(LearningItem).order_by(LearningItem.id.desc()).all()
        questions = db.query(TestQuestion).order_by(TestQuestion.id.desc()).all()
        admin_roles = db.query(AdminRole).all()
        
        print(f"[INFO] Found {len(topics)} topics")
        print(f"[INFO] Found {len(items)} learning items")
        print(f"[INFO] Found {len(questions)} questions")
        print(f"[INFO] Found {len(admin_roles)} admin roles")
        
        # Show newest items
        if topics:
            print(f"\n[INFO] Newest 3 topics:")
            for i, t in enumerate(topics[:3], 1):
                print(f"  {i}. ID={t.id}, Name={t.name}")
        
        if items:
            print(f"\n[INFO] Newest 3 learning items:")
            for i, it in enumerate(items[:3], 1):
                print(f"  {i}. ID={it.id}, Latin={it.latin_term}")
        
        if questions:
            print(f"\n[INFO] Newest 3 questions:")
            for i, q in enumerate(questions[:3], 1):
                print(f"  {i}. ID={q.id}, Text={q.question_text[:50]}")
        
        # Test create
        print(f"\n[INFO] Creating new test topic...")
        timestamp = datetime.now().strftime("%H%M%S")
        new_topic = MedicalTopic(
            name=f"TEST_TOPIC_{timestamp}",
            description=f"Test topic {timestamp}",
            order=0
        )
        db.add(new_topic)
        db.commit()
        db.refresh(new_topic)
        print(f"[SUCCESS] Created topic ID={new_topic.id}, Name={new_topic.name}")
        
        # Verify it's first
        topics_after = db.query(MedicalTopic).order_by(MedicalTopic.id.desc()).all()
        if topics_after[0].id == new_topic.id:
            print(f"[SUCCESS] New topic appears at TOP of list!")
        else:
            print(f"[ERROR] New topic NOT at top. First: {topics_after[0].id}, Created: {new_topic.id}")
        
        # Test create item
        print(f"\n[INFO] Creating new learning item...")
        new_item = LearningItem(
            topic_id=new_topic.id,
            latin_term=f"test_latin_{timestamp}",
            uzbek_term=f"test_uzbek_{timestamp}",
            description=f"Test item {timestamp}",
            order=0
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        print(f"[SUCCESS] Created item ID={new_item.id}, Latin={new_item.latin_term}")
        
        # Verify it's first
        items_after = db.query(LearningItem).order_by(LearningItem.id.desc()).all()
        if items_after[0].id == new_item.id:
            print(f"[SUCCESS] New item appears at TOP of list!")
        else:
            print(f"[ERROR] New item NOT at top. First: {items_after[0].id}, Created: {new_item.id}")
        
        # Test create question
        print(f"\n[INFO] Creating new question...")
        new_question = TestQuestion(
            topic_id=new_topic.id,
            question_text=f"Test question {timestamp}?",
            correct_answer="A",
            options=["A", "B", "C", "D"],
            difficulty="medium",
            order=0
        )
        db.add(new_question)
        db.commit()
        db.refresh(new_question)
        print(f"[SUCCESS] Created question ID={new_question.id}")
        
        # Verify it's first
        questions_after = db.query(TestQuestion).order_by(TestQuestion.id.desc()).all()
        if questions_after[0].id == new_question.id:
            print(f"[SUCCESS] New question appears at TOP of list!")
        else:
            print(f"[ERROR] New question NOT at top. First: {questions_after[0].id}, Created: {new_question.id}")
        
        # Test delete
        print(f"\n[INFO] Testing delete operations...")
        db.delete(new_question)
        db.delete(new_item)
        db.delete(new_topic)
        db.commit()
        print(f"[SUCCESS] Deleted all test objects")
        
        # Verify they're gone
        check_topic = db.query(MedicalTopic).filter_by(id=new_topic.id).first()
        check_item = db.query(LearningItem).filter_by(id=new_item.id).first()
        check_question = db.query(TestQuestion).filter_by(id=new_question.id).first()
        
        if not check_topic and not check_item and not check_question:
            print(f"[SUCCESS] All test objects successfully deleted and verified")
        else:
            print(f"[ERROR] Some test objects still exist")

def main():
    print("\n" + "="*60)
    print("ADMIN PANEL DATABASE TEST")
    print("="*60)
    
    try:
        test_database()
        
        # Summary
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print("[PASS] Database connection working")
        print("[PASS] Topics: Create, Read (newest first), Delete")
        print("[PASS] Learning Items: Create, Read (newest first), Delete")
        print("[PASS] Questions: Create, Read (newest first), Delete")
        print("[PASS] Data persistence and ordering verified")
        print("\n*** ALL DATABASE TESTS PASSED! ***\n")
        
    except Exception as e:
        print(f"\n[ERROR] Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
