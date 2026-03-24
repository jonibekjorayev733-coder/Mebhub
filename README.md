# UzGame - O'zbekcha Interaktiv Ta'lim Platformasi

Tasodifiy o'yinlari orqali o'quvchilar bilimlarini sinab ko'rishish uchun modern web platformasi.

## 🚀 Texnologiyalar

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, SQLite
- **Authentication:** JWT + bcrypt

## 📦 Loyiha Struktura

```
├── src/                    # React Frontend
│   ├── components/         # UI Components
│   ├── pages/              # Page Components
│   ├── contexts/           # Auth Context
│   ├── hooks/              # Custom Hooks
│   ├── lib/                # Utilities
│   └── App.tsx             # Main App
├── backend/                # FastAPI Server
│   ├── routers/            # API Routes
│   ├── models.py           # Database Models
│   ├── auth.py             # Authentication
│   └── main.py             # FastAPI App
├── public/                 # Static Files
└── package.json            # Dependencies
```

## ⚡ Tezkor Boshlash

### Frontend Setup
```bash
npm install
npm run dev
```
Oyna: http://localhost:5173

### Backend Setup
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
API: http://localhost:8000

## 🎮 O'yinlar

- **Baraban** - Ehtimollik o'yini
- **Millionaire** - Savol-javob o'yini
- **Word Search** - So'z izlash
- **Hidden Hourglass** - Vaqt o'yini
- **Davlatni Topish** - Geografiya
- **Shumod Oyini** - Matematika
- **Temur's Conquest** - Tarixiy o'yin

## 👨‍🏫 O'qituvchi Paneli

- Register/Login
- Test yaratish
- Natijalari ko'rish
- Parolini o'zgartirish

## 🔐 Test Userlari

| Email | Parol | Role |
|-------|-------|------|
| admin@example.com | admin123 | Teacher |
| test@example.com | test123 | Teacher |

## 🔗 Links

- GitHub: https://github.com/jonibekjorayev733-coder/gamesite
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

## 📝 Lisenziya

MIT
