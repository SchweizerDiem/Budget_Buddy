from flask import Blueprint, request, jsonify
from app.models.user import User
from app.utils.database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(
        email=data['email'],
        password=data['password']  # Deve ser hashed na prática!
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201