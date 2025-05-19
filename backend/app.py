from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///budget_buddy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    budgets = db.relationship('Budget', backref='user', lazy=True, cascade='all, delete-orphan')

class Budget(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    color = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    categories = db.Column(db.String(500))  # Stored as comma-separated string
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    expenses = db.relationship('Expense', backref='budget', lazy=True, cascade='all, delete-orphan')

class Expense(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(50))
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    budget_id = db.Column(db.String(36), db.ForeignKey('budget.id'), nullable=False)

# Routes
@app.route('/api/user', methods=['POST'])
def create_user():
    data = request.json
    user = User(name=data['userName'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'id': user.id, 'name': user.name})

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'id': user.id, 'name': user.name})

@app.route('/api/budgets', methods=['POST'])
def create_budget():
    data = request.json
    budget = Budget(
        name=data['name'],
        amount=float(data['amount']),
        color=data.get('color', ''),
        categories=','.join(data.get('categories', [])),
        user_id=data['userId']
    )
    db.session.add(budget)
    db.session.commit()
    return jsonify({
        'id': budget.id,
        'name': budget.name,
        'amount': budget.amount,
        'color': budget.color,
        'categories': budget.categories.split(',') if budget.categories else [],
        'createdAt': budget.created_at.timestamp() * 1000
    })

@app.route('/api/budgets/<user_id>', methods=['GET'])
def get_budgets(user_id):
    budgets = Budget.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': b.id,
        'name': b.name,
        'amount': b.amount,
        'color': b.color,
        'categories': b.categories.split(',') if b.categories else [],
        'createdAt': b.created_at.timestamp() * 1000
    } for b in budgets])

@app.route('/api/budgets/<budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    budget = Budget.query.get_or_404(budget_id)
    db.session.delete(budget)
    db.session.commit()
    return '', 204

@app.route('/api/budgets/<budget_id>', methods=['PATCH'])
def update_budget(budget_id):
    try:
        budget = Budget.query.get_or_404(budget_id)
        data = request.json
        print(f"Updating budget {budget_id} with data:", data)  # Debug log
        
        if 'categories' in data:
            # Handle both string and array inputs
            categories = data['categories']
            if isinstance(categories, str):
                # If it's a string, split it and clean
                categories = [cat.strip() for cat in categories.split(',') if cat.strip()]
            elif isinstance(categories, list):
                # If it's a list, just clean each item
                categories = [str(cat).strip() for cat in categories if str(cat).strip()]
            
            # Sort categories to maintain consistent order
            categories.sort()
            budget.categories = ','.join(categories) if categories else ''
            print(f"Updated categories: {budget.categories}")  # Debug log
        
        if 'name' in data:
            budget.name = data['name']
        if 'amount' in data:
            budget.amount = float(data['amount'])
        if 'color' in data:
            budget.color = data['color']
        
        db.session.commit()
        
        # Get fresh data after commit
        db.session.refresh(budget)
        
        response_data = {
            'id': budget.id,
            'name': budget.name,
            'amount': budget.amount,
            'color': budget.color,
            'categories': budget.categories.split(',') if budget.categories else [],
            'createdAt': budget.created_at.timestamp() * 1000
        }
        print(f"Sending response: {response_data}")  # Debug log
        return jsonify(response_data)
    except Exception as e:
        print(f"Error updating budget: {str(e)}")  # Debug log
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/expenses', methods=['POST'])
def create_expense():
    data = request.json
    expense = Expense(
        name=data['name'],
        amount=float(data['amount']),
        type=data.get('type', ''),
        category=data.get('category', ''),
        budget_id=data['budgetId']
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify({
        'id': expense.id,
        'name': expense.name,
        'amount': expense.amount,
        'type': expense.type,
        'category': expense.category,
        'budgetId': expense.budget_id,
        'createdAt': expense.created_at.timestamp() * 1000
    })

@app.route('/api/expenses/<budget_id>', methods=['GET'])
def get_expenses(budget_id):
    expenses = Expense.query.filter_by(budget_id=budget_id).all()
    return jsonify([{
        'id': e.id,
        'name': e.name,
        'amount': e.amount,
        'type': e.type,
        'category': e.category,
        'budgetId': e.budget_id,
        'createdAt': e.created_at.timestamp() * 1000
    } for e in expenses])

@app.route('/api/expenses/<expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    db.session.delete(expense)
    db.session.commit()
    return '', 204

@app.route('/api/expenses/<expense_id>', methods=['PATCH'])
def update_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)
    data = request.json
    
    if 'name' in data:
        expense.name = data['name']
    if 'amount' in data:
        expense.amount = float(data['amount'])
    if 'type' in data:
        expense.type = data['type']
    if 'category' in data:
        expense.category = data['category']
    
    db.session.commit()
    return jsonify({
        'id': expense.id,
        'name': expense.name,
        'amount': expense.amount,
        'type': expense.type,
        'category': expense.category,
        'budgetId': expense.budget_id,
        'createdAt': expense.created_at.timestamp() * 1000
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 
