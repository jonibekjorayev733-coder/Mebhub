#!/usr/bin/env python
"""Minimal test app to see where it fails"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("1. Importing FastAPI...")
from fastapi import FastAPI

print("2. Creating app...")
app = FastAPI()

print("3. Adding route...")
@app.get("/")
def root():
    return {"ok": True}

print("4. Done!")

if __name__ == "__main__":
    print("\n✅ App created successfully")
    print("Starting uvicorn...")
    
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
