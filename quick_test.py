#!/usr/bin/env python3
import requests
import time

# Wait a moment for server
time.sleep(1)

url = "http://127.0.0.1:8000/auth/login"
data = {"email": "demo@example.com", "password": "demo123"}

try:
    print("Testing backend login...")
    r = requests.post(url, json=data, timeout=5)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        print("✅ LOGIN WORKS!")
        print(f"User: {r.json()['user']['full_name']}")
    else:
        print(f"❌ Error: {r.json().get('detail', 'Unknown error')}")
except Exception as e:
    print(f"❌ Exception: {e}")
