
from app import db

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

