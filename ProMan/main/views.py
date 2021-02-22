from flask import render_template, request, Blueprint, jsonify, session, flash, redirect, url_for
from ProMan import data_manager


main = Blueprint('main', __name__)


@main.route("/", methods=['GET', 'POST'])
def route_home():
    # flash('some message', 'danger')

    return render_template('index.html')

