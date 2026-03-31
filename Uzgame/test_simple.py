#!/usr/bin/env python3
"""
Minimal test script - only uses requests library, no app imports
"""
import sys
import requests
import json
from datetime import datetime
import time

BASE_URL = "http://127.0.0.1:8000"

try:
    print("[TEST] Step 1: Testing if server is running...")
    health = requests.get(f"{BASE_URL}/docs", timeout=5)
    print(f"[TEST] Server status: {health.status_code}")
except Exception as e:
    print(f"[TEST] ERROR: Server not responding: {e}")
    sys.exit(1)

print("\n[TEST] Step 2: Logging in as admin...")
try:
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
        timeout=10
    )
    print(f"[TEST] Login status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print(f"[TEST] Login failed: {login_response.text}")
        sys.exit(1)
    
    auth_data = login_response.json()
    access_token = auth_data.get("access_token")
    print(f"[TEST] Got access token")
    
except Exception as e:
    print(f"[TEST] ERROR during login: {e}")
    sys.exit(1)

headers = {"Authorization": f"Bearer {access_token}"}

print("\n[TEST] Step 3: Getting current topics count...")
try:
    topics_response = requests.get(f"{BASE_URL}/admin/topics", headers=headers, timeout=10)
    topics_before = topics_response.json()
    print(f"[TEST] Topics BEFORE: {len(topics_before)}")
except Exception as e:
    print(f"[TEST] ERROR getting topics: {e}")
    sys.exit(1)

print("\n[TEST] Step 4: Creating a new topic...")
try:
    new_topic_name = f"TEST_TOPIC_{datetime.now().strftime('%H%M%S')}"
    payload = {
        "name": new_topic_name,
        "description": "Test topic for debugging",
        "order": 999
    }
    
    create_response = requests.post(
        f"{BASE_URL}/admin/topics",
        headers=headers,
        json=payload,
        timeout=10
    )
    print(f"[TEST] POST status: {create_response.status_code}")
    print(f"[TEST] POST response: {create_response.json()}")
    
    if create_response.status_code != 200:
        print(f"[TEST] Create failed!")
        sys.exit(1)
        
except Exception as e:
    print(f"[TEST] ERROR creating topic: {e}")
    sys.exit(1)

print("\n[TEST] Step 5: Verifying topic was saved...")
time.sleep(1)  # Wait a moment
try:
    topics_response = requests.get(f"{BASE_URL}/admin/topics", headers=headers, timeout=10)
    topics_after = topics_response.json()
    print(f"[TEST] Topics AFTER: {len(topics_after)}")
    
    found = any(t["name"] == new_topic_name for t in topics_after)
    
    if found:
        print(f"[TEST] ✓ SUCCESS - Topic WAS saved!")
    else:
        print(f"[TEST] ✗ FAILED - Topic was NOT saved!")
        print(f"[TEST] Expected: {new_topic_name}")
        print(f"[TEST] Got: {[t['name'] for t in topics_after[-5:]]}")  # Show last 5
        sys.exit(1)
        
except Exception as e:
    print(f"[TEST] ERROR verifying: {e}")
    sys.exit(1)
