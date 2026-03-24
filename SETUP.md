# 🎯 O'z Game Platform - Boshlang'ich Setup

## 1️⃣ Frontend O'rnatish

```bash
# Asosiy papkada
npm install
npm run dev
```

Bosh sahifa: `http://localhost:5173`

## 2️⃣ Backend O'rnatish

```bash
# Uzgame papkaga o'ting
cd Uzgame

# Virtual environment yarating
python -m venv .venv

# Virtual environment'ni faollashtiring
# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

# Paketlarni o'rnatish
pip install -r requirements.txt

# Server ishga tushirish
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API: `http://localhost:8000`
Swagger docs: `http://localhost:8000/docs`

## 3️⃣ Bazani O'rnatish

```bash
cd Uzgame

# Migratsiyalarni ishga tushirish (agar mavjud bo'lsa)
alembic upgrade head

# Bazani seed qilish (ixtiyoriy)
python seed_all.py
```

## 📋 Tekshirish

- Frontend: `npm run build` va `npm run preview`
- Backend: `http://localhost:8000/docs` API docs
- Typing: `npm run lint`

## 🔗 Muhim Linklar

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

## 📝 Muhim Fayllar

- `src/App.tsx` - Main routing
- `src/lib/api.ts` - Backend API calls
- `Uzgame/app/main.py` - Backend main app
- `package.json` - Frontend dependencies
- `Uzgame/requirements.txt` - Backend dependencies

---

**Tayyor! Now you can start developing. Ximoy vot! 🚀**
