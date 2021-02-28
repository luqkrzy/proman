from flask import jsonify
from ProMan import db
from ProMan.models import UsersSchema, BoardsSchema
from ProMan.models import Users, Boards
from ProMan import bcrypt

user_schema = UsersSchema()
board_schema = BoardsSchema()


def commit_to_database(data):
    try:
        db.session.add(data)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        db.session.rollback()
        return False


def update_to_database():
    try:
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        db.session.rollback()
        return False


def register_new_user(data):
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    user = Users(email=email, name=name, password=bcrypt.generate_password_hash(password).decode('utf-8'))
    return commit_to_database(user)


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


def delete_board(data):
    board_id = data.get('board_id')
    Boards.query.filter_by(id=id).delete()
    update_to_database()
