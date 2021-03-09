from flask import render_template, Blueprint
from flask_login import login_required

main = Blueprint('main', __name__)

@main.route("/", methods=['GET', 'POST'])
@login_required
def route_home():

    return render_template('index.html')
