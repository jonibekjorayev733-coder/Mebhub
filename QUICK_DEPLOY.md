# 🚀 QUICK START - Deploy Havolalar

## 📦 Repository
```
https://github.com/ITdewjonibek/boardgame
```

## 🔀 Branches
- **main** → Frontend (React + Vite)
- **becendrot1** → Backend (FastAPI + Python)

---

## ⚡ 30 SEKUNDLI LOKAL START

### Windows - Frontend
```powershell
git clone https://github.com/ITdewjonibek/boardgame.git
cd boardgame
npm install && npm run dev
```
👉 **http://localhost:5173**

### Windows - Backend
```powershell
git clone https://github.com/ITdewjonibek/boardgame.git
cd boardgame
git checkout becendrot1
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
👉 **http://localhost:8000**

---

## ☁️ CLOUD DEPLOY (BEPUL)

### Frontend → Vercel
1. https://vercel.com/new
2. Import `https://github.com/ITdewjonibek/boardgame`
3. Framework: **Vite**
4. Deploy ✅

### Backend → Render
1. https://render.com
2. New Web Service
3. Python 3.11
4. Build: `pip install -r requirements.txt && python migrate.py`
5. Start: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
6. Deploy ✅

---

## 📝 Environment Variables

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
# yoki Cloud'da:
VITE_API_URL=https://your-backend.onrender.com
```

### Backend `.env`
```
DATABASE_URL=postgresql://user:password@localhost:5432/boardgame
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=["http://localhost:5173", "https://yourdomain.com"]
```

---

## 📚 Full Guides
- 📖 [English Guide](./DEPLOYMENT_GUIDE_EN.md)
- 📖 [Uzbek Guide](./DEPLOYMENT_GUIDE_UZ.md)
- 📋 [Deploy Summary](./DEPLOY_SUMMARY_UZ.md)

---

## 🛠️ Setup Scripts (Auto)
```bash
# Windows
setup-frontend.bat
setup-backend.bat

# Linux/macOS
bash setup-frontend.sh
bash setup-backend.sh
```

---

## ✅ Checklist

- [ ] Git o'rnatildi
- [ ] Node.js/npm o'rnatildi
- [ ] Python 3.11+ o'rnatildi
- [ ] Frontend clone qilindi
- [ ] Backend clone qilindi
- [ ] Dependencies o'rnatildi
- [ ] .env fayllar yaratildi
- [ ] Frontend ishlamoqda
- [ ] Backend ishlamoqda

---

## 📞 Komandalar

```bash
# Frontend
npm run dev      # http://localhost:5173
npm run build    # Production yasash
npm run test     # Tests

# Backend
python migrate.py     # Database setup
python seed_all.py    # Data seed
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

**🎉 Tayyor! Happy coding!**
