# Budget Buddy Frontend

The frontend of Budget Buddy is built using React and provides a modern, responsive user interface for managing personal finances.

## Features

- Interactive charts and visualizations using Chart.js
- Responsive design for all devices
- Real-time data updates
- User-friendly expense tracking
- Category management
- Monthly budget overview

## Tech Stack

- React
- Vite
- Chart.js
- React Router
- Axios for API calls

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   ├── helpers/     # Utility functions
│   ├── App.jsx      # Main application component
│   └── main.jsx     # Application entry point
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Components

### StoreStats
- Displays monthly comparison charts
- Shows category distribution
- Visualizes income/expense trends

### Other Components
- ExpenseForm: Add and edit expenses
- CategoryList: Manage expense categories
- BudgetOverview: Monthly budget summary
- Navigation: App navigation and routing

## Styling

The application uses CSS modules for component-specific styling and a global CSS file for common styles.

## API Integration

The frontend communicates with the backend API using Axios. API calls are organized in the `helpers` directory.

## Development Guidelines

1. Follow the existing component structure
2. Use functional components with hooks
3. Implement proper error handling
4. Add appropriate loading states
5. Ensure responsive design
6. Write meaningful component documentation

## Contributing

1. Create a new branch for your feature
2. Follow the existing code style
3. Add tests for new features
4. Update documentation as needed
5. Submit a pull request 