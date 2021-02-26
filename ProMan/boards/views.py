from flask import render_template, request, Blueprint, jsonify, session, flash, redirect, url_for
from ProMan import data_manager


boards = Blueprint('boards', __name__)


@boards.route("/api/get-boards", methods=['GET'])
def api_get_boards():
    boards = data_manager.get_boards()
    return boards


@boards.route("/api/add_board", methods=['PUT'])
def api_add_board():
    new_board = request.get_json()
    resp = data_manager.add_new_board(new_board)
    return jsonify(resp)


@boards.route("/board", methods=["GET", "POST"])
def route_board():
    return render_template('board.html')
