from flask import jsonify
from ProMan import db
from ProMan.models import UsersSchema, BoardsSchema, CardsSchema, ColumnsSchema
from ProMan.models import Users, Boards, Cards, Columns
from ProMan import bcrypt

user_schema = UsersSchema()
board_schema = BoardsSchema()
card_schema = CardsSchema()
column_schema = ColumnsSchema()


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



def get_board_owner_id(board_id):
    try:
        owner_id = Boards.query.filter_by(id=board_id).with_entities(Boards.owner_id).first()
        return owner_id[0]
    except Exception as e:
        print(e)


def delete_board(board_id):
    Boards.query.filter_by(id=board_id).delete()
    return update_to_database()


def get_boards(user_id: int):
    try:
        boards = Boards.query.filter_by(owner_id=user_id).all()
        dump_boards = [board_schema.dump(board) for board in boards]
        return dump_boards
    except Exception as e:
        return e


def add_new_board(data, user_id):
    name = data.get('name')
    note = data.get('note')
    board = Boards(name=name, owner_id=user_id, note=note)
    return commit_to_database(board)





def get_cols(board_id):
    try:
        columns = Columns.query.filter_by(board_id=board_id).all()
        dump_cols = [column_schema.dump(column) for column in columns]
        return jsonify(dump_cols)
    except Exception as e:
        return jsonify(e)


def add_new_column(data):
    name = data.get('name')
    owner_id = data.get('owner_id')
    board_id = data.get('board_id')
    column = Columns(name=name, owner_id=owner_id, board_id=board_id)
    return commit_to_database(column)


def add_new_card(data):
    name = data.get('name')
    owner_id = data.get('owner_id')
    board_id = data.get('board_id')
    column_id = data.get('column_id')
    card = Cards(name=name, owner_id=owner_id, board_id=board_id, column_id=column_id)
    return commit_to_database(card)


def get_cards(column_id):
    try:
        cards = Cards.query.filter_by(column_id=column_id).all()
        dump_cards = [card_schema.dump(card) for card in cards]
        return jsonify(dump_cards)
    except Exception as e:
        return jsonify(e)
