# UzGame - O'zbekcha Interaktiv Ta'lim Platformasi

Tasodifiy o'yinlari orqali o'quvchilar bilimlarini sinab ko'rishish uchun platforma.

## Struktura

```
📦 vite-project/
├── 📁 src/              # Frontend React kod
├── 📁 backend/          # Backend FastAPI server
├── 📁 public/           # Statik fayllar
├── 📄 package.json      # Frontend dependencies
└── 📄 vite.config.ts    # Vite konfiguratsiya
```

## Frontend Setup

```bash
cd vite-project
npm install
npm run dev
```

Server: http://localhost:5173

## Backend Setup

```bash
cd vite-project/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Server: http://localhost:8000

## Features

- ✅ Multiple educational games
- ✅ Teacher authentication & test creation
- ✅ Student leaderboards
- ✅ Dark mode UI
- ✅ Responsive design

## License

MIT
