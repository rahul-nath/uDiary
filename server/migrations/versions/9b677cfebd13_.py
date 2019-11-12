"""Add categories table and migrate categories

- get all Posts
- create post_ids =  { category: list(Post.id)s }
- for category in post_ids, create a row in Category
- then, for each of its post_ids, create a PostCategory with the Post ID
    and the new Category ID

Revision ID: 9b677cfebd13
Revises: 935842af8c56
Create Date: 2019-11-06 21:48:25.771543

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '9b677cfebd13'
down_revision = '935842af8c56'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_at', sa.DateTime(), nullable=True),
    sa.Column('name', sa.String(length=120), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('categories_posts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('modified_at', sa.DateTime(), nullable=True),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_posts_category_id'), 'categories_posts', ['category_id'], unique=False)
    op.create_index(op.f('ix_categories_posts_post_id'), 'categories_posts', ['post_id'], unique=False)
    op.add_column(u'posts', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column(u'posts', sa.Column('modified_at', sa.DateTime(), nullable=True))
    op.drop_column(u'posts', 'display_date')
    op.drop_column(u'posts', 'date_added')
    op.add_column(u'users', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column(u'users', sa.Column('modified_at', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column(u'users', 'modified_at')
    op.drop_column(u'users', 'created_at')
    op.add_column(u'posts', sa.Column('date_added', postgresql.TIMESTAMP(), autoincrement=False, nullable=False))
    op.add_column(u'posts', sa.Column('display_date', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column(u'posts', 'modified_at')
    op.drop_column(u'posts', 'created_at')
    op.drop_index(op.f('ix_categories_posts_post_id'), table_name='categories_posts')
    op.drop_index(op.f('ix_categories_posts_category_id'), table_name='categories_posts')
    op.drop_table('categories_posts')
    op.drop_table('categories')
    # ### end Alembic commands ###
