from flask import render_template, Blueprint, request, Response, jsonify
from flask_login import login_required
from ProMan.boards import data_handler
from ProMan.db_manager import is_authorized

boards = Blueprint('boards', __name__)


@boards.route("/", methods=['GET', 'POST'])
@login_required
def route_home():
    return render_template('index.html')


@boards.route("/api/user/<int:user_id>/boards", methods=['GET'])
@is_authorized
def api_get_boards(user_id: int) -> Response:
    resp = data_handler.get_boards_by_user_id(user_id)
    return jsonify(resp)


@boards.route("/api/user/<int:user_id>/boards", methods=['POST'])
@is_authorized
def api_add_board(user_id: int) -> Response:
    new_board = request.get_json()
    resp = data_handler.add_new_board(new_board, user_id)
    return jsonify(resp)


@boards.route("/api/user/<int:user_id>/boards/<int:board_id>", methods=["DELETE"])
@is_authorized
def api_delete_board(user_id: int, board_id: int) -> Response:
    owner_id = data_handler.get_board_owner_id(board_id)
    if owner_id == user_id:
        resp = data_handler.delete_board(board_id)
        return jsonify(resp)
    return jsonify('unauthorized')
