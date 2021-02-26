from flask import render_template, request, Blueprint, jsonify, session, flash, redirect, url_for
from ProMan import data_manager


boards = Blueprint('boards', __name__)

@boards.route("/boards", methods=['GET', 'POST'])
def route_display_boards():
    return render_template('boards.html')



@boards.route("/get-boards", methods=['GET', 'POST'])
def route_get_boards():
    boards = data_manager.get_boards()
    print(boards)

    return boards
