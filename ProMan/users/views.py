from flask import Blueprint, render_template, url_for, redirect, request, flash, session, jsonify
from flask_login import current_user, login_user, logout_user, login_required
from ProMan import data_manager, bcrypt


users = Blueprint('users', __name__)


@users.route("/register", methods=['GET', 'POST'])
def route_register():

    new_user = {'email': 'lusds@wp.pl' , 'password': 'root',}
    data_manager.register_new_user(new_user=new_user)

    return 'register'


@users.route("/check", methods=['GET', 'POST'])
def route_check():
    user = data_manager.find_user_by_email('laszlo@wp.pl')
    return user


@users.route("/login", methods=['GET', 'POST'])
def route_login():

    return render_template('login.html')


@users.route("/api/login", methods=['GET', 'POST'])
def route_check_user_login_details():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = data_manager.find_user_by_email(email)
    try:
        if user and bcrypt.check_password_hash(pw_hash=user.password, password=password):
            login_user(user)
            print(dir(current_user))
            return jsonify(True)
        else:
            return jsonify(False)
    except Exception as e:
        return jsonify(e)

@users.route("/logout")
def route_logout():
    logout_user()
    return redirect(url_for('main.route_home'))


