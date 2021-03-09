from ProMan import db, login_manager, ma
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String())
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'{self.id}, {self.email}, {self.name}'


class UsersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Users


class Boards(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String())
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    note = db.Column(db.String())

    def __repr__(self):
        return f'{self.id}, {self.name}, {self.owner_id}, {self.note}'


class BoardsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Boards


class Cards(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String())
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'))
    column_id = db.Column(db.Integer, db.ForeignKey('columns.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    index = db.Column(db.Integer)

    def __repr__(self):
        return f'{self.id}, {self.name}, {self.board_id}, {self.column_id}, {self.owner_id}, {self.index}'


class CardsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('id', 'name', 'board_id', 'column_id', 'owner_id', 'index')


class Columns(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String())
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    board_id = db.Column(db.Integer, db.ForeignKey('boards.id'))
    index = db.Column(db.Integer)

    def __repr__(self):
        return f'{self.id}, {self.name}, {self.owner_id}, {self.board_id}, {self.index}'


class ColumnsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Columns
