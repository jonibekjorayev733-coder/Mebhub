# 🎮 BoardGame Platform - Yakuniy Deploy Summary

## ✅ Qilindi

### 1. Repository Alohida Qilindi
- **Frontend (main branch):** React + TypeScript + Vite
- **Backend (becendrot1 branch):** FastAPI + Python + PostgreSQL
- **Repository:** https://github.com/ITdewjonibek/boardgame

### 2. Deploy Dokumentatsiyasi Yaratildi

#### 📖 Qo'llanmalar
- `DEPLOYMENT_GUIDE_EN.md` - English deployment guide
- `DEPLOYMENT_GUIDE_UZ.md` - Uzbek deployment guide

#### 🛠️ Setup Skriptlari
- `setup-frontend.sh` - Frontend setup (Linux/macOS)
- `setup-frontend.bat` - Frontend setup (Windows)
- `setup-backend.sh` - Backend setup (Linux/macOS)
- `setup-backend.bat` - Backend setup (Windows)

---

## 🚀 Deploy Variantlari

### VARIANT 1: LOKAL (Eng tez)

#### Windows'da Frontend:
```powershell
git clone https://github.com/ITdewjonibek/boardgame.git
cd boardgame
git checkout main
npm install
npm run dev
# http://localhost:5173
```

#### Windows'da Backend:
```powershell
git clone https://github.com/ITdewjonibek/boardgame.git
cd boardgame
git checkout becendrot1
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python migrate.py
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# http://localhost:8000
```

---

### VARIANT 2: CLOUD - VERCEL + RENDER (Bepul)

#### Frontend Vercel'da:
1. https://vercel.com/new ga kiring
2. GitHub repository'ni import qiling
3. Build settings:
   - Framework: Vite
   - Build Command: `npm run build`
4. Deploy qiling
5. URL: `your-app.vercel.app`

#### Backend Render'da:
1. https://render.com ga kiring
2. "New Web Service" yaratish
3. GitHub bog'lash
4. Sozlamalar:
   - Environment: Python 3.11
   - Build: `pip install -r requirements.txt && python migrate.py`
   - Start: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. Environment variables qo'ying
6. Deploy qiling
7. URL: `your-backend.onrender.com`

---

### VARIANT 3: DOCKER (Professional)

```bash
docker-compose up -d
```

---

## 🔌 Frontend-Backend Integration

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000  # lokal
# yoki
VITE_API_URL=https://your-backend.onrender.com  # cloud
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/boardgame
CORS_ORIGINS=["http://localhost:5173", "https://your-app.vercel.app"]
```

---

## 📊 Repository Tuzilishi

```
boardgame (Main Repository)
├── main branch (Frontend)
│   ├── src/
│   │   ├── pages/
│   │   │   └── games/ (45+ o'yinlar)
│   │   ├── components/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── DEPLOYMENT_GUIDE_UZ.md
│
└── becendrot1 branch (Backend)
    ├── backend/
    │   ├── app/
    │   ├── alembic/
    │   ├── main.py
    │   └── requirements.txt
    └── database.rules.json
```

---

## 📝 Kerakli Fayllar

### Frontend uchun:
- `package.json` ✅
- `vite.config.ts` ✅
- `.env` (VITE_API_URL)

### Backend uchun:
- `requirements.txt` ✅
- `.env` (DATABASE_URL, SECRET_KEY, CORS_ORIGINS)
- PostgreSQL database

---

## 🎯 Deployment Checklist

### Lokal Deploy uchun:
- [ ] Git o'rnatildi
- [ ] Node.js o'rnatildi (frontend)
- [ ] Python 3.11+ o'rnatildi (backend)
- [ ] Frontend dependencies o'rnatildi (`npm install`)
- [ ] Backend dependencies o'rnatildi (`pip install -r requirements.txt`)
- [ ] Database migrations bajarildi (`python migrate.py`)
- [ ] .env fayllar yaratildi
- [ ] Frontend ishlamoqda (npm run dev)
- [ ] Backend ishlamoqda (uvicorn)

### Cloud Deploy uchun (Vercel + Render):
- [ ] Vercel akkaunt yaratildi
- [ ] Render akkaunt yaratildi
- [ ] GitHub repository bog'landi
- [ ] Frontend Vercel'da deploy qilindi
- [ ] Backend Render'da deploy qilindi
- [ ] Environment variables sozlandi
- [ ] API endpoints test qilindi

---

## 🧪 Test Qilish

### Frontend test:
```bash
npm run test
npm run test:watch
```

### Backend test:
```bash
pytest backend/
```

---

## 📞 Qo'shimcha Komandalar

### Frontend:
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Build preview
npm run lint       # Linting
npm run test       # Tests
```

### Backend:
```bash
python migrate.py          # Database migrations
python seed_all.py         # Seed data
python -m uvicorn app.main:app --reload  # Dev server
```

---

## 🔒 Security Tips

1. **Environment Variables:**
   - `.env` faylni `.gitignore`'ga qo'ying
   - Production uchun kuchli SECRET_KEY ishlating
   - Database parolini o'zgartiring

2. **CORS:**
   - Frontend domain'ni CORS_ORIGINS'ga qo'ying
   - Localhost'da `*` ishlatmasdan keyin

3. **Database:**
   - PostgreSQL server'ini secure qiling
   - Regular backups qiling
   - Connection pooling ishlating

---

## 🚨 Muammolar va Yechimlar

| Muammo | Yechim |
|--------|--------|
| Port allaqachon ishlatilmoqda | Boshqa port ishlating: `--port 8001` |
| Database connection xato | DATABASE_URL'ni verify qiling |
| CORS xato | CORS_ORIGINS'ni tekshiring |
| Build xato | `npm install` yoki `pip install` qaytaring |

---

## 📈 Keyingi Qadamlar

1. **Domain**
   - Custom domain qo'ying (vercel.com / render.com)
   - SSL sertifikat o'rnatish

2. **Monitoring**
   - Uptime monitoring qo'ying
   - Error tracking (Sentry)
   - Analytics qo'ying

3. **CI/CD**
   - GitHub Actions setup
   - Automatic deployments
   - Testing pipeline

4. **Backup**
   - Database backups
   - Code backups
   - Version control

---

## 🎉 Tayyor!

**Repository:** https://github.com/ITdewjonibek/boardgame

**Branches:**
- `main` - Frontend (React)
- `becendrot1` - Backend (FastAPI)

**Quick Links:**
- 📖 [Deployment Guide EN](./DEPLOYMENT_GUIDE_EN.md)
- 📖 [Deployment Guide UZ](./DEPLOYMENT_GUIDE_UZ.md)
- 🛠️ [Setup Scripts](./setup-*.sh / .bat)

---

**Savol bor? Support: GitHub Issues yoki Email**

*Deploy qilgan odam: AI Copilot*
*Sana: 2026-03-14*
