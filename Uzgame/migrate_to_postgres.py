import sqlite3
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# SQLite connection
sqlite_conn = sqlite3.connect('app.db')
sqlite_cursor = sqlite_conn.cursor()

# PostgreSQL connection
POSTGRESQL_URL = "postgresql://postgres:jonibek@127.0.0.1:5432/med"
pg_engine = create_engine(POSTGRESQL_URL)
PgSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=pg_engine)

print("=" * 70)
print("SQLITE DAN POSTGRESQL GA MIGRATSIYA (TO'G'RILANGAN)")
print("=" * 70)

# SQLite tables ro'yxati
sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = sqlite_cursor.fetchall()

try:
    pg_session = PgSessionLocal()
    
    for table_name in tables:
        table = table_name[0]
        
        if table == 'sqlite_sequence':
            continue
            
        print(f"\nMigratsiya: {table}")
        
        # Ma'lumotlarni SQLite dan ol
        sqlite_cursor.execute(f"SELECT * FROM {table}")
        rows = sqlite_cursor.fetchall()
        
        # Column names
        sqlite_cursor.execute(f"PRAGMA table_info({table})")
        columns_info = sqlite_cursor.fetchall()
        column_names = [col[1] for col in columns_info]
        
        print(f"  Rows: {len(rows)}")
        print(f"  Columns: {', '.join(column_names)}")
        
        if rows:
            for row in rows:
                try:
                    # Values ni to'g'ri qil - NULL uchun NULL, boshqasi uchun quoted
                    values = []
                    for i, v in enumerate(row):
                        col_name = column_names[i]
                        
                        if v is None:
                            values.append("NULL")
                        elif col_name == "is_active":
                            # Boolean to TRUE/FALSE
                            values.append("TRUE" if v else "FALSE")
                        elif isinstance(v, str):
                            values.append(f"'{v.replace(chr(39), chr(39)+chr(39))}'")  # Escape quotes
                        elif isinstance(v, bool):
                            values.append("TRUE" if v else "FALSE")
                        else:
                            values.append(str(v))
                    
                    insert_query = f"INSERT INTO {table} ({', '.join(column_names)}) VALUES ({', '.join(values)})"
                    pg_session.execute(text(insert_query))
                    
                except Exception as e:
                    print(f"    ⚠ Row error: {e}")
            
            pg_session.commit()
            print(f"  ✓ {len(rows)} qator migratsiya qilindi")
    
    pg_session.close()
    
    print("\n" + "=" * 70)
    print("✅ MIGRATSIYA TAMOMLANDI!")
    print("=" * 70)
    
except Exception as e:
    print(f"❌ Xato: {e}")
    pg_session.rollback()
finally:
    sqlite_conn.close()
