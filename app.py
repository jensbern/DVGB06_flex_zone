from flask import Flask, render_template
from flask_graphql import GraphQLView

from db.models import db_session
from db.schema import schema, Staff, Experience

app = Flask(__name__, static_url_path="",
            static_folder="web/static", template_folder="web/templates")

app.debug = True


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/user/<int:id>")
def user(id=None):
    print(id)
    return render_template("user.html", username="Pelle", userid=id)

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


#start (Powershell):
# . .\env\Scripts\activate