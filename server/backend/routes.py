from app import app

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

@app.route('/posts/edit', methods=['POST'])
@cross_origin()
def edit_post():
    post = json.loads(request.get_data())
    old_post = Post.query.filter_by(title=post["title"]).first()
    old_post.body = post["body"]
    db.session.commit()
    return "true"