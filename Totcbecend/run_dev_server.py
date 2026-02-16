#!/usr/bin/env python
"""Production-ready server runner for development"""
import os
import sys
import subprocess

if __name__ == "__main__":
    # Use subprocess to run uvicorn in a way that Windows can handle properly
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host", "127.0.0.1",
        "--port", "8000",
        "--workers", "1"
    ]
    
    print("🚀 Starting FastAPI Backend Server")
    print("📍 URL: http://127.0.0.1:8000")
    print("📚 API Docs: http://127.0.0.1:8000/docs")
    print("\nPress Ctrl+C to stop\n")
    
    try:
        subprocess.run(cmd, cwd=os.path.dirname(__file__))
    except KeyboardInterrupt:
        print("\n✅ Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
