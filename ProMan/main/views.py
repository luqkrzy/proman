from flask import render_template, request, Blueprint, jsonify, session, flash, redirect, url_for
from flask_login import login_required
from ProMan import data_manager


main = Blueprint('main', __name__)


@main.route("/", methods=['GET', 'POST'])
@login_required
def route_home():
    # flash('some message', 'danger')

    return render_template('index.html')



@main.route("/board-list", methods=['GET', 'POST'])
def route_board_list():
    # flash('some message', 'danger')

    return render_template('index-board-list.html')

