from typing import List, Dict
from ProMan.models import BoardsSchema, CardsSchema, ColumnsSchema
from ProMan.models import Boards, Cards, Columns
from ProMan import db_manager

board_schema = BoardsSchema(many=True)
card_schema = CardsSchema(many=True)
column_schema = ColumnsSchema(many=True)


def get_board_by_id(board_id: int) -> int or None:
    try:
        board = Boards.query.filter_by(id=board_id).with_entities(Boards.id).first()
        return board.id
    except Exception as e:
        print(e)


def get_columns(board_id: int) -> List[Dict]:
    try:
        columns = Columns.query.filter_by(board_id=board_id).all()
        dump_cols = column_schema.dump(columns)
        return dump_cols
    except Exception as e:
        print(e)


def add_new_column(data: dict) -> Dict or bool:
    name = data['name']
    owner_id = data['owner_id']
    board_id = data['board_id']
    column = Columns(name=name, owner_id=owner_id, board_id=board_id)
    return db_manager.commit_and_return_id(column)


def delete_column(column_id: int) -> bool:
    Columns.query.filter_by(id=column_id).delete()
    return db_manager.update_to_database()


def get_cards(column_id: int):
    try:
        cards = Cards.query.filter_by(column_id=column_id).order_by(Cards.index.asc()).all()
        dump_cards = card_schema.dump(cards)
        return dump_cards
    except Exception as e:
        print(e)


def add_new_card(data: dict) -> Dict or bool:
    name = data['name']
    owner_id = data['owner_id']
    board_id = data['board_id']
    column_id = data['column_id']
    index = data['index']
    card = Cards(name=name, owner_id=owner_id, board_id=board_id, column_id=column_id, index=index)
    return db_manager.commit_and_return_id(card)


def update_card(card_id: int, column_id: int) -> bool:
    card = Cards.query.filter_by(id=card_id).first()
    card['column_id'] = int(column_id['column_id'])
    return db_manager.commit_to_database(card)


def update_card_name(card_id: int, new_name: int) -> bool:
    card = Cards.query.filter_by(id=card_id).first()
    card.name = new_name['name']
    return db_manager.commit_to_database(card)


def delete_card(card_id: int) -> bool:
    Cards.query.filter_by(id=card_id).delete()
    return db_manager.update_to_database()
