#!/usr/bin/env python3
"""
Script to recreate database tables for game questions.
This ensures the schema matches the updated models.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import engine, Base
from app.models.game import GameQuestion, GameProgress, TeamGameProgress

def recreate_tables():
    """Drop and recreate all tables"""
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✓ Tables dropped")
    
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created")
    
    print("\nDatabase tables recreated successfully!")
    print("\nTables created:")
    print("  - game_questions")
    print("  - game_progress")
    print("  - team_game_progress")

if __name__ == "__main__":
    try:
        recreate_tables()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
