import os
import uuid
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers.courses import router as courses_router
from .routers.payments import router as payments_router
from .database import Base, engine
from .routers.auth import router as auth_router, get_current_user
from .routers.ai import router as ai_router
from .routers.teacher import router as teacher_router
from .routers.students import router as students_router
from .ws_manager import manager as ws_manager
from fastapi import WebSocket, WebSocketDisconnect
from .models import User

# FastAPI app yaratish
app = FastAPI()

# Ovoz va fayl yuklash route'lari (birinchi qo'shiladi, 404 oldini olish uchun)
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
VOICE_DIR = os.path.join(UPLOADS_DIR, "voice")
FILES_DIR = os.path.join(UPLOADS_DIR, "files")
os.makedirs(VOICE_DIR, exist_ok=True)
os.makedirs(FILES_DIR, exist_ok=True)

# Ruxsat etilgan fayl kengaytmalari
ALLOWED_EXTENSIONS = {
    # Rasmlar
    "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp",
    # Video
    "mp4", "webm", "mov", "avi", "mkv",
    # Hujjatlar
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv",
    # Arxivlar
    "zip", "rar", "7z", "tar", "gz",
}

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


@app.get("/voice/check")
def voice_check():
    """Backend to'g'ri (Totcbecend) ishlayotganini tekshirish."""
    return {"voice_upload": "ok", "message": "Totcbecend backend ishlayapti"}


@app.post("/file/upload")
def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Har qanday faylni yuklash (rasm, video, hujjat va h.k.)."""
    # Fayl kengaytmasini tekshirish
    original_name = file.filename or "file"
    ext = original_name.rsplit(".", 1)[-1].lower() if "." in original_name else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Fayl turi ruxsat etilmagan: .{ext}")

    content = file.file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Fayl hajmi 50 MB dan oshmasligi kerak")

    os.makedirs(FILES_DIR, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(FILES_DIR, safe_name)
    with open(path, "wb") as f:
        f.write(content)

    return {
        "file_url": f"/uploads/files/{safe_name}",
        "file_name": original_name,
        "file_size": len(content),
        "content_type": file.content_type or "application/octet-stream",
    }


@app.post("/voice/upload/teacher")
def upload_voice_teacher(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Ovozli xabar faylini yuklash (o'qituvchi)."""
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can upload voice")
    os.makedirs(VOICE_DIR, exist_ok=True)
    ext = "webm" if (file.content_type and "webm" in (file.content_type or "")) else "webm"
    name = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(VOICE_DIR, name)
    content = file.file.read()
    with open(path, "wb") as f:
        f.write(content)
    return {"voice_url": f"/uploads/voice/{name}"}


@app.post("/voice/upload/student")
def upload_voice_student(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Ovozli xabar faylini yuklash (o'quvchi)."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can upload voice")
    os.makedirs(VOICE_DIR, exist_ok=True)
    ext = "webm" if (file.content_type and "webm" in (file.content_type or "")) else "webm"
    name = f"{uuid.uuid4().hex}.{ext}"
    path = os.path.join(VOICE_DIR, name)
    content = file.file.read()
    with open(path, "wb") as f:
        f.write(content)
    return {"voice_url": f"/uploads/voice/{name}"}


# CORS sozlamasi
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database jadvallarni yaratish
Base.metadata.create_all(bind=engine)

# WebSocket Endpoint (Moved up)
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    print(f"DEBUG: WebSocket connection attempt for user_id: {user_id}")
    try:
        await ws_manager.connect(websocket, user_id)
        print(f"DEBUG: WebSocket connected for user_id: {user_id}")
        while True:
            # Keep connection alive, though we mostly send from server to client
            data = await websocket.receive_text()
            print(f"DEBUG: WebSocket received data from {user_id}: {data}")
            # Handle incoming client messages if needed (e.g. ping)
            await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        print(f"DEBUG: WebSocket disconnected for user_id: {user_id}")
        ws_manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"DEBUG: WebSocket error for user_id: {user_id}: {e}")
        ws_manager.disconnect(websocket, user_id)

@app.get("/ws-test")
def ws_test():
    return {"status": "ok", "message": "Server is running"}

# Routerlarni qo'shish (API route'lar mountdan oldin bo'lishi kerak)
app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(payments_router)
app.include_router(ai_router)
app.include_router(teacher_router)
app.include_router(students_router)

# Ovoz fayllari uchun static papka (oxirida, faqat /uploads/* uchun)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.get("/")
def root():
    return {"ok": True}
