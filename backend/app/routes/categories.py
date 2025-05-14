from flask import Blueprint, request, jsonify
from app.models.category import Category
from app.utils.database import db

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@categories_bp.route('/', methods=['GET', 'POST'])
def handle_categories():
    try:
        if request.method == 'POST':
            # Verifica se o conteúdo é JSON
            if not request.is_json:
                return jsonify({"error": "Content-Type deve ser application/json"}), 415

            data = request.get_json()
            name = data.get('name')
            category_type = data.get('type')

            # Validação de campos
            if not name or not category_type:
                return jsonify({"error": "Nome e tipo são obrigatórios"}), 400

            # Verifica se a categoria já existe
            if Category.query.filter_by(name=name).first():
                return jsonify({"error": "Categoria já existe"}), 409

            # Cria e salva a categoria
            new_category = Category(name=name, type=category_type)
            db.session.add(new_category)
            db.session.commit()

            return jsonify(new_category.to_dict()), 201

        elif request.method == 'GET':
            # Recupera todas as categorias
            categories = Category.query.all()
            return jsonify([category.to_dict() for category in categories]), 200

    except Exception as e:
        db.session.rollback()  # Reverte transações falhas
        return jsonify({"error": str(e)}), 500