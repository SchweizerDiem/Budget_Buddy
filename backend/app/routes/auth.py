from flask import Blueprint, jsonify
from app.utils.database import db

auth_bp = Blueprint('auth', __name__)

# Rota de teste
@auth_bp.route('/test-db')
def test_db():
    try:
        db.engine.connect()
        return jsonify({"status": "PostgreSQL conectado com sucesso!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500