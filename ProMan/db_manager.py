from typing import Dict
from ProMan import db

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
