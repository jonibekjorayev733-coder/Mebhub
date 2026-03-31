#!/usr/bin/env python3
"""
Generate a Supabase-compatible SQL dump of the 'med' database
Exports: schema, data, sequences, and indexes
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import sys
from datetime import datetime

# Database connection
DB_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"

def connect_db():
    """Connect to PostgreSQL"""
    try:
        conn = psycopg2.connect(DB_URL)
        return conn
    except Exception as e:
        print(f"❌ Connection failed: {e}", file=sys.stderr)
        return None

def get_table_list(conn):
    """Get all tables in the database"""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """)
    tables = [row['table_name'] for row in cursor.fetchall()]
    cursor.close()
    return tables

def get_table_schema(conn, table_name):
    """Get CREATE TABLE statement"""
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT pg_get_ddl('public.{table_name}'::regclass)
    """)
    result = cursor.fetchone()
    cursor.close()
    
    if result and result[0]:
        return result[0]
    
    # Fallback: manually construct CREATE TABLE
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(f"""
        SELECT 
            column_name, 
            data_type, 
            is_nullable, 
            column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = %s
        ORDER BY ordinal_position
    """, (table_name,))
    
    columns = cursor.fetchall()
    cursor.close()
    
    if not columns:
        return None
    
    col_defs = []
    for col in columns:
        col_def = f'    "{col["column_name"]}" {col["data_type"]}'
        
        if col['column_default']:
            col_def += f' DEFAULT {col["column_default"]}'
        
        if col['is_nullable'] == 'NO':
            col_def += ' NOT NULL'
        
        col_defs.append(col_def)
    
    create_stmt = f"CREATE TABLE public.\"{table_name}\" (\n"
    create_stmt += ",\n".join(col_defs)
    create_stmt += "\n);"
    
    return create_stmt

def get_table_constraints(conn, table_name):
    """Get PRIMARY KEY, FOREIGN KEY, UNIQUE constraints"""
    cursor = conn.cursor()
    statements = []
    
    # Primary keys
    cursor.execute(f"""
        SELECT constraint_name, column_name
        FROM information_schema.key_column_usage
        WHERE table_schema = 'public' 
        AND table_name = %s 
        AND constraint_name IN (
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE constraint_type = 'PRIMARY KEY' AND table_name = %s
        )
        ORDER BY ordinal_position
    """, (table_name, table_name))
    
    pk_rows = cursor.fetchall()
    if pk_rows:
        pk_cols = [row[1] for row in pk_rows]
        col_list = ", ".join([f'"{col}"' for col in pk_cols])
        statements.append(f'ALTER TABLE public."{table_name}" ADD PRIMARY KEY ({col_list});')
    
    # Foreign keys
    cursor.execute(f"""
        SELECT constraint_name, column_name, referenced_table_name, referenced_column_name
        FROM information_schema.referential_constraints rc
        JOIN information_schema.key_column_usage kcu 
            ON rc.constraint_name = kcu.constraint_name
        WHERE kcu.table_schema = 'public' AND kcu.table_name = %s
    """, (table_name,))
    
    fk_rows = cursor.fetchall()
    for fk in fk_rows:
        constraint_name = fk[0]
        column = fk[1]
        ref_table = fk[2]
        ref_column = fk[3]
        statements.append(f'ALTER TABLE public."{table_name}" ADD FOREIGN KEY ("{column}") REFERENCES public."{ref_table}" ("{ref_column}");')
    
    cursor.close()
    return statements

def get_sequences(conn):
    """Get all sequences"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT sequence_name, start_value, increment, max_value
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
        ORDER BY sequence_name
    """)
    
    sequences = []
    for row in cursor.fetchall():
        seq_name = row[0]
        sequences.append(f'CREATE SEQUENCE public."{seq_name}" START WITH {row[1]} INCREMENT BY {row[2]} MAXVALUE {row[3]};')
    
    cursor.close()
    return sequences

def get_indexes(conn, table_name):
    """Get indexes for a table"""
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = %s
        AND indexname NOT LIKE '%_pkey'
    """, (table_name,))
    
    indexes = [row[1] + ';' for row in cursor.fetchall()]
    cursor.close()
    return indexes

def get_table_data(conn, table_name):
    """Get INSERT statements for all data"""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(f'SELECT * FROM public."{table_name}" ORDER BY id')
    
    rows = cursor.fetchall()
    cursor.close()
    
    if not rows:
        return []
    
    inserts = []
    columns = list(rows[0].keys())
    col_str = ', '.join([f'"{col}"' for col in columns])
    
    for row in rows:
        values = []
        for col in columns:
            val = row[col]
            if val is None:
                values.append('NULL')
            elif isinstance(val, str):
                # Escape single quotes
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
        inserts.append(f'INSERT INTO public."{table_name}" ({col_str}) VALUES ({values_str});')
    
    return inserts

def check_uuid_extension(conn):
    """Check if UUID columns exist"""
    cursor = conn.cursor()
    cursor.execute("""
        SELECT COUNT(*) FROM information_schema.columns
        WHERE table_schema = 'public' AND data_type = 'uuid'
    """)
    has_uuid = cursor.fetchone()[0] > 0
    cursor.close()
    return has_uuid

def main():
    print("🔍 Connecting to 'med' database...")
    conn = connect_db()
    if not conn:
        sys.exit(1)
    
    print("📊 Analyzing database structure...")
    tables = get_table_list(conn)
    has_uuid = check_uuid_extension(conn)
    
    print(f"✅ Found {len(tables)} tables")
    
    # Generate SQL
    sql_output = []
    
    # Header
    sql_output.append("-- ============================================================")
    sql_output.append("-- Supabase-Compatible SQL Dump of 'med' Database")
    sql_output.append(f"-- Generated: {datetime.now().isoformat()}")
    sql_output.append("-- ============================================================")
    sql_output.append("")
    
    # UUID extension
    if has_uuid:
        sql_output.append("-- UUID Extension")
        sql_output.append('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        sql_output.append("")
    
    # Sequences
    print("🔹 Extracting sequences...")
    sequences = get_sequences(conn)
    if sequences:
        sql_output.append("-- ============================================================")
        sql_output.append("-- SEQUENCES")
        sql_output.append("-- ============================================================")
        for seq in sequences:
            sql_output.append(seq)
        sql_output.append("")
    
    # Create tables
    print("🔹 Extracting table schemas...")
    sql_output.append("-- ============================================================")
    sql_output.append("-- TABLES")
    sql_output.append("-- ============================================================")
    sql_output.append("")
    
    for table in tables:
        schema = get_table_schema(conn, table)
        if schema:
            sql_output.append(schema)
            sql_output.append("")
    
    # Constraints
    print("🔹 Extracting constraints...")
    sql_output.append("-- ============================================================")
    sql_output.append("-- CONSTRAINTS")
    sql_output.append("-- ============================================================")
    sql_output.append("")
    
    for table in tables:
        constraints = get_table_constraints(conn, table)
        if constraints:
            sql_output.append(f"-- {table.upper()}")
            for constraint in constraints:
                sql_output.append(constraint)
            sql_output.append("")
    
    # Indexes
    print("🔹 Extracting indexes...")
    sql_output.append("-- ============================================================")
    sql_output.append("-- INDEXES")
    sql_output.append("-- ============================================================")
    sql_output.append("")
    
    for table in tables:
        indexes = get_indexes(conn, table)
        if indexes:
            sql_output.append(f"-- {table.upper()}")
            for index in indexes:
                sql_output.append(index)
            sql_output.append("")
    
    # Data
    print("🔹 Extracting data...")
    sql_output.append("-- ============================================================")
    sql_output.append("-- DATA")
    sql_output.append("-- ============================================================")
    sql_output.append("")
    
    total_rows = 0
    for table in tables:
        inserts = get_table_data(conn, table)
        if inserts:
            sql_output.append(f"-- {table.upper()} ({len(inserts)} rows)")
            for insert in inserts:
                sql_output.append(insert)
            sql_output.append("")
            total_rows += len(inserts)
    
    conn.close()
    
    # Write to file
    output_file = "med_database_dump.sql"
    print(f"💾 Writing to {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_output))
    
    print("")
    print("=" * 60)
    print("✅ SQL DUMP COMPLETE!")
    print("=" * 60)
    print(f"📁 File: {output_file}")
    print(f"📊 Tables: {len(tables)}")
    print(f"📝 Data Rows: {total_rows}")
    print("")
    print("🚀 Next steps:")
    print("   1. Review med_database_dump.sql")
    print("   2. Go to Supabase dashboard → SQL Editor")
    print("   3. Copy & paste the SQL file content")
    print("   4. Execute to create tables and import data")
    print("")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
