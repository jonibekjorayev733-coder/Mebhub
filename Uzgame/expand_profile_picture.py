from sqlalchemy import create_engine, text

# DB connection
engine = create_engine("postgresql://postgres:jonibek@127.0.0.1:5432/med")

with engine.connect() as connection:
    try:
        # Alter med table
        connection.execute(text("""
            ALTER TABLE med
            ALTER COLUMN profile_picture TYPE TEXT
        """))
        connection.commit()
        print("✓ Med table profile_picture changed to TEXT")
    except Exception as e:
        print(f"Med table error: {e}")
        connection.rollback()
    
    try:
        # Alter emailuser table
        connection.execute(text("""
            ALTER TABLE emailuser
            ALTER COLUMN profile_picture TYPE TEXT
        """))
        connection.commit()
        print("✓ EmailUser table profile_picture changed to TEXT")
    except Exception as e:
        print(f"EmailUser table error: {e}")
        connection.rollback()
