# BoardGame Platform - Deployment Guide

## 📋 Project Structure

```
📦 BoardGame Platform (Main Repository)
├── 📁 main branch (Frontend - React + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── 📁 becendrot1 branch (Backend - FastAPI)
    ├── backend/
    ├── alembic/
    └── requirements.txt
```

## 🚀 Deployment Options

### Option 1: LOCAL DEPLOYMENT (Development)

#### Frontend Deployment (React + Vite)

```bash
# 1. Clone frontend repository
git clone https://github.com/ITdewjonibek/boardgame.git
cd boardgame
git checkout main

# 2. Install dependencies
npm install

# 3. Build production version
npm run build

# 4. Run development server
npm run dev
# Opens on http://localhost:5173

# 5. Run production build preview
npm run preview
```

#### Backend Deployment (FastAPI + Python)

```bash
# 1. Switch to backend branch
git checkout becendrot1

# 2. Create Python virtual environment
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Run database migrations
python migrate.py

# 5. Seed initial data (optional)
python seed_all.py

# 6. Start backend server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# Opens on http://localhost:8000
```

---

### Option 2: CLOUD DEPLOYMENT (Vercel + Render/Railway)

#### Frontend on Vercel (Recommended for React)

**Prerequisites:**
- Vercel account (https://vercel.com)
- GitHub account connected to Vercel

**Steps:**

1. **Import Project to Vercel:**
   - Visit https://vercel.com/new
   - Select "Import Git Repository"
   - Choose `https://github.com/ITdewjonibek/boardgame`
   - Select "main" branch

2. **Configure Build Settings:**
   ```
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Environment Variables:**
   - Set `VITE_API_URL=https://your-backend-url.com` (backend domain)

4. **Deploy:**
   - Click "Deploy"
   - Frontend will be live at `boardgame.vercel.app`

#### Backend on Render (Recommended for FastAPI)

**Prerequisites:**
- Render account (https://render.com)
- PostgreSQL database (included with Render free tier)

**Steps:**

1. **Create New Web Service on Render:**
   - Visit https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configuration:**
   ```
   Name: boardgame-backend
   Environment: Python 3.11
   Build Command: pip install -r requirements.txt && python migrate.py
   Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

3. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/boardgame
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=https://boardgame.vercel.app
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Backend will be live at `https://boardgame-backend.onrender.com`

---

### Option 3: DOCKER DEPLOYMENT (Full Stack)

**Create Docker Compose Setup:**

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
      DATABASE_URL: postgresql://user:password@db:5432/boardgame
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: boardgame
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Deploy with Docker:**
```bash
docker-compose up -d
```

---

## 📊 Deployment Checklist

- [ ] Frontend built successfully (`npm run build`)
- [ ] Backend runs locally (`python -m uvicorn ...`)
- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] CORS settings configured
- [ ] API endpoints tested
- [ ] Frontend-Backend connection working

## 🔗 Repository Links

- **Main Repository:** https://github.com/ITdewjonibek/boardgame
- **Frontend Branch:** main
- **Backend Branch:** becendrot1

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/boardgame
SECRET_KEY=your-secret-key
ALGORITHM=HS256
CORS_ORIGINS=["http://localhost:5173", "https://yourdomain.com"]
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 🆘 Troubleshooting

**Frontend won't start:**
- Clear node_modules: `npm install`
- Check port: `netstat -ano | findstr :5173`
- Update dependencies: `npm update`

**Backend connection failed:**
- Check if backend is running
- Verify CORS_ORIGINS in backend
- Check API_URL in frontend env

**Database errors:**
- Run migrations: `python migrate.py`
- Check PostgreSQL is running
- Verify DATABASE_URL

---

## 🎉 Success!

After deployment, test all features:
1. Login/Register
2. Play games
3. Check scores
4. Leaderboards

**Frontend URL:** https://your-vercel-app.vercel.app
**Backend URL:** https://your-render-app.onrender.com
