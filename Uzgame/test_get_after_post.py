import subprocess
import time
import requests
import sys

# Start the server
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
    # Login
    print("\n[TEST] Logging in...")
    login_resp = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
        timeout=10
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create topic
    print("\n[TEST] Creating topic TEST_PERSISTENCE_2...")
    create_resp = requests.post(
        f"{BASE_URL}/admin/topics",
        headers=headers,
        json={"name": "TEST_PERSISTENCE_2", "description": "Test 2", "order": 999},
        timeout=10
    )
    print(f"[TEST] Created topic with ID: {create_resp.json()['id']}")
    
    # GET all topics immediately
    print("\n[TEST] Getting all topics immediately...")
    time.sleep(1)
    get_resp = requests.get(f"{BASE_URL}/admin/topics", headers=headers, timeout=10)
    all_topics = get_resp.json()
    print(f"[TEST] Total topics: {len(all_topics)}")
    
    # Check if our topic is in there
    found = any(t["name"] == "TEST_PERSISTENCE_2" for t in all_topics)
    if found:
        print(f"✓ SUCCESS - Topic found in GET response!")
    else:
        print(f"✗ FAILED - Topic NOT in GET response!")
        print(f"Topics: {[t['name'] for t in all_topics]}")

finally:
    print("\n[MAIN] Stopping server...")
    server_proc.terminate()
    server_proc.wait()
