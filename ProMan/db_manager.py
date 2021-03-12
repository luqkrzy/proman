from flask import jsonify
from flask_login import current_user
from typing import Dict

from ProMan import db


def is_authorized(func):
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({'message': 'Unauthorized access'})
        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper


def commit_to_database(data):
    try:
        db.session.add(data)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        db.session.rollback()
        return False


def commit_and_return_id(data) -> Dict or bool:
    try:
        db.session.add(data)
        db.session.commit()
        return {'id': data.id}
    except Exception as e:
        print(e)
        db.session.rollback()
        return False


def update_to_database() -> bool:
    try:
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        db.session.rollback()
        return False
