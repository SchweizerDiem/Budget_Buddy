# Arquivo: app/models/__init__.py
from app.utils.database import db
from .user import User
from .category import Category
from .transaction import Transaction

__all__ = ['db', 'User', 'Category', 'Transaction']