# app/models/user.py
import uuid  # Importação necessária
from app.utils.database import db

class User(db.Model):
    __tablename__ = 'users'

    # Usando UUID como chave primária (string)
    id = db.Column(
        db.String(36),  # Armazena como string de 36 caracteres
        primary_key=True,
        default=lambda: str(uuid.uuid4())  # Gera UUID automático
    )

    # Campos adicionais
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    # Relacionamentos (exemplo)
    categories = db.relationship('Category', backref='owner', lazy=True)
    transactions = db.relationship('Transaction', backref='user', lazy=True)