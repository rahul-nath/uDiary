from __future__ import print_function # In python 2.7
import sys
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from flask.json import jsonify
from flask_sqlalchemy import SQLAlchemy
import json

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
        return '<Post %r>' % (self.title)


# Set "homepage" to index.html
@app.route('/')
@cross_origin()
def index():
    return "Hey what's up"

@app.route('/posts', methods=['GET'])
@cross_origin()
def get_posts():
    r = Post.query.all()
    response_list = []
    for post in r:
        response_list.append({
            "title": post.title,
            "body": post.body
        })
    return jsonify(response_list)

@app.route('/posts/new', methods=['POST'])
@cross_origin()
def create_post():
    post = json.loads(request.get_data())
    new_post = Post(title=post["title"], body=post["body"])
    db.session.add(new_post)
    db.session.commit()
    return "true"

if __name__ == '__main__':
    app.debug = True
    app.run()
