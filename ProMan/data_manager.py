from flask import jsonify
from ProMan import db
from ProMan.models import UsersSchema
from ProMan.models import Users
from ProMan import bcrypt

user_schema = UsersSchema()


def commit_to_database(data) -> None:
    try:
        db.session.add(data)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()


def update_to_database() -> None:
    try:
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()


def register_new_user(new_user: dict) -> None:
    user = Users(email=new_user.get('email'), password=new_user.get('password'))
    commit_to_database(user)


def find_user_by_email(email):
    user = Users.query.filter_by(email=email).first()
    output = user_schema.dump(user)
    return jsonify(output)


def check_password_match(data):
    email = data.get('email')
    password = data.get('password')
    hashed_password = Users.query.with_entities(Users.password).filter_by(email=email).first()
    print(hashed_password)
    print(type(hashed_password))

    if len(hashed_password) == 0 or not bcrypt.check_password_hash(hashed_password.password, password):
        return False
    else:
        return True

