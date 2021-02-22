from flask import Blueprint, render_template, url_for, redirect, request, flash, session, jsonify
from ProMan import  data_manager

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


@users.route("/check-user", methods=['GET', 'POST'])
def route_check_user_login_details():
    data = request.get_json()
    print(data)
    try:
        result = data_manager.check_password_match(data)
        return jsonify(result)
    except Exception as e:
        return jsonify(e)


