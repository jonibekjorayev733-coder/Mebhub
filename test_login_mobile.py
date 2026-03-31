import requests
import json

# Test login endpoint
url = "http://127.0.0.1:8000/auth/login"
data = {
    "email": "demo@example.com",
    "password": "demo123"
}

print("Testing login endpoint...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data)}")

try:
    response = requests.post(url, json=data, timeout=5)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ LOGIN SUCCESSFUL")
        token = response.json().get('access_token')
        print(f"Token: {token[:20]}..." if token else "No token")
    else:
        print(f"\n❌ LOGIN FAILED: {response.status_code}")
        
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
