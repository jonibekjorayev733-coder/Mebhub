#!/usr/bin/env python3
"""
Quick fix script for both frontend and backend issues.
Run this once to fix all problems.
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    print("=" * 60)
    print("GAME ERRORS FIX SCRIPT")
    print("=" * 60)
    print()
    
    # Check current directory
    if not Path("Uzgame").exists():
        print("❌ Error: Please run this script from the project root directory")
        print("   Current directory:", os.getcwd())
        sys.exit(1)
    
    print("✓ Found Uzgame directory")
    print()
    
    # Step 1: Backend database fix
    print("Step 1: Fixing backend database schema...")
    print("-" * 60)
    
    try:
        os.chdir("Uzgame")
        print("Running: python recreate_tables.py")
        result = subprocess.run(
            [sys.executable, "recreate_tables.py"],
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.returncode != 0:
            print("❌ Error creating tables:")
            print(result.stderr)
            sys.exit(1)
        print("✓ Database tables created successfully")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        os.chdir("..")
    
    print()
    
    # Step 2: Seed sample data
    print("Step 2: Seeding sample word search questions...")
    print("-" * 60)
    
    try:
        os.chdir("Uzgame")
        print("Running: python seed_word_search.py")
        result = subprocess.run(
            [sys.executable, "seed_word_search.py"],
            capture_output=True,
            text=True,
            input="y\n"  # Auto-answer 'y' to overwrite prompt
        )
        print(result.stdout)
        if result.returncode != 0:
            print("❌ Error seeding data:")
            print(result.stderr)
            sys.exit(1)
        print("✓ Sample questions seeded successfully")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        os.chdir("..")
    
    print()
    print("=" * 60)
    print("✓ ALL FIXES COMPLETED!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Start the backend server:")
    print("   cd Uzgame")
    print("   python -m uvicorn app.main:app --reload --port 8000")
    print()
    print("2. In another terminal, start the frontend:")
    print("   npm run dev")
    print()
    print("3. Open http://localhost:5174 in your browser")
    print("4. Navigate to the Word Search Game (SO'Z QIDIRUV)")
    print()

if __name__ == "__main__":
    main()
