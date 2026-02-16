#!/usr/bin/env python
"""
Persistent backend server runner
Works around Windows shutdown signal issues
"""
import subprocess
import sys
import time
import os

def start_server():
    """Start the FastAPI server in a subprocess"""
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8000",
    ]
    
    print("=" * 60)
    print("🚀 PAYMENT SYSTEM - BACKEND SERVER")
    print("=" * 60)
    print(f"📍 URL: http://127.0.0.1:8000")
    print(f"📚 API Docs: http://127.0.0.1:8000/docs")
    print(f"🎓 OpenAPI: http://127.0.0.1:8000/openapi.json")
    print("=" * 60)
    print("Press Ctrl+C to stop the server\n")
    
    try:
        # Use subprocess to run uvicorn
        # This avoids signal handling issues on Windows
        process = subprocess.Popen(cmd, cwd=os.path.dirname(os.path.abspath(__file__)))
        process.wait()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    start_server()
