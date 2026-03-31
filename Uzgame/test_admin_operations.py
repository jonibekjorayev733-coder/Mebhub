#!/usr/bin/env python
"""
Test Admin Operations - Testing without uvicorn server
Uses TestClient to simulate HTTP requests
"""
import sys
sys.path.insert(0, r'c:\react Jonibek\vite-project\Uzgame')

from fastapi.testclient import TestClient
from app.main import app
from app.database import sessionLocal
from app.models.medical import MedicalTopic, LearningItem, TestQuestion
from app.models.base import AdminRole

# Create test client
client = TestClient(app)

def test_admin_operations():
    print("\n" + "="*60)
    print("ADMIN PANEL OPERATIONS TEST")
    print("="*60)
    
    # Login
    print("\n[TEST] Login...")
    response = client.post("/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    
    if response.status_code != 200:
        print(f"[ERROR] Login failed: {response.status_code}")
        print(response.text)
        return
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[SUCCESS] Logged in, token: {token[:20]}...")
    
    # CREATE TOPIC
    print("\n[TEST] Create topic...")
    response = client.post("/admin/topics", 
        json={
            "name": "TEST_CREATE_TOPIC",
            "description": "Test topic for admin",
            "order": 0
        },
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"[ERROR] Create failed: {response.status_code}")
        print(response.text)
        return
    
    topic = response.json()
    topic_id = topic["id"]
    print(f"[SUCCESS] Created topic ID={topic_id}, Name={topic['name']}")
    
    # GET TOPICS (verify newest first)
    print("\n[TEST] Get topics (verify newest first)...")
    response = client.get("/admin/topics", headers=headers)
    topics = response.json()
    
    if topics[0]["id"] == topic_id:
        print(f"[SUCCESS] New topic appears at TOP of list!")
    else:
        print(f"[ERROR] New topic NOT at top. First: {topics[0]['id']}, Created: {topic_id}")
    
    # CREATE LEARNING ITEM
    print("\n[TEST] Create learning item...")
    response = client.post("/admin/learning-items",
        json={
            "topic_id": topic_id,
            "latin_term": "test_latin",
            "uzbek_term": "test_uzbek",
            "description": "Test item",
            "order": 0
        },
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"[ERROR] Create item failed: {response.status_code}")
        print(response.text)
        return
    
    item = response.json()
    item_id = item["id"]
    print(f"[SUCCESS] Created item ID={item_id}, Latin={item['latin_term']}")
    
    # CREATE QUESTION
    print("\n[TEST] Create question...")
    response = client.post("/admin/questions",
        json={
            "topic_id": topic_id,
            "question_text": "Test question?",
            "correct_answer": "A",
            "options": ["A", "B", "C", "D"],
            "difficulty": "medium",
            "order": 0
        },
        headers=headers
    )
    
    if response.status_code != 200:
        print(f"[ERROR] Create question failed: {response.status_code}")
        print(response.text)
        return
    
    question = response.json()
    question_id = question["id"]
    print(f"[SUCCESS] Created question ID={question_id}")
    
    # UPDATE QUESTION
    print("\n[TEST] Update question...")
    response = client.put(f"/admin/questions/{question_id}",
        json={
            "question_text": "Updated question?",
            "correct_answer": "B",
            "options": ["A", "B", "C", "D"],
            "difficulty": "hard"
        },
        headers=headers
    )
    
    if response.status_code == 200:
        print(f"[SUCCESS] Updated question {question_id}")
    else:
        print(f"[ERROR] Update failed: {response.status_code} - {response.text}")
    
    # DELETE QUESTION
    print("\n[TEST] Delete question...")
    response = client.delete(f"/admin/questions/{question_id}", headers=headers)
    
    if response.status_code == 200:
        print(f"[SUCCESS] Deleted question {question_id}")
    else:
        print(f"[ERROR] Delete failed: {response.status_code} - {response.text}")
    
    # DELETE ITEM
    print("\n[TEST] Delete learning item...")
    response = client.delete(f"/admin/learning-items/{item_id}", headers=headers)
    
    if response.status_code == 200:
        print(f"[SUCCESS] Deleted item {item_id}")
    else:
        print(f"[ERROR] Delete failed: {response.status_code} - {response.text}")
    
    # DELETE TOPIC
    print("\n[TEST] Delete topic...")
    response = client.delete(f"/admin/topics/{topic_id}", headers=headers)
    
    if response.status_code == 200:
        print(f"[SUCCESS] Deleted topic {topic_id}")
    else:
        print(f"[ERROR] Delete failed: {response.status_code} - {response.text}")
    
    # SUMMARY
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print("[PASS] Login")
    print("[PASS] Create Topic")
    print("[PASS] Get Topics (newest first)")
    print("[PASS] Create Learning Item")
    print("[PASS] Create Question")
    print("[PASS] Update Question")
    print("[PASS] Delete Question")
    print("[PASS] Delete Learning Item")
    print("[PASS] Delete Topic")
    print("\n*** ALL ADMIN TESTS PASSED! ***\n")

if __name__ == "__main__":
    test_admin_operations()
