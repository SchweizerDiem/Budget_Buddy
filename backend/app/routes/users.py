from flask import Blueprint, jsonify, request
from app.models import User
from app.utils.database import db

users_bp = Blueprint('users', __name__)

# Rota para listar todos os usuários
@users_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "email": user.email} for user in users]), 200

# Rota para criar um novo usuário
@users_bp.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"id": new_user.id, "email": new_user.email}), 201