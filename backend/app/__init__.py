from flask import Flask
from flask_migrate import Migrate
from app.config import Config
from app.utils.database import db

migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    # Registrar blueprints com prefixos consistentes
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/users')  # Adicionado /users

    from app.routes.categories import categories_bp
    app.register_blueprint(categories_bp)  # Removido prefixo duplicado

    return app