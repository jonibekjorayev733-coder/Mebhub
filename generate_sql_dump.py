#!/usr/bin/env python3
"""
Simple SQL dump generator using psycopg2
"""

import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

DB_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"

def main():
    print("🔍 Connecting to 'med' database...")
    conn = psycopg2.connect(DB_URL)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    sql_lines = []
    sql_lines.append("-- ============================================================")
    sql_lines.append("-- Supabase-Compatible SQL Dump of 'med' Database")
    sql_lines.append(f"-- Generated: {datetime.now().isoformat()}")
    sql_lines.append("-- ============================================================")
    sql_lines.append("")
    
    # Get all tables
    print("📊 Analyzing database structure...")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """)
    tables = [row['table_name'] for row in cursor.fetchall()]
    print(f"✅ Found {len(tables)} tables")
    
    # Get table creation statements
    print("🔹 Extracting table schemas...")
    for table in tables:
        cursor.execute(f"""
            SELECT column_name, data_type, column_default, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = %s
            ORDER BY ordinal_position
        """, (table,))
        
        columns = cursor.fetchall()
        if not columns:
            continue
        
        sql_lines.append(f"-- {table.upper()}")
        sql_lines.append(f"CREATE TABLE IF NOT EXISTS public.\"{table}\" (")
        
        col_defs = []
        for col in columns:
            col_def = f'  "{col["column_name"]}" {col["data_type"]}'
            if col["column_default"]:
                col_def += f' DEFAULT {col["column_default"]}'
            if col["is_nullable"] == 'NO':
                col_def += ' NOT NULL'
            col_defs.append(col_def)
        
        sql_lines.append(",\n".join(col_defs))
        sql_lines.append(");")
        sql_lines.append("")
    
    # Get data
    print("🔹 Extracting data...")
    sql_lines.append("-- ============================================================")
    sql_lines.append("-- DATA")
    sql_lines.append("-- ============================================================")
    sql_lines.append("")
    
    total_rows = 0
    for table in tables:
        cursor.execute(f"SELECT * FROM public.\"{table}\" ORDER BY id")
        rows = cursor.fetchall()
        
        if not rows:
            continue
        
        sql_lines.append(f"-- {table.upper()} ({len(rows)} rows)")
        
        columns = list(rows[0].keys())
        col_str = ', '.join([f'"{col}"' for col in columns])
        
        for row in rows:
            values = []
            for col in columns:
                val = row[col]
                if val is None:
                    values.append('NULL')
                elif isinstance(val, str):
                    escaped = val.replace("'", "''")
                    values.append(f"'{escaped}'")
                elif isinstance(val, bool):
                    values.append('true' if val else 'false')
                elif isinstance(val, (int, float)):
                    values.append(str(val))
                else:
                    escaped = str(val).replace("'", "''")
                    values.append(f"'{escaped}'")
            
            values_str = ', '.join(values)
            sql_lines.append(f'INSERT INTO public."{table}" ({col_str}) VALUES ({values_str});')
        
        sql_lines.append("")
        total_rows += len(rows)
    
    cursor.close()
    conn.close()
    
    # Write to file
    output_file = "med_database_dump.sql"
    print(f"💾 Writing to {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_lines))
    
    print("")
    print("=" * 60)
    print("✅ SQL DUMP COMPLETE!")
    print("=" * 60)
    print(f"📁 File: {output_file}")
    print(f"📊 Tables: {len(tables)}")
    print(f"📝 Data Rows: {total_rows}")
    print("")
    print("🚀 Next steps:")
    print("   1. Open med_database_dump.sql in your text editor")
    print("   2. Go to Supabase dashboard → SQL Editor")
    print("   3. Copy & paste the content")
    print("   4. Click 'Run' to execute")
    print("")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error: {e}")
