from __future__ import print_function # In python 2.7

from flask_restful import Resource, Api, fields, marshal_with
from flask import Flask, render_template, request
from datetime import datetime as dt
import sys
from flask_cors import CORS, cross_origin
from flask.json import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
import datetime


app = Flask(__name__, static_folder='../static', template_folder='../static')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/local_blog'
db = SQLAlchemy(app)
api = Api(app)
migrate = Migrate(app, db)

"""
For second migration script (after first migration success):
    - delete the "category" column for Posts
"""

class Base(db.Model):
    ''' base model attributes which are added to all models '''

    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=dt.utcnow)
    modified_at = db.Column(
        db.DateTime,
        default=dt.utcnow,
        onupdate=dt.utcnow
    )

    def save(self):
        db.session.add(self)
        db.session.flush()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.flush()
        db.session.commit()

class User(Base):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True)

    def __init__(self, email):
        self.email = email

    def __repr__(self):
        return '<E-mail %r>' % self.email

class Category(Base):
    __tablename__ = "categories"
    name = db.Column(db.String(120), unique=True)

    def __init__(self, name):
        self.name = name


class PostCategory(Base):
    """ This class represents an association table for Categories and Posts"""
    __tablename__ = 'categories_posts'
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), index=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), index=True, nullable=False)
    categories = db.relationship('Category', backref=db.backref('categories'))
    posts = db.relationship('Post', backref=db.backref('posts'))

    def __init__(self, category_id=0, post_id=0):
        self.category_id = tag_id
        self.post_id = post_id

class Post(Base):
    __tablename__ = "posts"
    favorite = db.Column(db.Boolean)
    category = db.Column(db.String(120))
    title = db.Column(db.String(55))
    body = db.Column(db.Text())

    def __init__(self, category="random",
                    display_date="today",
                    title="untitled",
                    favorite=False,
                    body=""):
        self.body = body
        self.title = title
        self.category = category
        self.favorite = favorite


    def __repr__(self):
        return 'Title: %r ID: %r Category: %r date added: %r body: %r' % \
                (self.title, self.id, self.category, self.date_added, self.body)


class Home(Resource):

    @cross_origin()
    def get():
        return "Hey what's up"

class Login(Resource):

    def post():
        login = json.loads(request.get_data())
        if login["password"] == "thatfool?heded":
            return jsonify({"rahul": "true"})
        else:
            return jsonify({"rahul": ""})

class PostList(Resource):

    def get(self):
        r = Post.query.options(joinedload('categories')).order_by(Post.date_added.desc()).all()
        response_list = []
        for post in r:
            response_list.append({
                "id": post.id,
                "title": post.title,
                "body": post.body,
                "categories": post.categories,
                "date_added": post.date_added
            })
        return jsonify(response_list)

    # @marshal_with(post)
    def post(self):
        post = json.loads(request.get_data())
        categories = post["categories"]
        category_ids = []
        for category in categories:
            post_category = Category.query.filter_by(name=category.lower()).first()
            if post_category:
                category_ids.append(post_category.id)
            else:
                new_category = Category(name=category)
                db.session.add(new_category)
                db.session.flush()
                db.session.commit()
                category_ids.append(new_category.id)
        new_post = Post(title=post["title"],
                        body=post["body"],
                        favorite=post["favorite"])
        db.session.add(new_post)
        db.session.flush()
        db.session.commit()
        for cat_id in category_ids:
            new_pc = PostCategory(post_id=new_post.id, category_id=cat_id)
            db.session.add(new_pc)
        db.session.flush()
        db.session.commit()
        return { 'id': new_post.id }, 201


class PostDetail(Resource):

    # TODO: Create decorator for fetching posts
    # TODO: Create error code returns (such as if there's no post_id here)
    def get(self, post_id):
        return Post.query.options(joinedload('categories')).filter_by(id=post_id).first()

    def put(self, post_id):
        """
        Delete all existing categories for a post and make new ones
        TODOs:
            - first, create a new branch with the changes here
            - second, test out that this works correctly
            - read SQLAlchemy docs for how to do count
              aggregations + deletions without fetching
            - create an update policy on the front end that
              limits the number of requests to update here
            - maybe create a route here that accepts a request
              from the front end that only happens when the front end
              navigates away from the edit/new post page -- until then
              all changes/updates to the post are stored in memory
            - given the above strategy, refactor this handler to just update
              the in-memory store of the latest set of categories, and only
              do the logic here in the other final handler method.
        """

        post = json.loads(request.get_data())

        # get all the categories of this post
        post_categories = PostCategory.query.filter_by(post_id=post_id).all()

        # get the category ids of the categories
        existing_cat_ids = set([p["category_id"] for p in post_categories])

        # delete all the categories for this post
        for pc in post_categories:
            pc.delete()

        # brute force method to delete orphan categories
        for cat_id in existing_cat_ids:
            another_post = PostCategory.query.filter_by(category_id=cat_id).first()
            if not another_post:
                to_delete = Category.query.filter_by(id=cat_id).first()
                to_delete.delete()

        cat_names_to_create = set(post["categories"].split(","))
        for name in cat_names_to_create:
            old_cat = Category.query.filter_by(name=name).first()
            if not old_cat:
                # create new category
                new_cat = Category(name)
                new_cat.save()
                new_cat_assoc_id = new_cat.id
            else:
                new_cat_assoc_id = old_cat.id
            # create relationship
            new_post_category = PostCategory(category_id=new_cat_assoc_id, post_id=post_id)
            new_post_category.save()

        # update the rest of the post
        old_post = Post.query.filter_by(id=post_id).first()
        if post["old_post_title"] != post["title"]:
            old_post.title = post["title"]
        old_post.body = post["body"]
        old_post.favorite = post["favorite"]
        old_post.save()
        return "true"

    def delete(self, post_id):
        # get the post
        old_post = Post.query.filter_by(id=post_id)
        post_categories = PostCategory.query.filter_by(post_id=post_id).all()
        old_post_category_ids = set([pc["category_id"] for pc in post_categories])
        for pc in post_categories:
            pc.delete()

        for cat_id in old_post_category_ids:
            another_post = PostCategory.query.filter_by(category_id=cat_id).first()
            if not another_post:
                to_delete = Category.query.filter_by(id=cat_id).first()
                to_delete.delete()

        return "true"

class FavoritePosts(Resource):

    def get(self):
        posts = Post.query.filter_by(favorite=True).order_by(Post.date_added.desc()).all()
        response_list = []
        for post in posts:
            response_list.append({
                "id": post.id,
                "title": post.title,
                "body": post.body,
                "category": post.category,
                "date_added": post.date_added
            })
        return jsonify(response_list)

api.add_resource(Home, '/')
api.add_resource(Login, '/login')
api.add_resource(PostList, '/posts')
api.add_resource(PostDetail, '/post/<string:post_id>')
api.add_resource(FavoritePosts, '/posts/favorites')


if __name__ == '__main__':
    app.debug = True
    app.run(threaded=True)
