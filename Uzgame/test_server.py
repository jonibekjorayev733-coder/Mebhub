import subprocess
import time
import requests
import sys
import json

# Start server
print("Starting server...")
proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

time.sleep(3)
print(f"Server started, PID: {proc.pid}")

# Test login with demo user
print("\n1. Testing login with demo user...")
try:
    resp = requests.post(
        "http://127.0.0.1:8000/auth/login",
        json={"email": "demo@example.com", "password": "demo123"},
        timeout=2
    )
    print(f"Login response: {resp.status_code}")
    
    if resp.status_code == 200:
        token = resp.json()["access_token"]
        print(f"✅ Token received: {token[:40]}...")
        
        # Test admin endpoint with token
        print("\n2. Testing /admin/topics with token...")
        resp = requests.get(
            "http://127.0.0.1:8000/admin/topics",
            headers={"Authorization": f"Bearer {token}"},
            timeout=2
        )
        print(f"Admin topics response: {resp.status_code}")
        if resp.status_code != 200:
            print(f"Error: {resp.json()}")
        else:
            topics = resp.json()
            print(f"✅ Got {len(topics)} topics")
    else:
        print(f"❌ Login failed: {resp.json()}")
except Exception as e:
    print(f"❌ Request failed: {e}")

print("\nTerminating server...")
proc.terminate()
try:
    proc.wait(timeout=3)
except:
    proc.kill()

print("Done")

