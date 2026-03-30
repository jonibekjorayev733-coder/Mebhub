import sqlite3

# Connect to app.db
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print('='*70)
print('TABLES IN app.db (Med Database)')
print('='*70)

if tables:
    for table in tables:
        table_name = table[0]
        print(f'\n✓ Table: {table_name}')
        
        # Get columns for each table
        cursor.execute(f'PRAGMA table_info({table_name})')
        columns = cursor.fetchall()
        
        print(f'  Columns:')
        for col in columns:
            col_name = col[1]
            col_type = col[2]
            print(f'    - {col_name} ({col_type})')
else:
    print('No tables found')

print('\n' + '='*70)
conn.close()
