from ProMan.models import UsersSchema, Users
from ProMan import bcrypt
from ProMan import db_manager

user_schema = UsersSchema()


def register_new_user(data):
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    user = Users(email=email, name=name, password=bcrypt.generate_password_hash(password).decode('utf-8'))
    return db_manager.commit_to_database(user)


def find_user_by_email(email):
    user = Users.query.filter_by(email=email).first()
    return user


