# app/models/category.py
from app.utils.database import db

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(10), nullable=False)  # 'income' ou 'expense'
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type
        }