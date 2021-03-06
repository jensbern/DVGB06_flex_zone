from flask import Flask, render_template, request, jsonify
from flask_graphql import GraphQLView
from dotenv import load_dotenv
from os import getenv
from flask_jwt_extended import JWTManager, get_jwt_identity, jwt_required, create_access_token, create_refresh_token
from datetime import timedelta

from db.models import db_session
from db.schema import schema


load_dotenv()
app = Flask(__name__, static_url_path="",
            static_folder="web/static", template_folder="web/templates")

app.config["JWT_SECRET_KEY"] = getenv("JWT_SECRET_KEY")
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.debug = True

jwt = JWTManager(app)


@app.route("/")
@jwt_required(optional=True, locations=['headers', 'cookies'])
def index():
    user = get_jwt_identity()
    return render_template("index.html", logged_in_as=user)

@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True, locations=['headers'])
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@app.route("/user/<string:username>")
@jwt_required(optional=True, locations=['headers', 'cookies'])
def user(username=None, methods=["GET"]):
    user = get_jwt_identity()
    query_string = """
    query($username:String){ 
        staff(username:$username) 
            {
                name
            } 
        }"""
    result = schema.execute(query_string, variables={"username": username})
    user = get_jwt_identity()
    if len(result.data["staff"]) > 0:
        name = result.data["staff"][0]["name"]
        return render_template("user.html", name=name, username=username, logged_in_as=user)
    return render_template("not_found.html")

@app.route("/createuser")
def createuser():
    return render_template("createUser.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.errorhandler(404)
@jwt_required(optional=True, locations=['headers', 'cookies'])
def page_not_found(error):
    user = get_jwt_identity()
    return render_template("not_found.html", message=error, logged_in_as=user)

@app.route("/edituser/<string:username>")
@jwt_required(locations=['headers', 'cookies'])
def edituser(username=None):
    query_string = """
        query($username:String) { 
            staff(username:$username) 
            {
                name
            } 
        }"""
    result = schema.execute(query_string, variables={"username": username})
    user = get_jwt_identity()
    if len(result.data["staff"]) > 0:
        if user == username:
            return render_template("createUser.html", username=username, logged_in_as=user)
        else:
            return render_template("login.html")
    return render_template("not_found.html", message="User not found", logged_in_as=user)

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True
    ))


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


# start (Powershell):
# . .\env\Scripts\activate

if __name__ == "__main__":
    app.run()
