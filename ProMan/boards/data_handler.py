from typing import List, Dict
from ProMan.models import BoardsSchema
from ProMan.models import Boards
from ProMan import db_manager

board_schema = BoardsSchema(many=True)


def get_board_owner_id(board_id: int) -> int:
    try:
        owner_id = Boards.query.filter_by(id=board_id).with_entities(Boards.owner_id).first()
        return owner_id[0]
    except Exception as e:
        print(e)


def get_boards_by_user_id(user_id: int) -> List[Dict]:
    try:
        boards = Boards.query.filter_by(owner_id=user_id).all()
        dump_boards = board_schema.dump(boards)
        return dump_boards
    except Exception as e:
        print(e)


def add_new_board(data: dict, user_id: int) -> bool:
    name = data['name']
    note = data['note']
    board = Boards(name=name, owner_id=user_id, note=note)
    return db_manager.commit_to_database(board)


def delete_board(board_id: int) -> bool:
    Boards.query.filter_by(id=board_id).delete()
    return db_manager.update_to_database()
