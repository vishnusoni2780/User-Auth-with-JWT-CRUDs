from flask import Flask, request, jsonify, session
from flask_jwt_extended import create_access_token, get_jwt_identity, create_refresh_token, jwt_required, JWTManager,set_access_cookies, unset_jwt_cookies
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from models import db,User,Items
import datetime,time
from jose import jwt as jjwt
from jose.exceptions import ExpiredSignatureError, JWTError

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["SECRET_KEY"]='mysec'
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///user_auth_jwt.sqlite3"
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

Migrate(app, db)
ma = Marshmallow(app)
jwt = JWTManager(app)
db.init_app(app)
with app.app_context():
    db.create_all()

class ItemSchema(ma.Schema):
    class Meta:
        fields = ("id","name","price","date")
item_schema = ItemSchema()
items_schema = ItemSchema(many=True)

@app.route('/')
def index():
    return {"msg": "User Authentication with JWT Token : Flask + React + SQLite3 DB Project"}

@app.route('/signup', methods=['POST'])
def signup():
    name = request.json.get("name")
    email = request.json.get("email")
    passwd = request.json.get("password")
    about = request.json.get("about")

    user_exists = User.query.filter_by(email=email).first() is not None
    
    if user_exists:
        return jsonify({"error": "Email already exists."}), 409
    
    user = User(name=name, email=email, passwd=passwd, about=about)
    db.session.add(user)
    db.session.commit()
    return jsonify({
        "id":user.id,
        "name":user.name,
        "email":user.email,
        "password":user.password,
        "about":user.about
    })

@app.route('/create_token', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    passwd = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"error":"User Not Found! Please Register yourself."}), 404
    if not user.check_passwd(passwd):
        return jsonify({"error":"Wrong Credential! Please check your password."}), 401

    access_token = create_access_token(identity=email, expires_delta=datetime.timedelta(minutes=5))
    #refresh_token = create_refresh_token(identity=email, expires_delta=datetime.timedelta(days=1))
    response =jsonify({
        "email":email,
        "access_token": access_token
        #,"refresh_token":refresh_token
    })
    set_access_cookies(response, access_token)
    return response, 200

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        token = request.headers.get("Authorization").split()[1]
        payload = jjwt.decode(token, app.config.get('SECRET_KEY'), algorithms=['HS256'])
        #print("Payload->>", payload)
        userEmail = payload.get('sub')

        print(userEmail)
        if not userEmail:
            return jsonify({"error":"Unauthorized Access"}), 404
        
        user = User.query.filter_by(email=userEmail).first()
        if not user:
            return jsonify({"error":"User Not Found! Please Register yourself."}), 404
        
        return jsonify({
            "id":user.id,
            "name":user.name,
            "email":user.email,
            "password":user.password,
            "about":user.about
        })
    except Exception as e:
        return "Unauthorized : "+str(e), 401

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route("/addItem", methods=['POST'])
@jwt_required()
def addItem():
    try:
        name = request.json['name']
        price = request.json['price']

        items = Items(name,price)
        db.session.add(items)
        db.session.commit()
        return item_schema.jsonify(items)
    except:
        return "Exception Raised"

@app.route('/getItems', methods=['GET'])
@jwt_required()
def getItems():
    try:
        items = Items.query.all()
        if items:
            items = items_schema.dump(items)
            return jsonify(items)
        else:
            return "No records in DB. Please ADD."
    except:
        return "Exception Raised"

@app.route('/getItem/<int:id>', methods=['GET'])
@jwt_required()
def getItem(id):
    try:
        item = Items.query.get(id)
        if item:
            return item_schema.jsonify(item)
        else:
            return "Not Found item with id: {}".format(id)
    except:
        return "Exception Raised"

@app.route('/deleteItem/<int:id>', methods=['DELETE'])
@jwt_required()
def deleteItem(id):
    try:
        item = Items.query.get(id)
        if item:
            db.session.delete(item)
            db.session.commit()
            return item_schema.jsonify(item)
        else:
            return "Not Found item with id: {}".format(id)
    except:
        return "Exception Raised"

@app.route('/updateItem/<int:id>', methods=['PUT'])
@jwt_required()
def updateItem(id):
    try:
        item = Items.query.get(id)
        if item:
            upd_name = request.json['name']
            upd_price = request.json['price']

            item.name = upd_name
            item.price = upd_price

            db.session.commit()
            return item_schema.jsonify(item)
        else:
            return "Not Found item with id: {}".format(id)
        
    except:
        return "Exception Raised"


# Middleware to validate access token
def validate_token():
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header is None:
            return jsonify({'message': 'Authorization header missing'}), 401

        token = auth_header.split()[1]
        payload = jjwt.decode(token, 'mysec', algorithms=['HS256'])

        expiration_time = payload.get('exp',0)
        current_time = int(time.time())

        if expiration_time < current_time:
            return jsonify({'message': 'Token has expired'}), 401

    except ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except JWTError:
        return jsonify({'message': 'Invalid token'}), 401
    return None

@app.route('/validate_token', methods=['GET'])
def validate_token_controller():
    auth_error = validate_token()
    if auth_error:
        return auth_error
    return jsonify({'message': 'Access granted'})

if __name__ == '__main__':
    app.run(debug=True)