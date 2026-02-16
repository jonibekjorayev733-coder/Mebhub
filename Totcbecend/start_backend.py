#!/usr/bin/env python
"""Start backend server"""
import subprocess
import sys
import time
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Try to start the server
print("Starting backend server on 127.0.0.1:8000...")
print("=" * 50)

try:
    subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", 
         "--host", "127.0.0.1", "--port", "8000", 
         "--no-access-log"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    
    # Keep the script alive
    print("Server started. Keep this terminal open!")
    print("=" * 50)
    while True:
        time.sleep(1)
        
except KeyboardInterrupt:
    print("\nServer stopped.")
    sys.exit(0)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
