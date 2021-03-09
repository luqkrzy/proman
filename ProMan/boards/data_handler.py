from ProMan.models import BoardsSchema, CardsSchema, ColumnsSchema
from ProMan.models import Boards, Cards, Columns
from ProMan import db_manager

board_schema = BoardsSchema(many=True)
card_schema = CardsSchema(many=True)
column_schema = ColumnsSchema(many=True)



def get_board_owner_id(board_id):
    try:
        owner_id = Boards.query.filter_by(id=board_id).with_entities(Boards.owner_id).first()
        return owner_id[0]
    except Exception as e:
        print(e)



def get_board_by_id(board_id:int):
    try:
        board = Boards.query.filter_by(id=board_id).with_entities(Boards.id).first()
        return board.id
    except Exception as e:
        print(e)



def delete_board(board_id:int):
    Boards.query.filter_by(id=board_id).delete()
    return db_manager.update_to_database()


def get_boards_by_user_id(user_id: int):
    try:
        boards = Boards.query.filter_by(owner_id=user_id).all()
        dump_boards = board_schema.dump(boards)
        return dump_boards
    except Exception as e:
        return e


def add_new_board(data, user_id):
    name = data.get('name')
    note = data.get('note')
    board = Boards(name=name, owner_id=user_id, note=note)
    return db_manager.commit_to_database(board)


def get_cols(board_id):
    try:
        columns = Columns.query.filter_by(board_id=board_id).all()
        dump_cols = column_schema.dump(columns)
        return dump_cols
    except Exception as e:
        return e


def add_new_column(data):
    name = data.get('name')
    owner_id = data.get('owner_id')
    board_id = data.get('board_id')
    column = Columns(name=name, owner_id=owner_id, board_id=board_id)
    return db_manager.commit_and_return_id(column)


def add_new_card(data):
    name = data.get('name')
    owner_id = data.get('owner_id')
    board_id = data.get('board_id')
    column_id = data.get('column_id')
    index = data.get('index')
    card = Cards(name=name, owner_id=owner_id, board_id=board_id, column_id=column_id, index=index)
    return db_manager.commit_and_return_id(card)


def get_cards(column_id: int):
    try:
        cards = Cards.query.filter_by(column_id=column_id).all()
        dump_cards = card_schema.dump(cards)
        return dump_cards
    except Exception as e:
        return e


def delete_column(column_id):
    Columns.query.filter_by(id=column_id).delete()
    return db_manager.update_to_database()


def update_card(card_id, column_id):
    # przekazane poprawne dane
    # nie chcą updatować się do bazy
    card = Cards.query.filter_by(id=card_id).first()
    print(column_id['column_id'])
    card['column_id'] = int(column_id['column_id'])
    return db_manager.commit_to_database(card)


def update_card_name(card_id, new_name):
    # przekazane poprawne dane
    # nie chcą updatować się do bazy
    card = Cards.query.filter_by(id=card_id).first()
    card['name'] = new_name['name']
    return db_manager.commit_to_database(card)
