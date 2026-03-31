from sqlalchemy import create_engine, text

# DB connection
engine = create_engine("postgresql://postgres:jonibek@127.0.0.1:5432/med")

with engine.connect() as connection:
    # Check if column already exists
    result = connection.execute(text("""
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'emailuser' AND column_name = 'profile_picture'
    """))
    
    exists = result.fetchone()
    
    if exists:
        print("✓ profile_picture column already exists")
    else:
        # Add the column
        connection.execute(text("""
            ALTER TABLE emailuser 
            ADD COLUMN profile_picture VARCHAR(500)
        """))
        connection.commit()
        print("✓ profile_picture column added successfully!")
