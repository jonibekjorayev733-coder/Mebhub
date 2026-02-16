#!/usr/bin/env python
"""Backend launcher using subprocess"""
import subprocess
import sys
import time

def run_server():
    """Run backend server in subprocess"""
    print("\n" + "="*60)
    print("🚀 Backend Server Launcher")
    print("="*60)
    print("📍 http://127.0.0.1:8000")
    print("📊 http://127.0.0.1:8000/docs")
    print("="*60)
    print("⏳ Starting server...\n")
    
    # Create subprocess
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", 
         "--host", "127.0.0.1", 
         "--port", "8000",
         "--log-level", "warning",
         "--no-access-log"],
        cwd=".",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    
    print("✅ Server is running!")
    print("=" * 60 + "\n")
    
    # Keep the process alive
    try:
        while proc.poll() is None:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n⚠️ Shutting down...")
        proc.terminate()
        proc.wait(timeout=5)
        print("✅ Server stopped")

if __name__ == "__main__":
    try:
        run_server()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
