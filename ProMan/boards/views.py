from flask import render_template, request, Blueprint, jsonify, session, flash, redirect, url_for
from ProMan import data_manager

boards = Blueprint('boards', __name__)
cards =Blueprint('cards', __name__)

@boards.route("/api/get-boards/<user_id>", methods=['GET'])
def api_get_boards(user_id):
    boards = data_manager.get_boards(user_id)
    return boards


@boards.route("/api/add_board", methods=['PUT'])
def api_add_board():
    new_board = request.get_json()
    resp = data_manager.add_new_board(new_board)
    return jsonify(resp)


@boards.route("/api/board/<board_id>", methods=["DELETE"])
def api_delete_board(board_id):
    #tutaj chyba musi dostać board id i przekazać dalej
    id = board_id
    print(id)
    # resp = data_manager.delete_board(id)
    # return jsonify(resp)


@boards.route("/board/<board_id>", methods=["GET", "POST"])
def route_board(board_id):
    return render_template('board.html')


@boards.route("/api/get-cols/<user_id>", methods=['GET'])
def api_get_cols(user_id):
    columns = data_manager.get_cols(user_id)
    return columns


@boards.route("/api/add_column", methods=['PUT'])
def api_add_column():
    new_column = request.get_json()
    resp = data_manager.add_new_column(new_column)
    return jsonify(resp)


@boards.route("/api/add_card", methods=['PUT'])
def api_add_card():
    new_card = request.get_json()
    resp = data_manager.add_new_card(new_card)
    return jsonify(resp)


@boards.route("/api/get-cards<column_id>", methods=['GET'])
def api_get_cards(column_id):
    items = data_manager.get_cards(column_id)
    return items

# @boards.route("/api/get-cards/<board_id>", methods=['GET'])
# def api_get_cards(board_id):
#     cards = data_manager.get_cards(board_id)
#     return cards
#
#
# @boards.route("/api/get-columns/<board_id>", methods=['GET'])
# def api_get_columns(board_id):
#     columns = data_manager.get_columns(board_id)
#     return columns
#

