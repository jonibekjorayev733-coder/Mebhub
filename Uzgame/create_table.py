import sqlite3

# Connect to app.db
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

# Create the new table
cursor.execute("""
CREATE TABLE IF NOT EXISTS table_name (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    create_time DATE,
    name VARCHAR(255)
)
""")

conn.commit()

# Verify table was created
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='table_name'")
result = cursor.fetchone()

if result:
    print('✓ Table created successfully: table_name')
    
    # Show the structure
    cursor.execute("PRAGMA table_info(table_name)")
    columns = cursor.fetchall()
    
    print('\nTable structure:')
    for col in columns:
        col_name = col[1]
        col_type = col[2]
        print(f'  - {col_name} ({col_type})')
else:
    print('✗ Failed to create table')

conn.close()
