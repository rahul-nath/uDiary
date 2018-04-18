from __future__ import print_function # In python 2.7
import sys
from routes import routes
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from flask.json import jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate
from models import Post
import json

app = Flask(__name__, static_folder='../static', template_folder='../static')
cors = CORS(app)
app.config.from_object(Config)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/local_blog'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import routes, models
if __name__ == '__main__':
    app.debug = True
    app.run()
