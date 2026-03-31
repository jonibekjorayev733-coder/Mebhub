#!/usr/bin/env python3
"""
Migrate all data from local PostgreSQL 'med' database to Supabase
Copies: users, topics, learning_items, test_questions, and admin_roles
"""

import os
import sys
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
import json
from datetime import datetime

# Load environment variables
load_dotenv()

LOCAL_DB_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"
SUPABASE_DB_URL = os.getenv("SUPABASE_DATABASE_URL")

if not SUPABASE_DB_URL:
    print("❌ ERROR: SUPABASE_DATABASE_URL not found in .env")
    print("Please add your Supabase connection string to .env:")
    print('   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres')
    sys.exit(1)

print(f"📡 Local DB: {LOCAL_DB_URL}")
print(f"📡 Supabase DB: {SUPABASE_DB_URL.split('@')[1] if '@' in SUPABASE_DB_URL else 'connecting...'}")
print()

def connect_db(url):
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(url)
        return conn
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return None

def get_table_data(conn, table_name):
    """Fetch all data from a table"""
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(f"SELECT * FROM {table_name} ORDER BY id")
        data = cursor.fetchall()
        cursor.close()
        return data
    except Exception as e:
        print(f"⚠️  Could not read {table_name}: {e}")
        return []

def insert_data(conn, table_name, data):
    """Insert data into Supabase table"""
    if not data:
        return 0
    
    try:
        cursor = conn.cursor()
        
        # Get column names from first row
        columns = list(data[0].keys())
        placeholders = ','.join(['%s'] * len(columns))
        
        # Prepare INSERT statement
        insert_sql = f"""
            INSERT INTO {table_name} ({','.join(columns)})
            VALUES ({placeholders})
            ON CONFLICT DO NOTHING
        """
        
        # Convert data to tuples
        values = [tuple(row.values()) for row in data]
        
        # Execute batch insert
        cursor.executemany(insert_sql, values)
        conn.commit()
        
        affected = cursor.rowcount
        cursor.close()
        return affected
    except Exception as e:
        print(f"⚠️  Error inserting into {table_name}: {e}")
        conn.rollback()
        return 0

def migrate_table(local_conn, supabase_conn, table_name):
    """Migrate a single table"""
    print(f"🔄 Migrating {table_name}...")
    
    # Get data from local database
    data = get_table_data(local_conn, table_name)
    
    if not data:
        print(f"   ℹ️  No data found in {table_name}")
        return 0
    
    print(f"   📊 Found {len(data)} records")
    
    # Insert into Supabase
    affected = insert_data(supabase_conn, table_name, data)
    
    if affected > 0:
        print(f"   ✅ Inserted {affected} records")
    else:
        print(f"   ⚠️  No new records inserted (may already exist)")
    
    return affected

def main():
    print("=" * 60)
    print("🚀 MIGRATING MED DATABASE TO SUPABASE")
    print("=" * 60)
    print()
    
    # Connect to both databases
    print("📌 Connecting to databases...")
    local_conn = connect_db(LOCAL_DB_URL)
    supabase_conn = connect_db(SUPABASE_DB_URL)
    
    if not local_conn or not supabase_conn:
        print("❌ Failed to connect to one or more databases")
        return False
    
    print("✅ Connected to both databases")
    print()
    
    # Tables to migrate
    tables = [
        "admin_roles",
        "users",
        "topics",
        "learning_items",
        "test_questions"
    ]
    
    total_records = 0
    
    # Migrate each table
    for table in tables:
        records = migrate_table(local_conn, supabase_conn, table)
        total_records += records
    
    # Close connections
    local_conn.close()
    supabase_conn.close()
    
    print()
    print("=" * 60)
    print(f"✅ MIGRATION COMPLETE!")
    print(f"📊 Total records migrated: {total_records}")
    print("=" * 60)
    print()
    print("📝 Next steps:")
    print("   1. Verify data in Supabase dashboard")
    print("   2. Update backend DATABASE_URL in .env:")
    print(f"      DATABASE_URL={SUPABASE_DB_URL}")
    print("   3. Restart backend server")
    print("   4. Test the app")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⛔ Migration cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
