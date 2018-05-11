from __future__ import print_function # In python 2.7
import sys
from flask import Flask, render_template, request
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
    category = db.Column(db.String)
    display_date = db.Column(db.String)
    date_added = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    title = db.Column(db.Text)  
    body = db.Column(db.Text)

    def __init__(self, category="random", 
                    display_date="today", 
                    title="untitled",
                    body=""):
        self.body = body
        self.title = title
        self.category = category
        self.display_date = display_date

    def __repr__(self):
        return '<Post %r>' % (self.title)


# Set "homepage" to index.html
@app.route('/')
@cross_origin()
def index():
    return "Hey what's up"

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    login = json.loads(request.get_data())
    if login["password"] == "thatfuckinfool?heded":
        return jsonify({"rahul": "true"})
    else:
        return jsonify({"rahul": ""})


@app.route('/posts', methods=['GET'])
@cross_origin()
def get_posts():
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

@app.route('/posts/new', methods=['POST'])
@cross_origin()
def create_post():
    post = json.loads(request.get_data())
    new_post = Post(title=post["title"], body=post["body"], category=post["category"])
    db.session.add(new_post)
    db.session.commit()
    return "true"

@app.route('/posts/edit', methods=['POST'])
@cross_origin()
def edit_post():
    post = json.loads(request.get_data())
    old_post = Post.query.filter_by(title=post["old_post_title"]).first()
    print(post["old_post_title"], post["title"])
    if post["old_post_title"] != post["title"]:
        old_post.title = post["title"]
    old_post.body = post["body"]
    old_post.category = post["category"]
    db.session.commit()
    return "true"

@app.route('/posts/delete', methods=['POST'])
@cross_origin()
def delete_post():
    # get the post
    post = json.loads(request.get_data())
    Post.query.filter_by(title=post["old_post_title"]).delete()
    # save the change
    db.session.commit()
    return "true"    

if __name__ == '__main__':
    app.debug = True
    app.run(threaded=True)
