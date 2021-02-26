from flask import jsonify
from ProMan import db
from ProMan.models import UsersSchema, BoardsSchema
from ProMan.models import Users, Boards
from ProMan import bcrypt

user_schema = UsersSchema()
board_schema = BoardsSchema()


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


def get_boards():
    try:
        boards = Boards.query.all()
        dump_boards = [board_schema.dump(board) for board in boards]
        return jsonify(dump_boards)
    except Exception as e:
        return jsonify(e)


def add_new_board(data):
    name = data.get('name')
    note = data.get('note')
    owner_id = data.get('owner_id')
    board = Boards(name=name, owner_id=owner_id, note=note)
    return commit_to_database(board)
