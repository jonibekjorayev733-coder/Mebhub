# 🚀 Supabase Setup Guide

## Step 1: Create Supabase Account & Project

1. Go to https://app.supabase.com
2. Sign up (use your Gmail)
3. Click "New Project"
4. Fill in:
   - **Project name**: `mebhub` (or any name)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., Europe-West)
5. Click "Create new project" (takes 2-3 minutes)

## Step 2: Get Your Connection String

1. Wait for project to initialize
2. Go to **Settings** → **Database** (left sidebar)
3. Under "Connection string", select **"URI"** tab
4. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.kdovuejwnqlkudwqqwwx.supabase.co:5432/postgres
   ```
   
⚠️ **IMPORTANT**: Replace `[YOUR_PASSWORD]` with the password you set in Step 1

## Step 3: Update .env File

Open `.env` in your project and replace the empty line:

**BEFORE:**
```dotenv
SUPABASE_DATABASE_URL=
```

**AFTER:**
```dotenv
SUPABASE_DATABASE_URL=postgresql://postgres:yourpassword@db.kdovuejwnqlkudwqqwwx.supabase.co:5432/postgres
```

## Step 4: Create Tables in Supabase

Supabase uses Alembic migrations. Run:

```powershell
cd c:\react Jonibek\vite-project\Uzgame
alembic upgrade head
```

Or manually create tables using Supabase SQL Editor:
1. Go to **SQL Editor** in Supabase dashboard
2. Create all tables (see schema below)

## Step 5: Migrate Your Data

```powershell
cd c:\react Jonibek\vite-project
python migrate_med_data.py
```

This will copy ALL your data from local PostgreSQL to Supabase! ✅

## Database Schema (if needed)

If tables don't exist in Supabase, run these SQL commands:

```sql
-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Admin Roles
CREATE TABLE admin_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  role_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Topics
CREATE TABLE topics (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Learning Items
CREATE TABLE learning_items (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT REFERENCES topics(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  image_url VARCHAR(500),
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Test Questions
CREATE TABLE test_questions (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT REFERENCES topics(id),
  question_text TEXT NOT NULL,
  option_a VARCHAR(500),
  option_b VARCHAR(500),
  option_c VARCHAR(500),
  option_d VARCHAR(500),
  correct_answer VARCHAR(1),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 6: Update Backend Configuration

Once data is migrated, update `.env`:

```dotenv
# SWITCH TO SUPABASE
DATABASE_URL=postgresql://postgres:yourpassword@db.kdovuejwnqlkudwqqwwx.supabase.co:5432/postgres
```

Then restart your backend server.

## ✅ Verification

After migration, verify in Supabase:
1. Go to **Table Editor**
2. Check each table has data:
   - `users` - Should show your accounts
   - `topics` - Should show 5 topics
   - `learning_items` - Should show 160 items
   - `test_questions` - Should show 120 questions
   - `admin_roles` - Should show admin assignments

## 🚀 Next: Deploy to Production

After successful migration:
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway or Render
- **Update API URLs** in .env

See `SUPABASE_DEPLOYMENT.md` for full deployment guide.

---

**Questions?** Check Supabase docs: https://supabase.com/docs
