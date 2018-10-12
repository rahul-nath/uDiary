from __future__ import print_function # In python 2.7

from flask_restful import Resource, Api, fields, marshal_with
from flask import Flask, render_template, request

import sys
from flask_cors import CORS, cross_origin
from flask.json import jsonify
from flask_sqlalchemy import SQLAlchemy
import json
import datetime


app = Flask(__name__, static_folder='../static', template_folder='../static')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/local_blog'
db = SQLAlchemy(app)
api = Api(app)

# Create our database model
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), unique=True)

    def __init__(self, email):
        self.email = email

    def __repr__(self):
        return '<E-mail %r>' % self.email

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(120))
    display_date = db.Column(db.String(55))
    date_added = db.Column(db.Date())
    title = db.Column(db.String(55))
    body = db.Column(db.Text())

    def __init__(self, category="random",
                    display_date="today",
                    title="untitled",
                    body=""):
        self.body = body
        self.title = title
        self.category = category
        self.display_date = display_date

    def __repr__(self):
        return '<Post %r %r %r>' % (self.title, self.id, self.category)

# post = {
#     'id': fields.Integer,
#     'vendor': fields.String,
#     'tracking_number': fields.String,
#     'pods_list': fields.List(fields.Integer),
#     'pelican_cases_list': fields.List(fields.Integer),
#     'gateways_list': fields.List(fields.Integer)
# }

class Home(Resource):

    @cross_origin()
    def get():
        return "Hey what's up"

class Login(Resource):

    def post():
        login = json.loads(request.get_data())
        if login["password"] == "thatfuckinfool?heded":
            return jsonify({"rahul": "true"})
        else:
            return jsonify({"rahul": ""})

class PostList(Resource):

    def get(self):
        r = Post.query.order_by(Post.date_added.desc()).all()
        response_list = []
        for post in r:
            response_list.append({
                "id": post.id,
                "title": post.title,
                "body": post.body,
                "category": post.category
            })
        return jsonify(response_list)

    # @marshal_with()
    def post(self):
        post = json.loads(request.get_data())
        new_post = Post(title=post["title"], body=post["body"], category=post["category"])
        db.session.add(new_post)
        db.session.flush()
        db.session.commit()
        return { 'id': new_post.id }, 201


class PostDetail(Resource):

    def put(self, post_id):
        post = json.loads(request.get_data())
        old_post = Post.query.filter_by(id=post_id).first()
        if post["old_post_title"] != post["title"]:
            old_post.title = post["title"]
        old_post.body = post["body"]
        old_post.category = post["category"]
        db.session.commit()
        return "true"

    def delete(self, post_id):
        # get the post
        post = json.loads(request.get_data())
        Post.query.filter_by(id=post_id).delete()
        # save the change
        db.session.commit()
        return "true"

api.add_resource(Home, '/')
api.add_resource(Login, '/login')
api.add_resource(PostList, '/posts')
api.add_resource(PostDetail, '/post/<string:post_id>')


if __name__ == '__main__':
    app.debug = True
    app.run(threaded=True)
