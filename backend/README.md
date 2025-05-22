# Budget Buddy Backend

The backend of Budget Buddy is built using Flask and provides a RESTful API for the frontend application.

## Features

- RESTful API endpoints for expense management
- SQLite database for data persistence
- User authentication and authorization
- Data validation and error handling
- Sample data generation for testing

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/<id>` - Update expense
- `DELETE /api/expenses/<id>` - Delete expense

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/<id>` - Update category
- `DELETE /api/categories/<id>` - Delete category

## Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize the database:
```bash
python app.py
```

## Development

The backend uses the following main dependencies:
- Flask
- Flask-SQLAlchemy
- Flask-Login
- Flask-CORS

## Testing

To run the sample data generation:
```bash
python sample_data.py
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error 