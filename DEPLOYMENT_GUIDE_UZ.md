# BoardGame Platform - Deploy Qo'llanmasi

## 📋 Loyiha Tuzilishi

```
📦 BoardGame Platform (Asosiy Repository)
├── 📁 main shaxasi (Frontend - React + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── 📁 becendrot1 shaxasi (Backend - FastAPI)
    ├── backend/
    ├── alembic/
    └── requirements.txt
```

## 🚀 Deploy Variantlari

### Variant 1: LOKAL DEPLOY (Ishlab Chiqish)

#### Frontend Deploy (React + Vite)

```bash
# 1. Frontend repository'ni clone qiling
git clone https://github.com/ITdewjonibek/boardgame.git
cd boardgame
git checkout main

# 2. Dependencies o'rnatish
npm install

# 3. Production versiyasini yasash
npm run build

# 4. Development server'ni ishga tushirish
npm run dev
# http://localhost:5173 da ochiladi

# 5. Production build'ni preview qilish
npm run preview
```

#### Backend Deploy (FastAPI + Python)

```bash
# 1. Backend shaxasiga o'tish
git checkout becendrot1

# 2. Python virtual muhiti yaratish
python -m venv venv
venv\Scripts\activate  # Windows

# 3. Python dependencies o'rnatish
pip install -r requirements.txt

# 4. Database migrations'ni bajarish
python migrate.py

# 5. Boshlang'ich data'ni to'ldirish (ixtiyoriy)
python seed_all.py

# 6. Backend server'ni ishga tushirish
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# http://localhost:8000 da ochiladi
```

---

### Variant 2: CLOUD DEPLOY (Vercel + Render)

#### Frontend Vercel'da Deploy (React uchun optimal)

**Kerakli narsalar:**
- Vercel akkaunt (https://vercel.com)
- GitHub'ga bog'langan akkaunt

**Qadamlar:**

1. **Loyihani Vercel'ga import qiling:**
   - https://vercel.com/new ga kiring
   - "Import Git Repository" ni tanlang
   - `https://github.com/ITdewjonibek/boardgame` ni tanlang
   - "main" shaxasini tanlang

2. **Build Sozlamalari:**
   ```
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Environment Variablelari:**
   - `VITE_API_URL=https://backend-domeningiz.com` qo'ying

4. **Deploy qilish:**
   - "Deploy" ni bosing
   - Frontend `boardgame.vercel.app` da jonli bo'ladi

#### Backend Render'da Deploy (FastAPI uchun optimal)

**Kerakli narsalar:**
- Render akkaunt (https://render.com)
- PostgreSQL database

**Qadamlar:**

1. **Render'da yangi Web Service yaratish:**
   - https://dashboard.render.com/ ga kiring
   - "New +" → "Web Service" ni bosing
   - GitHub repository'ni bog'lang

2. **Sozlama:**
   ```
   Name: boardgame-backend
   Environment: Python 3.11
   Build Command: pip install -r requirements.txt && python migrate.py
   Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

3. **Environment Variablelari:**
   ```
   DATABASE_URL=postgresql://foydalanuvchi:parol@host:5432/boardgame
   SECRET_KEY=sizning-secret-key-siz
   CORS_ORIGINS=https://boardgame.vercel.app
   ```

4. **Deploy qilish:**
   - "Create Web Service" ni bosing
   - Backend `https://boardgame-backend.onrender.com` da jonli bo'ladi

---

### Variant 3: DOCKER DEPLOYMENT

**Docker Compose sozlamasi:**

Frontend Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Backend Dockerfile:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Docker Compose:
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://backend:8000

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://foydalanuvchi:parol@db:5432/boardgame
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: foydalanuvchi
      POSTGRES_PASSWORD: parol
      POSTGRES_DB: boardgame
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Docker'da deploy qilish:**
```bash
docker-compose up -d
```

---

## 📊 Deploy Ro'yxati

- [ ] Frontend muvaffaqiyatli yasaldi (`npm run build`)
- [ ] Backend lokal ishlamoqda (`python -m uvicorn ...`)
- [ ] Database migrations bajarildi
- [ ] Environment variablelari sozlandi
- [ ] CORS sozlamalari to'g'ri
- [ ] API endpoints'lar test qilindi
- [ ] Frontend-Backend aloqa ishlayapti

## 🔗 Repository Havolalari

- **Asosiy Repository:** https://github.com/ITdewjonibek/boardgame
- **Frontend Shaxasi:** main
- **Backend Shaxasi:** becendrot1

## 📝 Environment Variablelari

### Backend (.env)
```
DATABASE_URL=postgresql://foydalanuvchi:parol@localhost:5432/boardgame
SECRET_KEY=sizning-secret-key-siz
ALGORITHM=HS256
CORS_ORIGINS=["http://localhost:5173", "https://domeningiz.com"]
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 🆘 Muammolarni Hal Qilish

**Frontend ishlamaydi:**
- node_modules'ni tozalash: `npm install`
- Port tekshirish: `netstat -ano | findstr :5173`
- Dependencies'ni yangilash: `npm update`

**Backend aloqasi kesilgan:**
- Backend ishlab turishini tekshirish
- CORS_ORIGINS'ni verify qilish
- Frontend env'da API_URL'ni tekshirish

**Database xatoligi:**
- Migrations'ni bajarish: `python migrate.py`
- PostgreSQL ishlab turishini tekshirish
- DATABASE_URL'ni verify qilish

---

## 🎉 Tayyor!

Deploy'dan keyin barcha xususiyatlarni test qiling:
1. Login/Register
2. O'yinlarni o'ynash
3. Ball'larni tekshirish
4. Leaderboards

**Frontend URL:** https://vercel-app-siz.vercel.app
**Backend URL:** https://render-app-siz.onrender.com
