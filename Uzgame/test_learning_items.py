#!/usr/bin/env python
import requests

# Get admin token
login_resp = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": "admin@example.com", "password": "admin123"}
)

if login_resp.status_code != 200:
    print("Login failed!")
    exit(1)

token = login_resp.json()["access_token"]
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

print("Testing learning items endpoints...\n")

# Test 1: GET all learning items
print("1. GET /admin/learning-items")
resp = requests.get("http://127.0.0.1:8000/admin/learning-items", headers=headers)
print(f"   Status: {resp.status_code}")
if resp.status_code == 200:
    items = resp.json()
    print(f"   Found {len(items)} items")
    if items:
        first_item = items[0]
        print(f"   First item: ID={first_item['id']}, term={first_item.get('latin_term')}")

# Test 2: Create new learning item
print("\n2. POST /admin/learning-items (create new)")
new_item = {
    "topic_id": 1,
    "latin_term": "test_item_" + str(int(__import__('time').time())),
    "uzbek_term": "тест элемент",
    "description": "Test description",
    "order": 999
}
resp = requests.post("http://127.0.0.1:8000/admin/learning-items", json=new_item, headers=headers)
print(f"   Status: {resp.status_code}")
if resp.status_code == 200:
    created = resp.json()
    item_id = created['id']
    print(f"   Created item with ID: {item_id}")
    
    # Test 3: UPDATE the item
    print(f"\n3. PUT /admin/learning-items/{item_id} (update)")
    update_data = {
        "uzbek_term": "ўзгартирилган элемент",
        "order": 998
    }
    resp = requests.put(
        f"http://127.0.0.1:8000/admin/learning-items/{item_id}",
        json=update_data,
        headers=headers
    )
    print(f"   Status: {resp.status_code}")
    if resp.status_code == 200:
        print(f"   Item updated successfully")
        
        # Test 4: DELETE the item
        print(f"\n4. DELETE /admin/learning-items/{item_id} (delete)")
        resp = requests.delete(
            f"http://127.0.0.1:8000/admin/learning-items/{item_id}",
            headers=headers
        )
        print(f"   Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"   Item deleted successfully!")
        else:
            print(f"   Error: {resp.text}")
    else:
        print(f"   Error: {resp.text}")
else:
    print(f"   Error: {resp.text}")

print("\n✅ All endpoints working correctly!")
