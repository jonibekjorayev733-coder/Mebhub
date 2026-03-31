#!/usr/bin/env python
import requests

# Get token
login_resp = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": "admin@example.com", "password": "admin123"}
)

if login_resp.status_code == 200:
    token = login_resp.json()["access_token"]
    print(f"✓ Got token: {token[:50]}...\n")
    
    # Test /auth/me endpoint
    print("Testing /auth/me endpoint...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    me_resp = requests.get(
        "http://127.0.0.1:8000/auth/me",
        headers=headers
    )
    
    print(f"Status: {me_resp.status_code}")
    print(f"Response: {me_resp.text}")
else:
    print(f"✗ Login failed: {login_resp.status_code}")
    print(f"Response: {login_resp.text}")
