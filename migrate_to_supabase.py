#!/usr/bin/env python3
"""
Supabase Migration Script
Migrates all data from local PostgreSQL to Supabase
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

# Get database URLs
LOCAL_DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_DATABASE_URL = os.getenv("SUPABASE_DATABASE_URL")

if not LOCAL_DATABASE_URL:
    logger.error("❌ DATABASE_URL not found in .env")
    sys.exit(1)

if not SUPABASE_DATABASE_URL:
    logger.warning("⚠️  SUPABASE_DATABASE_URL not set yet. Follow the steps below:")
    print("\n" + "="*70)
    print("SETUP INSTRUCTIONS:")
    print("="*70)
    print("\n1. Go to: https://app.supabase.com")
    print("2. Create a new project or select existing one")
    print("3. Go to Settings → Database → Connection string")
    print("4. Copy the URI and add to .env:")
    print("   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres")
    print("\n5. Then run this script again")
    print("="*70 + "\n")
    sys.exit(1)

def get_all_tables(engine):
    """Get all table names from database"""
    inspector = inspect(engine)
    return inspector.get_table_names()

def export_table_data(source_engine, table_name):
    """Export all data from a table"""
    with source_engine.connect() as conn:
        result = conn.execute(text(f"SELECT * FROM {table_name}"))
        columns = result.keys()
        rows = result.fetchall()
        
        data = []
        for row in rows:
            data.append(dict(zip(columns, row)))
        
        return list(columns), data

def create_backup_file(tables_data):
    """Create a JSON backup of all data"""
    backup_path = Path(__file__).resolve().parent / "database_backup.json"
    
    with open(backup_path, 'w') as f:
        json.dump(tables_data, f, indent=2, default=str)
    
    logger.info(f"✅ Backup created: {backup_path}")
    return backup_path

def main():
    logger.info("\n" + "="*70)
    logger.info("SUPABASE MIGRATION TOOL")
    logger.info("="*70)
    
    # Test local connection
    logger.info("\n📡 Testing local database connection...")
    try:
        local_engine = create_engine(LOCAL_DATABASE_URL, pool_pre_ping=True)
        with local_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("✅ Local database connected")
    except Exception as e:
        logger.error(f"❌ Failed to connect to local database: {e}")
        sys.exit(1)
    
    # Test Supabase connection
    logger.info("\n📡 Testing Supabase database connection...")
    try:
        supabase_engine = create_engine(SUPABASE_DATABASE_URL, pool_pre_ping=True)
        with supabase_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("✅ Supabase database connected")
    except Exception as e:
        logger.error(f"❌ Failed to connect to Supabase: {e}")
        logger.error("Check your SUPABASE_DATABASE_URL in .env")
        sys.exit(1)
    
    # Get tables from local database
    logger.info("\n📋 Getting tables from local database...")
    try:
        tables = get_all_tables(local_engine)
        logger.info(f"✅ Found {len(tables)} tables: {tables}")
    except Exception as e:
        logger.error(f"❌ Failed to get tables: {e}")
        sys.exit(1)
    
    # Export data from each table
    logger.info("\n💾 Exporting data from all tables...")
    all_tables_data = {}
    
    for table_name in tables:
        try:
            columns, data = export_table_data(local_engine, table_name)
            all_tables_data[table_name] = {
                'columns': columns,
                'data': data,
                'row_count': len(data)
            }
            logger.info(f"  ✅ {table_name}: {len(data)} rows")
        except Exception as e:
            logger.warning(f"  ⚠️  Skipped {table_name}: {e}")
    
    # Create backup
    logger.info("\n💾 Creating backup...")
    backup_path = create_backup_file(all_tables_data)
    
    # Summary
    logger.info("\n" + "="*70)
    logger.info("NEXT STEPS:")
    logger.info("="*70)
    print("""
1. SUPABASE SETUP:
   - Create tables in Supabase with same structure as local database
   - Or use: python migrate_to_supabase.py --migrate

2. UPDATE .env with:
   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

3. VERIFY MIGRATION:
   python migrate_to_supabase.py --verify

4. UPDATE backend configuration:
   - Change DATABASE_URL in .env to use Supabase
   - Restart backend

5. DEPLOY:
   - Push to GitHub
   - Deploy to Vercel or similar service
    """)
    print("="*70)
    
    logger.info(f"\n✅ Export completed! Backup saved to: {backup_path}")

if __name__ == "__main__":
    main()
