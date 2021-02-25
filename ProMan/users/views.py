from flask import Blueprint, render_template, url_for, redirect, request, flash, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from ProMan import data_manager, bcrypt
from ProMan.models import UsersSchema
users_schema = UsersSchema()
users = Blueprint('users', __name__)


@users.route("/login", methods=['GET', 'POST'])
def route_login():
    return render_template('login.html')


@users.route("/logout")
def route_logout():
    logout_user()
    return redirect(url_for('main.route_home'))


@users.route("/api/login", methods=['POST'])
def route_check_user_login_details():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = data_manager.find_user_by_email(email)
    try:
        if user and bcrypt.check_password_hash(pw_hash=user.password, password=password):
            login_user(user)
            return jsonify(True)
        else:
            return jsonify(False)
    except Exception as e:
        return jsonify(e)


@users.route("/api/register", methods=['PUT'])
def route_register():
    data = request.get_json()
    resp = data_manager.register_new_user(data)
    return jsonify(resp)


@users.route('/api/user/<email>', methods=['GET'])
def api_check_user_in_database(email):
    try:
        user = data_manager.find_user_by_email(email)
        if user:
            return jsonify(True)
        else:
            return jsonify(False)
    except Exception as e:
        return jsonify(e)


@users.route('/api/users/', methods=['GET'])
def api_find_all_users():
    try:
        all_users = data_manager.find_all_users()
        dump_users = [users_schema.dump(user) for user in all_users]
        return jsonify(dump_users)
    except Exception as e:
        return jsonify(e)
