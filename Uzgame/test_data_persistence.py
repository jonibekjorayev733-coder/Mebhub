#!/usr/bin/env python3
"""
Test script to verify data persistence to database
"""

import requests
import json
from datetime import datetime

# Server URL
BASE_URL = "http://127.0.0.1:8000"

try:
    # Login first to get token
    print("=" * 60)
    print("STEP 1: Logging in as admin...")
    print("=" * 60)

    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
        timeout=5
    )

    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")
        exit(1)

    token = login_response.json().get("access_token")
    print(f"✓ Login successful!")
    print(f"Token: {token[:50]}...")

    headers = {"Authorization": f"Bearer {token}"}

    # Test 1: Create a topic
    print("\n" + "=" * 60)
    print("STEP 2: Creating a new topic...")
    print("=" * 60)

    topic_name = f"Test Topic {datetime.now().strftime('%H:%M:%S')}"
    topic_data = {
        "name": topic_name,
        "description": "Test description for persistence",
        "order": 999
    }

    print(f"Sending: {json.dumps(topic_data, indent=2)}")
    response = requests.post(
        f"{BASE_URL}/admin/topics",
        json=topic_data,
        headers=headers,
        timeout=5
    )

    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code != 200:
        print(f"❌ Topic creation failed")
        exit(1)

    created_topic = response.json()
    topic_id = created_topic.get("id")
    print(f"✓ Topic created with ID: {topic_id}")

    # Test 2: Verify the topic was saved by fetching all topics
    print("\n" + "=" * 60)
    print("STEP 3: Fetching all topics to verify persistence...")
    print("=" * 60)

    response = requests.get(
        f"{BASE_URL}/admin/topics",
        headers=headers,
        timeout=5
    )

    print(f"Status: {response.status_code}")
    topics = response.json()
    print(f"Total topics: {len(topics)}")

    # Find our created topic
    found = False
    for topic in topics:
        if topic.get("name") == topic_name:
            print(f"✓ FOUND: {topic['name']} (ID: {topic['id']})")
            found = True
            break

    if not found:
        print(f"❌ ERROR: Created topic NOT found in database!")
        print("Topics in database:")
        for topic in topics:
            print(f"  - {topic['name']}")
    else:
        print("✓ Data persistence verified!")

    # Test 3: Create a learning item
    print("\n" + "=" * 60)
    print("STEP 4: Creating a learning item...")
    print("=" * 60)

    item_name = f"Test Item {datetime.now().strftime('%H:%M:%S')}"
    item_data = {
        "topic_id": topic_id,
        "latin_term": item_name,
        "uzbek_term": "Тест сўзи",
        "description": "Test item for persistence",
        "order": 999
    }

    print(f"Sending: {json.dumps(item_data, indent=2)}")
    response = requests.post(
        f"{BASE_URL}/admin/learning-items",
        json=item_data,
        headers=headers,
        timeout=5
    )

    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code != 200:
        print(f"❌ Item creation failed")
        exit(1)

    created_item = response.json()
    item_id = created_item.get("id")
    print(f"✓ Item created with ID: {item_id}")

    # Test 4: Verify the item was saved
    print("\n" + "=" * 60)
    print("STEP 5: Fetching all items to verify persistence...")
    print("=" * 60)

    response = requests.get(
        f"{BASE_URL}/admin/learning-items",
        headers=headers,
        timeout=5
    )

    print(f"Status: {response.status_code}")
    items = response.json()
    print(f"Total items: {len(items)}")

    found = False
    for item in items:
        if item.get("id") == item_id:
            print(f"✓ FOUND: {item['latin_term']} (ID: {item['id']})")
            found = True
            break

    if not found:
        print(f"❌ ERROR: Created item NOT found in database!")
    else:
        print("✓ Data persistence verified!")

    print("\n" + "=" * 60)
    print("✓ TEST COMPLETE - ALL CHECKS PASSED!")
    print("=" * 60)

except requests.exceptions.ConnectionError as e:
    print(f"❌ Connection Error: {e}")
    print("Is the server running on http://127.0.0.1:8000?")
    exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
