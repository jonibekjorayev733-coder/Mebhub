#!/usr/bin/env python
"""Run FastAPI backend - Windows compatible version"""
import sys
import os
import signal
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Prevent script from terminating immediately
_keep_running = True

def signal_handler(sig, frame):
    """Handle signals"""
    global _keep_running
    _keep_running = False
    print("\n⚠️ Received interrupt signal")

if __name__ == "__main__":
    try:
        print("\n🚀 Backend Server Starting...")
        print("=" * 60)
        
        # Import app
        from app.main import app
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, signal_handler)
        if hasattr(signal, 'SIGTERM'):
            signal.signal(signal.SIGTERM, signal_handler)
        
        import uvicorn
        print("📍 Server: http://127.0.0.1:8000")
        print("📊 Docs: http://127.0.0.1:8000/docs")
        print("=" * 60)
        print("✅ Server is running. Keep terminal open!")
        print("=" * 60 + "\n")
        
        # Run uvicorn
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8000,
            log_level="warning",
            access_log=False,
        )
        
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Critical Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
