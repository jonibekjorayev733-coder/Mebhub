"""
Standalone test server - bypasses uvicorn lifecycle issues
"""
from app.main import app
from starlette.testclient import TestClient

if __name__ == "__main__":
    print("🔧 Testing FastAPI app with TestClient...")
    client = TestClient(app)
    
    # Test root endpoint
    print("\n1️⃣  Testing GET /")
    resp = client.get("/")
    print(f"   Status: {resp.status_code}")
    print(f"   Response: {resp.json()}")
    
    # Test courses endpoint
    print("\n2️⃣  Testing GET /courses")
    resp = client.get("/courses?skip=0&limit=2")
    print(f"   Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print(f"   Courses found: {len(data)}")
        for course in data[:2]:
            print(f"   - {course['title']} (${course['price']})")
    
    # Test course detail
    print("\n3️⃣  Testing GET /courses/1")
    resp = client.get("/courses/1")
    print(f"   Status: {resp.status_code}")
    if resp.status_code == 200:
        course = resp.json()
        print(f"   Course: {course['title']}")
        print(f"   Lessons: {len(course.get('lessons', []))}")
    
    # Test payment schema validation
    print("\n4️⃣  Testing payment validation")
    invalid_payment = {
        "course_id": 1,
        "card_number": "123",  # Too short
        "card_expiry": "12/25",
        "card_cvv": "123",
        "card_holder": "Test User"
    }
    resp = client.post("/payments/process", json=invalid_payment)
    print(f"   Status: {resp.status_code}")
    if resp.status_code != 200:
        print(f"   ✅ Correctly rejected invalid card: {resp.json()['detail']}")
    
    print("\n✅ All tests completed!")
