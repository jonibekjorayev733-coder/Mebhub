#!/usr/bin/env python
import requests
import time

print("Waiting for server...")
time.sleep(3)

print("\n=== Testing Fresh Login ===")
try:
    # Test fresh login WITHOUT any old token
    response = requests.post('http://127.0.0.1:8000/auth/login', json={
        'email': 'demo@example.com',
        'password': 'demo123'
    }, timeout=10)
    
    print(f"Login Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('access_token')
        user = data.get('user')
        print(f"✅ LOGIN SUCCESS")
        print(f"  Token: {token[:50]}...")
        print(f"  User: {user.get('email')}")
        print(f"  Admin: {user.get('is_admin')}")
        
        # Now test admin endpoints with fresh token
        print(f"\n=== Testing Admin Endpoints ===")
        headers = {'Authorization': f'Bearer {token}'}
        
        endpoints = [
            ('/admin/topics', 'Topics'),
            ('/admin/users', 'Users'),
            ('/admin/stats', 'Stats'),
        ]
        
        for endpoint, name in endpoints:
            resp = requests.get(f'http://127.0.0.1:8000{endpoint}', headers=headers, timeout=5)
            print(f"{name}: {resp.status_code}", end="")
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list):
                    print(f" ✅ ({len(data)} items)")
                else:
                    print(f" ✅ {data}")
            else:
                print(f" ❌ {resp.text[:100]}")
                
    else:
        error_detail = response.json().get('detail', 'Unknown error')
        print(f"❌ LOGIN FAILED: {error_detail}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
