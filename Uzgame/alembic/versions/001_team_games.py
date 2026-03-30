"""Add team game progress table

Revision ID: team_games_001
Revises: 
Create Date: 2024-02-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'team_games_001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create team_game_progress table
    op.create_table(
        'team_game_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('game_name', sa.String(), nullable=False),
        sa.Column('section_number', sa.Integer(), nullable=False),
        sa.Column('difficulty', sa.String(), nullable=False),
        sa.Column('team1_player_id', sa.Integer(), nullable=True),
        sa.Column('team2_player_id', sa.Integer(), nullable=True),
        sa.Column('team1_score', sa.Integer(), server_default='0'),
        sa.Column('team2_score', sa.Integer(), server_default='0'),
        sa.Column('total_questions', sa.Integer(), server_default='20'),
        sa.Column('completed', sa.Boolean(), server_default='false'),
        sa.Column('winner', sa.String(), nullable=True),
        sa.Column('total_time_spent', sa.Float(), server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_team_game_progress_game_name'), 'team_game_progress', ['game_name'], unique=False)
    op.create_index(op.f('ix_team_game_progress_section_number'), 'team_game_progress', ['section_number'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_team_game_progress_section_number'), table_name='team_game_progress')
    op.drop_index(op.f('ix_team_game_progress_game_name'), table_name='team_game_progress')
    op.drop_table('team_game_progress')
