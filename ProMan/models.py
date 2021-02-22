from datetime import datetime
from ProMan import db, login_manager, ma
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    register_date = db.Column(db.DateTime, default=datetime.now().replace(microsecond=0).isoformat())


    def __repr__(self):
        return f'{self.id}, {self.email}, {self.password}'


class UsersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Users
