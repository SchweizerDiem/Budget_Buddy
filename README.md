# Budget Buddy

Budget Buddy is a comprehensive personal finance management application that helps users track their income and expenses, visualize their spending patterns, and manage their budget effectively.

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

Budget Buddy is a full-stack web application that provides users with tools to:
- Track daily income and expenses
- Categorize transactions for better organization
- View spending patterns through interactive charts
- Set and monitor monthly budgets
- Manage multiple expense categories
- Get insights into their financial habits

## System Architecture

The application follows a client-server architecture:

### Frontend (React + Vite)
- Single Page Application (SPA)
- Component-based architecture
- Real-time data visualization
- Responsive design for all devices

### Backend (Flask)
- RESTful API design
- SQLite database for data persistence
- JWT-based authentication
- CORS enabled for frontend communication

## Features

- Track income and expenses
- Categorize transactions
- Visualize spending patterns with interactive charts
- Monthly budget tracking
- Responsive design for all devices
- Secure user authentication
- Real-time data updates

## Project Structure

The project is divided into two main components:

- `frontend/`: React-based web application
  - `src/components/`: React components
  - `src/helpers/`: Utility functions
  - `public/`: Static assets
- `backend/`: Flask-based REST API server
  - `app.py`: Main application file
  - `requirements.txt`: Python dependencies
  - `instance/`: Database files

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Budget_Buddy.git
cd Budget_Buddy
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage Guide

1. **User Registration/Login**
   - Create an account or log in to access your dashboard
   - Secure authentication with JWT tokens

2. **Managing Expenses**
   - Add new expenses with amount, category, and date
   - Edit or delete existing expenses
   - View expense history

3. **Category Management**
   - Create custom expense categories
   - Assign expenses to categories
   - View category-wise spending

4. **Budget Tracking**
   - Set monthly budgets for categories
   - Monitor spending against budgets
   - Receive alerts for budget limits

5. **Data Visualization**
   - View monthly income vs expenses
   - Analyze spending patterns
   - Track category-wise distribution

## Development

For detailed development guidelines, please refer to:
- [Frontend Development Guide](frontend/README.md)
- [Backend Development Guide](backend/README.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for the visualization components
- React for the frontend framework
- Flask for the backend framework 