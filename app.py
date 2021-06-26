from flask import Flask, render_template
from flask_graphql import GraphQLView

from db.models import db_session
from db.login import check_login
from db.schema import schema, Staff, Experience

app = Flask(__name__, static_url_path="",
            static_folder="web/static", template_folder="web/templates")

app.debug = True


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/user/<int:userid>")
def user(userid=None):
    query_string = "{{ staff(id:{0}) {{name}} }}".format(userid)
    result = schema.execute(query_string)
    if len(result.data["staff"]) > 0:
        name = result.data["staff"][0]["name"]
        return render_template("user.html", username=name, userid=userid)
    return render_template("not_found.html")

@app.route("/createuser")
def createuser():
    return render_template("createUser.html")

@app.route("/login", methods=["POST"])
def login():
    if check_login(username, password):
        return "logged in"
    else:
        return "wrong password/username"

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
