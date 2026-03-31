import subprocess
import time
import requests
import json
import sys

# Start the server in the background
print("[MAIN] Starting server...")
server_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"],
    cwd=r"c:\react Jonibek\vite-project\Uzgame",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Wait for server to start
print("[MAIN] Waiting for server to start...")
time.sleep(5)

BASE_URL = "http://127.0.0.1:8000"

try:
    # Step 1: Login
    print("\n[TEST] Step 1: Login as admin...")
    login_resp = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
        timeout=10
    )
    print(f"[TEST] Login status: {login_resp.status_code}")
    
    if login_resp.status_code != 200:
        print(f"[TEST] Login failed: {login_resp.text}")
        sys.exit(1)
    
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Get topics before
    print("\n[TEST] Step 2: Get topics BEFORE...")
    before_resp = requests.get(f"{BASE_URL}/admin/topics", headers=headers, timeout=10)
    topics_before = before_resp.json()
    print(f"[TEST] Topics count: {len(topics_before)}")
    
    # Step 3: Create topic
    print("\n[TEST] Step 3: Create new topic...")
    new_name = "TEST_TOPIC_PERSISTENCE"
    create_resp = requests.post(
        f"{BASE_URL}/admin/topics",
        headers=headers,
        json={"name": new_name, "description": "Test", "order": 999},
        timeout=10
    )
    print(f"[TEST] Create status: {create_resp.status_code}")
    print(f"[TEST] Response: {create_resp.json()}")
    
    # Step 4: Get topics after
    print("\n[TEST] Step 4: Get topics AFTER...")
    time.sleep(1)
    after_resp = requests.get(f"{BASE_URL}/admin/topics", headers=headers, timeout=10)
    topics_after = after_resp.json()
    print(f"[TEST] Topics count: {len(topics_after)}")
    
    # Check if found
    found = any(t["name"] == new_name for t in topics_after)
    if found:
        print(f"\n[TEST] ✓ SUCCESS - Topic was persisted!")
    else:
        print(f"\n[TEST] ✗ FAILED - Topic NOT persisted!")
        print(f"[TEST] Looking for: {new_name}")
        print(f"[TEST] Last topics: {[t['name'] for t in topics_after[-3:]]}")

finally:
    print("\n[MAIN] Stopping server...")
    server_proc.terminate()
    server_proc.wait()
