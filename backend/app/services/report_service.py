# app/services/report_service.py
from app.models import Transaction

def generate_expense_report(user_id):
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    # Processar dados e retornar JSON
    return {
        'labels': ['Vendas', 'Compras'],
        'values': [130, 142]
    }