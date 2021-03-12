from flask import Blueprint, render_template, url_for, redirect, request, jsonify, Response
from flask_login import current_user, login_user, logout_user
from ProMan import bcrypt
from ProMan.users import data_handler
from ProMan.models import UsersSchema
from ProMan.db_manager import is_authorized

users_schema = UsersSchema()
users = Blueprint('users', __name__)


@users.route("/login", methods=['GET'])
def route_login():
    return render_template('login.html')


@users.route("/logout")
def route_logout():
    logout_user()
    return redirect(url_for('boards.route_home'))


@users.route("/api/login", methods=['POST'])
def api_check_user_login_details() -> Response:
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = data_handler.find_user_by_email(email)
    try:
        if user and bcrypt.check_password_hash(pw_hash=user.password, password=password):
            login_user(user)
            return jsonify(True)
        else:
            return jsonify(False)
    except Exception as e:
        print(e)
        return jsonify(e)


@users.route("/api/register", methods=['PUT'])
def api_register_user() -> Response:
    data = request.get_json()
    resp = data_handler.register_new_user(data)
    return jsonify(resp)


@users.route('/api/user/<email>', methods=['GET'])
@is_authorized
def api_check_user_in_database(email: str) -> Response:
    try:
        user = data_handler.find_user_by_email(email)
        if user:
            return jsonify(True)
        else:
            return jsonify(False)
    except Exception as e:
        return jsonify(e)


@users.route('/api/current-user/', methods=['GET'])
@is_authorized
def api_get_current() -> Response:
    if current_user.is_authenticated:
        return jsonify(users_schema.dump(current_user))
    else:
        return jsonify('anonymous')
