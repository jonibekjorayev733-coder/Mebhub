#!/usr/bin/env python
import requests

# Get token
print("Getting token...")
r1 = requests.post('http://127.0.0.1:8000/auth/login', 
    json={'email': 'demo@example.com', 'password': 'demo123'})
token = r1.json().get('access_token')
print(f"✓ Token obtained: {token[:40]}...")

# Test admin endpoint
print("\nTesting /admin/users...")
headers = {'Authorization': f'Bearer {token}'}
r2 = requests.get('http://127.0.0.1:8000/admin/users', headers=headers)
print(f"Status: {r2.status_code}")
if r2.status_code == 200:
    users = r2.json()
    print(f"✓ SUCCESS: Found {len(users)} users")
    for u in users[:2]:
        print(f"  - {u.get('email')} (admin: {u.get('is_admin')})")
else:
    print(f"Error: {r2.text}")

# Test admin/topics
print("\nTesting /admin/topics...")
r3 = requests.get('http://127.0.0.1:8000/admin/topics', headers=headers)
print(f"Status: {r3.status_code}")
if r3.status_code == 200:
    topics = r3.json()
    print(f"✓ SUCCESS: Found {len(topics)} topics")
    for t in topics[:2]:
        print(f"  - {t.get('name')}")
else:
    print(f"Error: {r3.text}")
