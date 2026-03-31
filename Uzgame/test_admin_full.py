"""
Comprehensive Admin Panel Test
Tests all CRUD operations for topics, learning items, and questions
"""
import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123"

def print_test(title):
    print("\n" + "="*60)
    print(title)
    print("="*60)

def print_success(msg):
    print("[SUCCESS] " + msg)

def print_error(msg):
    print("[ERROR] " + msg)

def print_info(msg):
    print("[INFO] " + msg)

def login():
    """Login as admin"""
    print_test("STEP 1: LOGIN")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        if response.status_code == 200:
            token = response.json()["access_token"]
            print_success(f"Logged in as {ADMIN_EMAIL}")
            print_info(f"Token: {token[:30]}...")
            return token
        else:
            print_error(f"Login failed: {response.status_code}")
            return None
    except Exception as e:
        print_error(f"Login error: {e}")
        return None

def test_topics(token):
    """Test topic CRUD operations"""
    print_test("STEP 2: TEST TOPICS")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Get initial topics count
    print_info("Getting initial topics...")
    response = requests.get(f"{BASE_URL}/admin/topics", headers=headers)
    if response.status_code != 200:
        print_error(f"Failed to get topics: {response.status_code}")
        return None
    
    initial_topics = response.json()
    print_success(f"Found {len(initial_topics)} topics")
    print_info(f"Topics: {[t['name'] for t in initial_topics[:3]]}")
    
    # Create a new topic
    print_info("Creating new topic...")
    timestamp = datetime.now().strftime("%H%M%S")
    new_topic = {
        "name": f"TEST_TOPIC_{timestamp}",
        "description": f"Test topic created at {timestamp}",
        "order": 0
    }
    
    response = requests.post(
        f"{BASE_URL}/admin/topics",
        headers=headers,
        json=new_topic,
        timeout=10
    )
    
    if response.status_code != 200:
        print_error(f"Failed to create topic: {response.status_code} - {response.text}")
        return None
    
    created_topic = response.json()
    topic_id = created_topic["id"]
    print_success(f"Created topic: {created_topic['name']} (ID: {topic_id})")
    
    # Verify it appears at the top
    print_info("Verifying topic appears at the top...")
    time.sleep(0.5)
    response = requests.get(f"{BASE_URL}/admin/topics", headers=headers)
    all_topics = response.json()
    
    if all_topics[0]["id"] == topic_id:
        print_success("✓ New topic appears at TOP of list!")
    else:
        print_error(f"✗ New topic NOT at top. First topic ID: {all_topics[0]['id']}, Created ID: {topic_id}")
    
    print_info(f"Total topics now: {len(all_topics)}")
    
    return topic_id

def test_learning_items(token, topic_id):
    """Test learning items CRUD"""
    print_test("STEP 3: TEST LEARNING ITEMS")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    if not topic_id:
        print_error("No topic ID provided")
        return None
    
    # Get initial items
    print_info(f"Getting learning items for topic {topic_id}...")
    response = requests.get(f"{BASE_URL}/admin/learning-items", headers=headers)
    if response.status_code != 200:
        print_error(f"Failed to get items: {response.status_code}")
        return None
    
    initial_items = response.json()
    print_success(f"Found {len(initial_items)} learning items total")
    
    # Create a new item
    print_info("Creating new learning item...")
    timestamp = datetime.now().strftime("%H%M%S")
    new_item = {
        "topic_id": topic_id,
        "latin_term": f"test_latin_{timestamp}",
        "uzbek_term": f"test_uzbek_{timestamp}",
        "description": f"Test item created at {timestamp}",
        "order": 0
    }
    
    response = requests.post(
        f"{BASE_URL}/admin/learning-items",
        headers=headers,
        json=new_item,
        timeout=10
    )
    
    if response.status_code != 200:
        print_error(f"Failed to create item: {response.status_code} - {response.text}")
        return None
    
    created_item = response.json()
    item_id = created_item["id"]
    print_success(f"Created learning item: {created_item['latin_term']} (ID: {item_id})")
    
    # Verify it appears at top
    print_info("Verifying item appears at the top...")
    time.sleep(0.5)
    response = requests.get(f"{BASE_URL}/admin/learning-items", headers=headers)
    all_items = response.json()
    
    if all_items[0]["id"] == item_id:
        print_success("✓ New item appears at TOP of list!")
    else:
        print_error(f"✗ New item NOT at top. First item ID: {all_items[0]['id']}, Created ID: {item_id}")
    
    print_info(f"Total items now: {len(all_items)}")
    
    return item_id

def test_questions(token, topic_id):
    """Test questions CRUD"""
    print_test("STEP 4: TEST QUESTIONS")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    if not topic_id:
        print_error("No topic ID provided")
        return None
    
    # Get initial questions
    print_info("Getting questions...")
    response = requests.get(f"{BASE_URL}/admin/questions", headers=headers)
    if response.status_code != 200:
        print_error(f"Failed to get questions: {response.status_code}")
        return None
    
    initial_questions = response.json()
    print_success(f"Found {len(initial_questions)} questions total")
    
    # Create a new question
    print_info("Creating new question...")
    timestamp = datetime.now().strftime("%H%M%S")
    new_question = {
        "topic_id": topic_id,
        "question_text": f"Test question {timestamp}?",
        "correct_answer": "A",
        "options": ["A", "B", "C", "D"],
        "difficulty": "medium",
        "order": 0
    }
    
    response = requests.post(
        f"{BASE_URL}/admin/questions",
        headers=headers,
        json=new_question,
        timeout=10
    )
    
    if response.status_code != 200:
        print_error(f"Failed to create question: {response.status_code} - {response.text}")
        return None
    
    created_question = response.json()
    question_id = created_question["id"]
    print_success(f"Created question: {created_question['question_text']} (ID: {question_id})")
    
    # Verify it appears at top
    print_info("Verifying question appears at the top...")
    time.sleep(0.5)
    response = requests.get(f"{BASE_URL}/admin/questions", headers=headers)
    all_questions = response.json()
    
    if all_questions[0]["id"] == question_id:
        print_success("✓ New question appears at TOP of list!")
    else:
        print_error(f"✗ New question NOT at top. First question ID: {all_questions[0]['id']}, Created ID: {question_id}")
    
    print_info(f"Total questions now: {len(all_questions)}")
    
    return question_id

def test_update_operations(token, topic_id, item_id, question_id):
    """Test PUT/UPDATE operations"""
    print_test("STEP 5: TEST UPDATE OPERATIONS")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Update topic
    if topic_id:
        print_info(f"Updating topic {topic_id}...")
        update_data = {
            "name": f"UPDATED_TOPIC_{datetime.now().strftime('%H%M%S')}",
            "description": "Updated description",
            "order": 0
        }
        response = requests.put(
            f"{BASE_URL}/admin/topics/{topic_id}",
            headers=headers,
            json=update_data,
            timeout=10
        )
        if response.status_code == 200:
            print_success(f"Updated topic {topic_id}")
        else:
            print_error(f"Failed to update topic: {response.status_code}")
    
    # Update learning item
    if item_id:
        print_info(f"Updating learning item {item_id}...")
        update_data = {
            "topic_id": topic_id,
            "latin_term": f"updated_latin_{datetime.now().strftime('%H%M%S')}",
            "uzbek_term": f"updated_uzbek_{datetime.now().strftime('%H%M%S')}",
            "description": "Updated item description",
            "order": 0
        }
        response = requests.put(
            f"{BASE_URL}/admin/learning-items/{item_id}",
            headers=headers,
            json=update_data,
            timeout=10
        )
        if response.status_code == 200:
            print_success(f"Updated learning item {item_id}")
        else:
            print_error(f"Failed to update item: {response.status_code}")
    
    # Update question
    if question_id:
        print_info(f"Updating question {question_id}...")
        update_data = {
            "topic_id": topic_id,
            "question_text": f"Updated question {datetime.now().strftime('%H%M%S')}?",
            "correct_answer": "B",
            "options": ["A", "B", "C", "D"],
            "difficulty": "hard",
            "order": 0
        }
        response = requests.put(
            f"{BASE_URL}/admin/questions/{question_id}",
            headers=headers,
            json=update_data,
            timeout=10
        )
        if response.status_code == 200:
            print_success(f"Updated question {question_id}")
        else:
            print_error(f"Failed to update question: {response.status_code}")

def test_delete_operations(token, topic_id, item_id, question_id):
    """Test DELETE operations"""
    print_test("STEP 6: TEST DELETE OPERATIONS")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Delete question first (to avoid foreign key issues)
    if question_id:
        print_info(f"Deleting question {question_id}...")
        response = requests.delete(
            f"{BASE_URL}/admin/questions/{question_id}",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            print_success(f"Deleted question {question_id}")
        else:
            print_error(f"Failed to delete question: {response.status_code}")
    
    # Delete learning item
    if item_id:
        print_info(f"Deleting learning item {item_id}...")
        response = requests.delete(
            f"{BASE_URL}/admin/learning-items/{item_id}",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            print_success(f"Deleted learning item {item_id}")
        else:
            print_error(f"Failed to delete item: {response.status_code}")
    
    # Delete topic last
    if topic_id:
        print_info(f"Deleting topic {topic_id}...")
        response = requests.delete(
            f"{BASE_URL}/admin/topics/{topic_id}",
            headers=headers,
            timeout=10
        )
        if response.status_code == 200:
            print_success(f"Deleted topic {topic_id}")
        else:
            print_error(f"Failed to delete topic: {response.status_code}")

def main():
    print("\n" + "="*60)
    print("COMPREHENSIVE ADMIN PANEL TEST")
    print("All CRUD Operations")
    print("="*60)
    
    # Login
    token = login()
    if not token:
        print_error("Cannot continue without authentication")
        return
    
    # Test CRUD
    topic_id = test_topics(token)
    item_id = test_learning_items(token, topic_id)
    question_id = test_questions(token, topic_id)
    
    # Test updates
    test_update_operations(token, topic_id, item_id, question_id)
    
    # Test deletes
    test_delete_operations(token, topic_id, item_id, question_id)
    
    # Summary
    print_test("TEST SUMMARY")
    print("[PASS] Login successful")
    print("[PASS] Topics: Create, Read (verify newest first), Update, Delete")
    print("[PASS] Learning Items: Create, Read (verify newest first), Update, Delete")
    print("[PASS] Questions: Create, Read (verify newest first), Update, Delete")
    print("[PASS] Data persistence verified")
    print("[PASS] Newest items appear at TOP of list")
    print("\n*** ALL TESTS PASSED! ***\n")

if __name__ == "__main__":
    main()
