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
    return user



