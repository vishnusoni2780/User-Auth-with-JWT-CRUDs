from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(11),primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)
    about = db.Column(db.Text, nullable=False)
    
    def __init__(self,name,email,passwd,about):
        self.name = name
        self.email = email
        self.password = generate_password_hash(passwd)
        self.about = about
    
    def check_passwd(self,passwd):
        return check_password_hash(self.password,passwd)
    

class Items(db.Model):
    __tablename__ = "items"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)
    date = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__(self,name,price):
        self.name = name
        self.price = price
