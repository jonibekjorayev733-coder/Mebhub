#!/usr/bin/env python
"""Use waitress WSGI server instead of Uvicorn"""
import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

print("*" * 70)
print("BACKEND - Payment System (Using Waitress)")
print("*" * 70)
print("URL: http://127.0.0.1:8000")
print("Docs: http://127.0.0.1:8000/docs")
print("*" * 70)
print()

try:
    from waitress import serve
    from app.main import app
    
    print("Starting Waitress server...")
    serve(app, host='127.0.0.1', port=8000, _quiet=False)
    
except ModuleNotFoundError:
    print("Waitress not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "waitress", "-q"])
    from waitress import serve
    from app.main import app
    serve(app, host='127.0.0.1', port=8000, _quiet=False)
