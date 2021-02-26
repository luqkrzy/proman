from flask import render_template, request, Blueprint, jsonify, session, flash, redirect, url_for
from ProMan import data_manager


boards = Blueprint('boards', __name__)

@boards.route("/boards", methods=['GET', 'POST'])
def route_boards():
    return render_template('boards.html')


@boards.route("/api/get-boards", methods=['GET'])
def api_get_boards():
    boards = data_manager.get_boards()
    return boards


@boards.route("/api/add_board", methods=['PUT'])
def api_add_board():
    new_board = request.get_json()
    print(new_board)
    pass

