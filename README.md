# DVGB06_flex_zone
Project in course DVGB06 TIllämpad Programmering

## Made by using the following:
* [Flask](https://flask.palletsprojects.com/en/2.0.x/)
* [GraphQL](https://graphql.org/)
* [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

### Libraries:
* [Flask](https://flask.palletsprojects.com/en/2.0.x/)
* [SQLAlchemy](https://pypi.org/project/SQLAlchemy/)
* [graphene_sqlalchemy](https://docs.graphene-python.org/projects/sqlalchemy/en/latest/)
* [Flask-GraphQL](https://pypi.org/project/Flask-GraphQL/)
* [flask-jwt-extended](https://pypi.org/project/Flask-JWT-Extended/)
* [Bcrypt](https://pypi.org/project/bcrypt/)
* [python-dotenv](https://pypi.org/project/python-dotenv/)

### For development
* [virtualenv](https://pypi.org/project/virtualenv/)
* [alembic](https://alembic.sqlalchemy.org/en/latest/)


### Setup:
1. Install Python

[Download](https://www.python.org/downloads/) and install Python > 3.8.x

2. Setup virtualenv

```
pip install virtualenv
virtualenv env
```
Enter environment (in PowerShell):
```
. .\env\Scripts\activate
```
3. Create .env file

create a file named `.env` which holds your secret jwt key. e.g.:
```
JWT_SECRET_KEY=secret_key_here
```
4. Install packages:

```
pip install flask
pip install SQLAlchemy
pip install graphene_sqlalchemy
pip install Flask-GraphQL
pip install Flask-JWT-Extended
pip install bcrypt
pip install python-dotenv
```

5. Create some dummy users:
Run file [create_data.py](create_data.py)  e.g. 

```
py create_data.py
```
6. Start flask-server:
(in Powershell)
```
$Env:FLASK_APP = "app.py"
$Env:FLASK_ENV = "development"
flask run
```
