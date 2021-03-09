from flask import jsonify
from flask_login import current_user
from typing import Dict

from ProMan import db


def is_authorized(func):
    def check_user_authenticated(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({'message': 'Unauthorized access'})
        return func(*args, **kwargs)

    return check_user_authenticated


def commit_to_database(data):
    try:
        db.session.add(data)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        db.session.rollback()
        return False


def commit_and_return_id(data: dict) -> Dict or bool:
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
