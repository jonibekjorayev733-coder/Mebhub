# 🚀 TEZKOR MA'LUMOT - Quick Start Guide

## ⚡ 30 Soniyada Boshlang'ich

### Frontend (React)
```bash
npm install              # Paketlar o'rnatish
npm run dev             # Server ishga tushirish
# 🌐 http://localhost:5173
```

### Backend (Python)
```bash
cd Uzgame
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# 🔌 http://localhost:8000
```

### Database
```bash
cd Uzgame
python seed_all.py      # Boshlang'ich data
```

---

## 📂 Muhim Papkalar

| Papka | Maqsadi |
|-------|---------|
| `src/` | React komponentlar |
| `src/pages/` | Sahifalar |
| `src/components/` | Reusable components |
| `Uzgame/app/` | Backend logika |
| `Uzgame/app/routers/` | API endpoints |
| `public/` | Statik fayllar |

---

## 🎮 O'yin Qo'shish (3 Qadamda)

### 1. Frontend Component
```tsx
// src/pages/games/MyGame.tsx
export default function MyGame() {
  return <div>Mening o'yinim</div>
}
```

### 2. Route Qo'shish
```tsx
// src/App.tsx
<Route path="/games/my-game" element={<MyGame />} />
```

### 3. Backend Endpoint
```python
# Uzgame/app/routers/games.py
@router.get("/api/games/my-game")
async def my_game():
    return {"game": "data"}
```

---

## 🔧 Asosiy Buyruqlar

```bash
# Frontend
npm run dev              # Development server
npm run build            # Production build
npm run lint             # Code check
npm run test             # Unit tests

# Backend
python -m uvicorn ...    # Server
alembic upgrade head     # Database migrations
python seed_all.py       # Seed data

# Deploy
npm run deploy           # Deploy to production
```

---

## 📍 Muhim URL'lar

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Swagger | http://localhost:8000/redoc |

---

## ✅ Yaxshi Amaliyotlar

- ✅ TypeScript ishlatish
- ✅ Komponentlarni modulli yozish
- ✅ API calls uchun `src/lib/api.ts`
- ✅ State management uchun Zustand/Context
- ✅ CSS uchun Tailwind + modules

---

## 🐛 Muammolar

### Frontend ishlamayotgan bo'lsa
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend ishlamayotgan bo'lsa
```bash
cd Uzgame
rm -rf .venv
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Database muammosi
```bash
cd Uzgame
python seed_all.py      # Qayta seed qilish
alembic upgrade head    # Migrations
```

---

## 📚 Ko'p Sof'tlar

| Fayl | Maqsadi |
|------|---------|
| `SETUP.md` | O'rnatish ko'llanmasi |
| `CLEANUP_SUMMARY.md` | O'chirilgan fayllar |
| `PROJECT_STRUCTURE.md` | Tuzilish |
| `PROJECT_ARCHITECTURE.md` | Arxitektura |

---

## 💡 Tips & Tricks

- `npm run build && npm run preview` - Production oldindan test qilish
- `python -m ipdb` - Python debugging
- `npm run test:watch` - Avtomatik test qayta ishlash
- `alembic revision --autogenerate` - Avtomatik migration

---

## 🎓 Keyingi Maqolalar

1. **Component Yaratish**: `src/components` da yangi component yozing
2. **API Call**: `src/lib/api.ts` da fetch qo'shing
3. **Route**: `src/App.tsx` da route qo'shing
4. **Backend Endpoint**: `Uzgame/app/routers/` da router yozing

---

## 🆘 Yordamga Muhtoj?

- 📖 `SETUP.md` o'qing
- 📖 `PROJECT_ARCHITECTURE.md` o'qing
- 🔍 `Uzgame/app/routers/` da misol qidiring
- 💬 Backend docs: http://localhost:8000/docs

---

**🎯 Status**: ✅ Tayyorr!
**📅 Sana**: 14-Mart, 2026
**⚡ Versiya**: 1.0 Fresh Start
