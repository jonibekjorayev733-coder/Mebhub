# 🚀 O'z Game Platform - Yangi Loyiha Strukturasi

## 📁 Loyiha Tuzilishi

```
vite-project/
├── src/
│   ├── components/          # React komponentlar
│   │   └── ui/             # UI komponentlar (shadcn/ui)
│   ├── pages/              # Sahifalar
│   ├── contexts/           # Context API fayllar
│   ├── hooks/              # Custom React hooks
│   │   └── engines/        # Game engines
│   ├── lib/                # Utilities va API
│   ├── styles/             # Global CSS fayllar
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   ├── App.css             # App styles
│   └── vite-env.d.ts       # Vite environment types
├── Uzgame/                 # Backend (Python/FastAPI)
│   ├── app/               # FastAPI application
│   │   ├── routers/       # API routes
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── core/          # Core utilities
│   │   └── main.py        # FastAPI main
│   ├── alembic/           # Database migrations
│   ├── requirements.txt    # Python dependencies
│   ├── .env              # Environment variables
│   └── alembic.ini       # Alembic config
├── public/                 # Static assets
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
├── .env                   # Root environment variables
└── README.md              # Project documentation
```

## 🔧 O'rnatish

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd Uzgame
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📦 Asosiy Ko'rinishlari

- **components/**: Qayta ishlatiladigan React komponentlar
- **pages/**: Sahifa-darajadagi komponentlar (routing)
- **hooks/**: Custom React hooks va game engines
- **lib/**: API calls, state management, utilities
- **contexts/**: Global state (authentication, etc.)
- **styles/**: Global va module CSS fayllar
- **types/**: TypeScript type definitions

## 🎮 O'yin Qo'shish

Har bir yangi o'yin uchun:
1. `src/pages/games/` da yangi component yarating
2. `src/lib/api.ts` da API endpoints qo'shing
3. `src/App.tsx` da route qo'shing
4. Backend uchun `Uzgame/app/routers/` da router yarating

## 🚀 Deployment

Frontend: Vercel, Netlify, yoki statik hosting
Backend: Render, Railway, yoki boshqa Python hosting

---

**📅 Yaratilgan:** 14-Mart, 2026
**Versiya:** 1.0
