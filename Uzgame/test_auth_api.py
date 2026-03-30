import requests
import json

BASE_URL = "http://localhost:8000"

# Test register
print("=" * 50)
print("TEST 1: Register yangi foydalanuvchi")
print("=" * 50)

register_data = {
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
}

response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

# Test login
print("\n" + "=" * 50)
print("TEST 2: Login qilish")
print("=" * 50)

login_data = {
    "email": "test@example.com",
    "password": "password123"
}

response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if response.status_code == 200:
    token = response.json()["access_token"]
    
    # Test get current user
    print("\n" + "=" * 50)
    print("TEST 3: Hozirgi userni olish")
    print("=" * 50)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

# Test health check
print("\n" + "=" * 50)
print("TEST 4: Health check")
print("=" * 50)

response = requests.get(f"{BASE_URL}/health")
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

print("\n" + "=" * 50)
print("Barcha testlar tugadi!")
print("=" * 50)
