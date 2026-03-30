"""
Add is_admin column to med table
"""

from sqlalchemy import text
from app.database import engine

def add_is_admin_column():
    with engine.connect() as conn:
        try:
            # Check if column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='med' AND column_name='is_admin'
            """))
            
            if result.fetchone():
                print("✓ Column is_admin already exists")
                return
            
            # Add column
            conn.execute(text("""
                ALTER TABLE med 
                ADD COLUMN is_admin BOOLEAN DEFAULT FALSE
            """))
            conn.commit()
            print("✓ Column is_admin added successfully")
        except Exception as e:
            print(f"✗ Error: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_is_admin_column()
