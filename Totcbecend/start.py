import asyncio
from app.main import app

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting server...")
    try:
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="debug")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
