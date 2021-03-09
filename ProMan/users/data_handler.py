from ProMan.models import UsersSchema, Users
from ProMan import bcrypt
from ProMan import db_manager

user_schema = UsersSchema()

def register_new_user(data) -> bool:
    email = data['email']
    name = data['name']
    password = data['password']
    user = Users(email=email, name=name, password=bcrypt.generate_password_hash(password).decode('utf-8'))
    return db_manager.commit_to_database(user)


def find_user_by_email(email: str) -> Users:
    user = Users.query.filter_by(email=email).first()
    return user


