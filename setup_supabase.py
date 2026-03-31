#!/usr/bin/env python3
"""
Quick Supabase Setup
Prepares your app for Supabase migration
"""

import os
from pathlib import Path
from dotenv import load_dotenv

def main():
    env_path = Path(__file__).resolve().parent / '.env'
    load_dotenv(dotenv_path=env_path)
    
    print("\n" + "="*70)
    print("SUPABASE SETUP CHECKLIST")
    print("="*70)
    
    print("\n✅ STEP 1: CREATE SUPABASE ACCOUNT")
    print("   URL: https://app.supabase.com")
    print("   → Create new project")
    
    print("\n✅ STEP 2: GET CONNECTION STRING")
    print("   In Supabase Dashboard:")
    print("   → Settings → Database → Connection string (URI)")
    print("   → Copy the postgresql:// URL")
    
    print("\n✅ STEP 3: UPDATE .env FILE")
    supabase_url = os.getenv("SUPABASE_DATABASE_URL", "").strip()
    
    if supabase_url:
        print(f"   ✅ SUPABASE_DATABASE_URL is set!")
        print(f"   Host: {supabase_url.split('@')[1].split(':')[0] if '@' in supabase_url else 'Not found'}")
    else:
        print("   ⚠️  SUPABASE_DATABASE_URL is empty!")
        print("   → Add to .env:")
        print("   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres")
    
    print("\n✅ STEP 4: VERIFY SUPABASE CONNECTION")
    print("   Run: python migrate_to_supabase.py")
    
    print("\n✅ STEP 5: MIGRATE DATA")
    print("   Run: python migrate_to_supabase.py --migrate")
    
    print("\n✅ STEP 6: DEPLOY")
    print("   Option A: Vercel (Frontend)")
    print("            URL: https://vercel.com")
    print("   Option B: Railway (Backend)")
    print("            URL: https://railway.app")
    
    print("\n" + "="*70)
    print("DOCS: See SUPABASE_DEPLOYMENT.md for detailed instructions")
    print("="*70 + "\n")
    
    if not supabase_url:
        print("⚠️  NEXT ACTION: Update SUPABASE_DATABASE_URL in .env\n")

if __name__ == "__main__":
    main()
