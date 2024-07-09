from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(),primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)
    about = db.Column(db.Text, nullable=False)

    roles = db.relationship("Role", secondary="user_roles", back_populates="users")
    item_id = db.relationship("Item", backref='users', lazy='dynamic')
    
    def __init__(self,name,email,passwd,about):
        self.name = name
        self.email = email
        self.password = generate_password_hash(passwd)
        self.about = about
    
    def check_passwd(self,passwd):
        return check_password_hash(self.password,passwd)
    
    def has_role(self, role):
        return bool(
            Role.query
            .join(Role.users)
            .filter(User.id == self.id)
            .filter(Role.slug == role)
            .count() == 1
        )
    

class Role(db.Model):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(36), nullable=False)
    slug = db.Column(db.String(36), nullable=False, unique=True)
    users = db.relationship("User", secondary="user_roles", back_populates="roles")


class UserRole(db.Model):
    __tablename__ = 'user_roles'
    user_id = db.Column(db.String(), db.ForeignKey("users.id"), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), primary_key=True)
    
    def __init__(self,user_id,role_id):
        self.user_id = user_id
        self.role_id = role_id


class Item(db.Model):
    __tablename__ = "items"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)
    date = db.Column(db.DateTime, default = datetime.datetime.now)
    user_id = db.Column(db.String(), db.ForeignKey("users.id"))

    def __init__(self,name,price,uid):
        self.name = name
        self.price = price
        self.user_id = uid
