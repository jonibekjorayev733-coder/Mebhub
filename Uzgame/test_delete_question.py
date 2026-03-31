#!/usr/bin/env python
"""
Test DELETE question endpoint
"""
import sys
sys.path.insert(0, r'c:\react Jonibek\vite-project\Uzgame')

from app.database import sessionLocal
from app.models.medical import MedicalTopic, TestQuestion
from app.auth.auth import create_access_token
from datetime import datetime, timedelta
import json

def test_delete():
    print("\n" + "="*60)
    print("TEST DELETE QUESTION")
    print("="*60)
    
    with sessionLocal() as db:
        # Get a question to delete
        questions = db.query(TestQuestion).order_by(TestQuestion.id.desc()).limit(1).all()
        
        if not questions:
            print("[ERROR] No questions found to delete")
            return
        
        question = questions[0]
        print(f"\n[INFO] Found question to delete:")
        print(f"  ID: {question.id}")
        print(f"  Topic ID: {question.topic_id}")
        print(f"  Text: {question.question_text}")
        print(f"  Correct Answer: {question.correct_answer}")
        print(f"  Options: {question.options}")
        
        # Try to delete it
        print(f"\n[INFO] Attempting to delete question {question.id}...")
        try:
            db.delete(question)
            db.commit()
            print(f"[SUCCESS] Question {question.id} deleted successfully")
            
            # Verify it's gone
            check = db.query(TestQuestion).filter_by(id=question.id).first()
            if check:
                print(f"[ERROR] Question still exists!")
            else:
                print(f"[SUCCESS] Verified: Question deleted from database")
                
        except Exception as e:
            print(f"[ERROR] Failed to delete: {str(e)}")
            import traceback
            traceback.print_exc()
            db.rollback()

if __name__ == "__main__":
    test_delete()
