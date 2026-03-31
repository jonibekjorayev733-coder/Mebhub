# Supabase + Vercel Deployment Guide

## Step 1: Create Supabase Account & Database

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details:
   - Name: `tibbiy-hub` (or your choice)
   - Password: (save securely)
   - Region: Choose closest to your users
4. Wait for database to be created (2-3 minutes)

## Step 2: Get Supabase Connection String

1. In Supabase dashboard, go to **Settings → Database**
2. Under "Connection string", select **URI**
3. Copy the string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.kdovuejwnqlkudwqqwwx.supabase.co:5432/postgres
   ```

## Step 3: Update .env with Supabase

In your `.env` file, replace the empty `SUPABASE_DATABASE_URL`:

```dotenv
SUPABASE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.kdovuejwnqlkudwqqwwx.supabase.co:5432/postgres
```

## Step 4: Export Current Data (Create Backup)

Run this from project root:

```powershell
cd "c:\react Jonibek\vite-project"
python migrate_to_supabase.py
```

This will:
- ✅ Backup all local data to `database_backup.json`
- ✅ Test connection to Supabase
- ✅ Show summary of all tables

## Step 5: Create Tables in Supabase

Run the migration (creates tables automatically):

```powershell
python -c "
from Uzgame.app.database import engine, Base
from Uzgame.app.models import *  # Import all models

# Create tables in Supabase
Base.metadata.create_all(bind=engine)
print('✅ Tables created in Supabase')
"
```

## Step 6: Import Data to Supabase

Use Supabase's built-in import tool or SQL:

1. Go to Supabase Dashboard
2. Click "SQL Editor" → "New Query"
3. Copy-paste data from `database_backup.json` and insert

**OR use Python script** (will create automatically):

```powershell
python migrate_to_supabase.py --migrate
```

## Step 7: Update Backend for Production

Change your `.env` for production:

```dotenv
# USE LOCAL FOR DEVELOPMENT
# DATABASE_URL=postgresql://postgres:jonibek@127.0.0.1:5432/med

# USE SUPABASE FOR PRODUCTION
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.kdovuejwnqlkudwqqwwx.supabase.co:5432/postgres
```

Then restart backend:

```powershell
cd "c:\react Jonibek\vite-project\Uzgame"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Step 8: Deploy to Vercel (Free)

### Setup Git Repository (if not already done)

```powershell
cd "c:\react Jonibek\vite-project"
git add -A
git commit -m "Add Supabase migration and prepare for production"
git push
```

### Deploy on Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   VITE_FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```
7. Click "Deploy"

### Deploy Backend to Railway/Render/Heroku

**Option A: Railway.app (Recommended)**

1. Go to https://railway.app
2. Connect GitHub repo
3. Add environment variables from `.env`
4. Deploy Python backend

**Option B: Heroku**

```powershell
heroku create your-app-name
heroku config:set DATABASE_URL="postgresql://postgres:..."
git push heroku main
```

## Step 9: Update API URL After Deployment

Once backend is deployed (e.g., `https://api.yourdomain.com`):

1. Update `.env`:
   ```dotenv
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

2. Redeploy frontend on Vercel

## Step 10: Test Everything

1. Visit your deployed app: `https://your-app.vercel.app`
2. Login with test credentials
3. Verify data loads correctly
4. Test all features

## Troubleshooting

### Connection refused to Supabase
- ✅ Check password in connection string
- ✅ Whitelist IP in Supabase (Settings → Database → Firewall)
- ✅ Verify database name is `postgres`

### Tables not created
- Run: `python migrate_to_supabase.py --create-tables`

### Data not migrated
- Check `database_backup.json` exists
- Run: `python migrate_to_supabase.py --import`

## Quick Reference

| Component | Local | Production |
|-----------|-------|-----------|
| Database | PostgreSQL (127.0.0.1) | Supabase |
| Frontend | localhost:5173 | Vercel |
| Backend | localhost:8000 | Railway/Heroku |
| Auth | Local users | Same (in Supabase) |

## Security Tips

🔐 **IMPORTANT:**
- Never commit `.env` to GitHub (add to `.gitignore`)
- Use strong passwords for Supabase
- Enable Supabase firewall rules
- Set environment variables on hosting platform (not in .env)
- Use different SECRET_KEY for production

## Next Steps After Deployment

1. ✅ Set custom domain (Vercel + Supabase)
2. ✅ Set up HTTPS (automatic on Vercel)
3. ✅ Configure CORS on backend
4. ✅ Set up CI/CD pipeline
5. ✅ Monitor logs and performance

---

**Questions?** Check:
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
