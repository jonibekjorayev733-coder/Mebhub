"""
Test POST endpoint to diagnose data persistence issue
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

# Admin credentials
admin_email = "admin@example.com"
admin_password = "admin123"

# Step 1: Login as admin
print("[TEST] Step 1: Logging in as admin...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": admin_email, "password": admin_password}
)
print(f"[TEST] Login status: {login_response.status_code}")
print(f"[TEST] Login response: {json.dumps(login_response.json(), indent=2)}")

if login_response.status_code != 200:
    print("[TEST] Login failed!")
    exit(1)

auth_data = login_response.json()
access_token = auth_data.get("access_token")
print(f"[TEST] Access token: {access_token[:20]}...")

# Step 2: Get current topics count
print("\n[TEST] Step 2: Getting current topics...")
headers = {"Authorization": f"Bearer {access_token}"}
topics_response = requests.get(
    f"{BASE_URL}/admin/topics",
    headers=headers
)
print(f"[TEST] GET /admin/topics status: {topics_response.status_code}")
topics_before = topics_response.json()
print(f"[TEST] Topics count BEFORE: {len(topics_before)}")

# Step 3: Create a new topic
print("\n[TEST] Step 3: Creating a new topic...")
new_topic_name = f"TEST_TOPIC_{datetime.now().strftime('%H%M%S')}"
create_payload = {
    "name": new_topic_name,
    "description": "This is a test topic created by test_post_endpoint.py",
    "order": 999
}
print(f"[TEST] Payload: {json.dumps(create_payload, indent=2)}")

create_response = requests.post(
    f"{BASE_URL}/admin/topics",
    headers=headers,
    json=create_payload
)
print(f"[TEST] POST /admin/topics status: {create_response.status_code}")
print(f"[TEST] POST response: {json.dumps(create_response.json(), indent=2)}")

if create_response.status_code != 200:
    print("[TEST] Create failed!")
    exit(1)

created_topic = create_response.json()
created_topic_id = created_topic.get("id")
print(f"[TEST] Created topic ID: {created_topic_id}")

# Step 4: Check if topic was saved by querying again
print("\n[TEST] Step 4: Verifying topic was saved...")
topics_after_response = requests.get(
    f"{BASE_URL}/admin/topics",
    headers=headers
)
print(f"[TEST] GET /admin/topics status: {topics_after_response.status_code}")
topics_after = topics_after_response.json()
print(f"[TEST] Topics count AFTER: {len(topics_after)}")

# Check if our new topic is in the list
found = False
for topic in topics_after:
    if topic["name"] == new_topic_name:
        print(f"[TEST] ✓ FOUND NEW TOPIC IN API RESPONSE: {topic}")
        found = True
        break

if found:
    print("[TEST] ✓ SUCCESS - Topic saved to database!")
else:
    print("[TEST] ✗ FAILURE - Topic NOT found in database!")
    print(f"[TEST] Expected to find: {new_topic_name}")
    print(f"[TEST] Topics in API: {[t['name'] for t in topics_after]}")
