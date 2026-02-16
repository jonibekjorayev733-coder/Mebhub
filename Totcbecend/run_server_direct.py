#!/usr/bin/env python
"""Direct ASGI server without Uvicorn's lifecycle issues"""
import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

print("=" * 70)
print("BACKEND SERVER - Payment System")
print("=" * 70)
print("URL: http://127.0.0.1:8000")
print("=" * 70)
print()

# Import the app
from app.main import app

if __name__ == "__main__":
    import uvicorn
    
    # Run with reload disabled and logging enabled
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )
