from __future__ import print_function # In python 2.7
import sys
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='../static', template_folder='../static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/blog'
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
    text = db.Column(db.Text())
    post_type = db.Column(String(120))

    def __init__(self, text):
        self.text = text

    def __repr__(self):
        return '<Post %r>' % self.text


# Set "homepage" to index.html
@app.route('/')
def index():
    return "Hey what's up"

@app.route('/posts', methods=['GET'])
def get_posts():
    if request.method == 'GET' and request.args['type']:
        post_type = request.args['type']
        results = db.session.query(Post).filter(Post.type == post_type)
        for instance in results:
            print("here are the results", instance, file=sys.stderr)
        return results
    return "nothing"

# Save e-mail to database and send to success page
@app.route('/posts/create', methods=['POST'])
def create_post():
    post = None
    if request.method == 'POST':
        post = request.form['post']
        new_post = Post(post)
        db.session.add(new_post)
        db.session.commit()
        return "success"
    return "failure"

if __name__ == '__main__':
    app.debug = True
    app.run()
