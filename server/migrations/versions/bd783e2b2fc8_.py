"""Remove post category column and add association table rows

Revision ID: bd783e2b2fc8
Revises: 9b677cfebd13
Create Date: 2019-11-17 17:06:04.060473
"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy as sa
from sqlalchemy.sql.expression import bindparam


# revision identifiers, used by Alembic.
revision = 'bd783e2b2fc8'
down_revision = '9b677cfebd13'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    connection = op.get_bind()

    categories_posts = sa.Table(
        'categories_posts',
        sa.MetaData(),
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('post_id'),
        sa.Column('category_id')
    )

    categories = connection.execute("select * from categories").fetchall()
    posts = connection.execute("select * from posts").fetchall()
    posts_by_categories = []

    categories_by_id = { str(cat["name"]): int(cat["id"])  for cat in categories }

    for post in posts:
        posts_by_categories.append({
            "category_id": categories_by_id[str(post["category"])],
            "post_id": int(post["id"])
        })

    category_post_insert = categories_posts.insert()\
        .values({
            "category_id": bindparam("category_id"),
            "post_id": bindparam("post_id")
        })

    connection.execute(category_post_insert, posts_by_categories)

    op.drop_column('posts', 'category')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('posts', sa.Column('category', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###