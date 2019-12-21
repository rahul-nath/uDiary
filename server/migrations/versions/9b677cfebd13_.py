"""Add categories table and migrate categories

Revision ID: 9b677cfebd13
Revises: 935842af8c56
Create Date: 2019-11-06 21:48:25.771543

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.expression import bindparam

# revision identifiers, used by Alembic.
revision = '9b677cfebd13'
down_revision = '935842af8c56'
branch_labels = None
depends_on = None


def upgrade():
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

    categories = sa.Table(
        'categories',
        sa.MetaData(),
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name')
    )

    # Use Alchemy's connection and transaction to noodle over the data.
    connection = op.get_bind()
    categories_result = connection.execute("select distinct category from posts").fetchall()

    category_entries = [{ "name": str(res["category"]) } for res in categories_result]

    category_insert = categories.insert().values({ "name": bindparam("name") })
    connection.execute(category_insert, category_entries)

    op.create_index(op.f('ix_categories_posts_category_id'), 'categories_posts', ['category_id'], unique=False)
    op.create_index(op.f('ix_categories_posts_post_id'), 'categories_posts', ['post_id'], unique=False)
    op.add_column(u'posts', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column(u'posts', sa.Column('modified_at', sa.DateTime(), nullable=True))
    op.add_column(u'users', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column(u'users', sa.Column('modified_at', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column(u'users', 'modified_at')
    op.drop_column(u'users', 'created_at')
    op.drop_column(u'posts', 'modified_at')
    op.drop_column(u'posts', 'created_at')
    op.drop_index(op.f('ix_categories_posts_post_id'), table_name='categories_posts')
    op.drop_index(op.f('ix_categories_posts_category_id'), table_name='categories_posts')
    op.drop_table('categories_posts')
    op.drop_table('categories')
    # ### end Alembic commands ###