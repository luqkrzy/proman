from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from ProMan.config import Config, DevelopmentConfig, ProductionConfig

db = SQLAlchemy()
ma = Marshmallow()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.login_view = 'users.route_login'
login_manager.login_message_category = 'info'


def create_app(config_class=ProductionConfig):
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    app.url_map.strict_slashes = False
    from ProMan.users.views import users
    from ProMan.board_single.views import board
    from ProMan.boards.views import boards
    from ProMan.errors.handlers import errors
    app.register_blueprint(boards)
    app.register_blueprint(users)
    app.register_blueprint(board)
    app.register_blueprint(errors)
    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    return app


from ProMan import db_manager
