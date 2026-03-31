#!/usr/bin/env python
import sys
import requests
import json

# Test login
email = "admin@example.com"
password = "admin123"

print(f"Testing login with email: {email}, password: {password}")

response = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": email, "password": password}
)

print(f"Response status: {response.status_code}")
print(f"Response body: {response.text}")

if response.status_code == 200:
    data = response.json()
    token = data.get("access_token")
    print(f"\n✓ Token received: {token[:50]}...")
    
    # Test admin endpoint with token
    print(f"\nTesting /admin/users endpoint with token...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    users_response = requests.get(
        "http://127.0.0.1:8000/admin/users",
        headers=headers
    )
    
    print(f"Users endpoint status: {users_response.status_code}")
    if users_response.status_code == 200:
        users = users_response.json()
        print(f"✓ Got {len(users)} users")
    else:
        print(f"✗ Error: {users_response.text}")
else:
    print(f"✗ Login failed")
