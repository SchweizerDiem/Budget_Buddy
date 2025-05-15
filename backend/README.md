# Budget Buddy Backend

This is the Python backend for Budget Buddy, providing a REST API for managing budgets and expenses.

## Setup

1. Create a Python virtual environment:
```bash
python3 -m venv venv
```

2. Activate the virtual environment:
```bash
source venv/bin/activate  # On Linux/Mac
# OR
.\venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Users
- POST `/api/user` - Create a new user
- GET `/api/user/<user_id>` - Get user details

### Budgets
- POST `/api/budgets` - Create a new budget
- GET `/api/budgets/<user_id>` - Get all budgets for a user
- DELETE `/api/budgets/<budget_id>` - Delete a budget

### Expenses
- POST `/api/expenses` - Create a new expense
- GET `/api/expenses/<budget_id>` - Get all expenses for a budget
- DELETE `/api/expenses/<expense_id>` - Delete an expense

## Database

The application uses SQLite as the database, stored in `budget_buddy.db`. The database will be automatically created when you first run the application. 