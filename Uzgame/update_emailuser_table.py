import sqlite3

# Connect to app.db
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

# Drop the old table
cursor.execute("DROP TABLE IF EXISTS emailuser")

# Create the new table with all columns
cursor.execute("""
CREATE TABLE IF NOT EXISTS emailuser (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    create_time DATE
)
""")

conn.commit()

# Verify table was created
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='emailuser'")
result = cursor.fetchone()

if result:
    print('✓ Table updated successfully: emailuser')
    
    # Show the structure
    cursor.execute("PRAGMA table_info(emailuser)")
    columns = cursor.fetchall()
    
    print('\nTable structure:')
    for col in columns:
        col_name = col[1]
        col_type = col[2]
        not_null = 'NOT NULL' if col[3] else 'NULL'
        print(f'  - {col_name} ({col_type}) {not_null}')
else:
    print('✗ Failed to create table')

conn.close()
