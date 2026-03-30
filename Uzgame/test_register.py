#!/usr/bin/env python
"""
Register test qilish uchun script
Frontend dan request o'rniga bu script ishlat
"""
import requests
import json

BASE_URL = "http://localhost:8000"

# Register request
register_data = {
    "email": "sync.test@example.com",
    "password": "password123",
    "full_name": "Sync Test User"
}

print("📝 Registering new user...")
print(f"   Email: {register_data['email']}")
print(f"   Name: {register_data['full_name']}")

try:
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json=register_data
    )
    
    print(f"\n✅ Response status: {response.status_code}")
    print(f"   Response body: {response.json()}")
    
    if response.status_code == 200:
        print("\n✓ Registration successful!")
        print("   Check database now...")
    else:
        print(f"\n❌ Registration failed: {response.text}")
        
except requests.exceptions.ConnectionError as e:
    print(f"\n❌ ERROR: Cannot connect to backend at {BASE_URL}")
    print(f"   Make sure backend is running: python -m uvicorn app.main:app --reload --port 8000")
    print(f"   Error: {e}")
except Exception as e:
    print(f"\n❌ ERROR: {e}")
