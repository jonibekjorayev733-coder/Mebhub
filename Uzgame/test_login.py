#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import sys
import time

time.sleep(2)

try:
    print("Testing login...")
    response = requests.post('http://127.0.0.1:8000/auth/login', json={
        'email': 'demo@example.com',
        'password': 'demo123'
    }, timeout=5)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('access_token')
        print(f"\nSUCCESS - Token: {token[:50] if token else 'None'}...")
        
        # Test admin endpoint
        print("\nTesting /admin/topics...")
        headers = {'Authorization': f'Bearer {token}'}
        admin_resp = requests.get('http://127.0.0.1:8000/admin/topics', headers=headers, timeout=5)
        print(f"Admin status: {admin_resp.status_code}")
        if admin_resp.status_code == 200:
            print(f"Topics: {len(admin_resp.json())} items")
        else:
            print(f"Admin response: {admin_resp.text}")
            
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
