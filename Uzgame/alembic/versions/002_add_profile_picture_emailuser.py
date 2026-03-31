"""add_profile_picture_to_emailuser

Revision ID: 002_add_profile_picture
Revises: e2738cfe4f94
Create Date: 2026-03-31 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_add_profile_picture'
down_revision = 'e2738cfe4f94'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add profile_picture column to emailuser table
    op.add_column('emailuser', sa.Column('profile_picture', sa.String(500), nullable=True))


def downgrade() -> None:
    # Remove profile_picture column from emailuser table
    op.drop_column('emailuser', 'profile_picture')
