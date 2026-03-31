import requests
import time

time.sleep(1)

# Get token
try:
    r = requests.post("http://127.0.0.1:8000/auth/login", json={"email": "admin@example.com", "password": "admin123"}, timeout=5)
    if r.status_code != 200:
        print(f"Login failed: {r.status_code}")
        exit(1)
    token = r.json()["access_token"]
    h = {"Authorization": f"Bearer {token}"}
    
    # Test endpoints
    print("Testing learning items endpoints:\n")
    
    # GET
    r = requests.get("http://127.0.0.1:8000/admin/learning-items", headers=h, timeout=5)
    print(f"GET /admin/learning-items: {r.status_code}")
    
    # POST
    r = requests.post("http://127.0.0.1:8000/admin/learning-items", json={"topic_id":1,"latin_term":"test","uzbek_term":"тест","order":999}, headers=h, timeout=5)
    print(f"POST /admin/learning-items: {r.status_code}")
    if r.status_code == 200:
        item_id = r.json()['id']
        
        # PUT
        r = requests.put(f"http://127.0.0.1:8000/admin/learning-items/{item_id}", json={"order":998}, headers=h, timeout=5)
        print(f"PUT /admin/learning-items/{item_id}: {r.status_code}")
        
        # DELETE
        r = requests.delete(f"http://127.0.0.1:8000/admin/learning-items/{item_id}", headers=h, timeout=5)
        print(f"DELETE /admin/learning-items/{item_id}: {r.status_code}")
        
        if r.status_code == 200:
            print("\n✅ All endpoints working!")
except Exception as e:
    print(f"Error: {e}")
