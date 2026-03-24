# 📋 Toza Loyiha Ichki Yapısı

## 📂 Asosiy Direktiva Tasnifi

```
vite-project/
│
├── 📁 Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          ← React komponentlar
│   │   │   └── ui/             ← UI library komponentlar
│   │   ├── pages/              ← Sahifa komponentlar
│   │   ├── contexts/           ← State management
│   │   ├── hooks/              ← Custom hooks
│   │   │   └── engines/        ← Game engine logic
│   │   ├── lib/                ← Utilities, API
│   │   ├── styles/             ← Global CSS
│   │   ├── types/              ← TypeScript definitions
│   │   └── assets/             ← Images, icons
│   ├── public/                 ← Static files
│   └── vite.config.ts
│
├── 📁 Backend (Python/FastAPI)
│   └── Uzgame/
│       ├── app/
│       │   ├── routers/         ← API endpoints
│       │   ├── models/          ← Database models
│       │   ├── schemas/         ← Request/Response schemas
│       │   ├── core/            ← Business logic
│       │   ├── auth/            ← Authentication
│       │   ├── seed/            ← Database seeding
│       │   ├── main.py          ← FastAPI app
│       │   └── database.py      ← DB connection
│       ├── alembic/             ← Database migrations
│       └── requirements.txt     ← Python packages
│
├── 🔧 Configuration
│   ├── package.json             ← Frontend deps
│   ├── tsconfig.json            ← TypeScript config
│   ├── vite.config.ts           ← Vite config
│   ├── tailwind.config.ts       ← Tailwind CSS
│   ├── firebase.json            ← Firebase config
│   └── .env                     ← Environment vars
│
└── 📚 Documentation
    ├── README.md                ← Main documentation
    ├── SETUP.md                 ← Setup guide
    ├── PROJECT_STRUCTURE.md     ← Structure info
    ├── CLEANUP_SUMMARY.md       ← What was cleaned
    └── ARCHITECTURE.md          ← Architecture details
```

---

## 🎯 Loyihaning Asosiy Qatlamlar

### Frontend Layer (React)
```
src/
├── App.tsx              # Main router va layout
├── main.tsx             # Entry point
├── components/          # Reusable components
├── pages/              # Page-level components
├── contexts/           # Global state
├── hooks/              # Custom logic
├── lib/                # Utilities va API calls
└── styles/             # Global CSS
```

### Backend Layer (FastAPI)
```
Uzgame/app/
├── main.py             # FastAPI initialization
├── database.py         # Database connection
├── routers/            # API endpoints
├── models/             # SQLAlchemy models
├── schemas/            # Pydantic schemas
├── core/               # Business logic
├── auth/               # Authentication
└── seed/               # Database seeding
```

### Data Layer (Database)
```
Uzgame/
├── alembic/            # Schema migrations
├── alembic.ini         # Migration config
└── .env                # DB credentials
```

---

## 🔌 API Integration

### Frontend → Backend
```typescript
// src/lib/api.ts
const API_URL = 'http://localhost:8000'

export const fetchGames = async () => {
  const res = await fetch(`${API_URL}/api/games`)
  return res.json()
}
```

### Backend API
```python
# Uzgame/app/routers/games.py
@router.get("/api/games")
async def get_games():
    return {"games": [...]}
```

---

## 📦 Dependencies

### Frontend (`package.json`)
- React 18+
- React Router
- Tailwind CSS
- ShadCN/UI
- Vite
- TypeScript

### Backend (`requirements.txt`)
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic (migrations)
- Python 3.9+

---

## 🚀 Development Flow

### 1. Start Frontend
```bash
npm install
npm run dev
# http://localhost:5173
```

### 2. Start Backend
```bash
cd Uzgame
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# http://localhost:8000
```

### 3. Database
```bash
cd Uzgame
alembic upgrade head  # Apply migrations
python seed_all.py    # Seed data
```

---

## 📝 Creating New Features

### New Game Feature

#### Frontend
1. Create: `src/pages/games/GameName.tsx`
2. Import in: `src/App.tsx`
3. Add route: `<Route path="/games/game-name" ... />`

#### Backend
1. Create router: `Uzgame/app/routers/games.py`
2. Add endpoint: `@router.get("/api/games/game-name")`
3. Add models if needed: `Uzgame/app/models/game.py`

#### Database
1. Create migration: `alembic revision --autogenerate`
2. Apply: `alembic upgrade head`

---

## 🔐 Environment Configuration

### `.env` (Root)
```
DATABASE_URL=sqlite:///./Uzgame/app.db
FIREBASE_API_KEY=...
JWT_SECRET=...
```

### `Uzgame/.env`
```
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=...
```

---

## ✅ Project Health Check

- [x] Frontend structure organized
- [x] Backend structure clean
- [x] No test files in src
- [x] No unnecessary databases
- [x] Documentation updated
- [x] Ready for development

---

## 🎓 Best Practices

### File Organization
- ✅ One component per file
- ✅ Related files grouped
- ✅ Clear naming conventions
- ✅ Type-safe with TypeScript

### Code Quality
- ✅ Linting with ESLint
- ✅ Type checking
- ✅ Modular architecture
- ✅ Reusable components

### Database
- ✅ Migrations tracked
- ✅ Models organized
- ✅ Schemas validated
- ✅ Seeds automated

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Dev Frontend | `npm run dev` |
| Dev Backend | `python -m uvicorn app.main:app --reload` |
| Build Frontend | `npm run build` |
| Run Tests | `npm run test` |
| Check Types | `npm run lint` |
| Seed DB | `python seed_all.py` |
| Migrate DB | `alembic upgrade head` |

---

**Status**: ✅ Ready for Development
**Last Updated**: 14-March-2026
**Version**: 1.0 - Fresh Clean Start
