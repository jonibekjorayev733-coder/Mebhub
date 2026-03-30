from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
session = sessionmaker(bind=create_engine(POSTGRESQL_URL))()

# Count all users
count = session.execute(text("SELECT COUNT(*) FROM med")).scalar()
print(f"Med table total: {count} users")

# Show all users ordered by ID
print("\nAll users in med table:")
users = session.execute(text("SELECT id, email FROM med ORDER BY id")).fetchall()
for u in users:
    print(f"  [{u[0]}] {u[1]}")

# Check trace.test which we just added
trace_check = session.execute(text("SELECT id FROM med WHERE email = 'trace.test@example.com'")).fetchone()
if trace_check:
    print(f"\nTrace.test found: YES (ID={trace_check[0]})")
else:
    print(f"\nTrace.test found: NO")

session.close()
