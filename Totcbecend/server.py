#!/usr/bin/env python
"""Persistent backend server"""
import sys
import os
import atexit

# Setup path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def cleanup():
    """Cleanup on exit"""
    print("\n✅ Server stopped")

atexit.register(cleanup)

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 BACKEND SERVER - KEEP TERMINAL OPEN!")
    print("="*70)
    print("📍 Server URL: http://127.0.0.1:8000")
    print("📊 API Docs: http://127.0.0.1:8000/docs")
    print("=" * 70)
    print("✅ Starting...\n")
    
    try:
        import uvicorn
        from app.main import app
        
        # Configuration
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=8000,
            log_level="info",
        )
    except KeyboardInterrupt:
        print("\n\n⚠️ Keyboard interrupt received")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
