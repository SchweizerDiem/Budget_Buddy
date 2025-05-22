import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { formatCurrency } from '../helpers';
import LoadingSpinner from './LoadingSpinner';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const OverallStats = ({ budgets, expenses }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    budgetUtilization: [],
    categoryDistribution: {},
    incomeDistribution: {},
    monthlyTrend: {},
    topExpenses: [],
    topIncomes: []
  });

  useEffect(() => {
    const calculateStats = () => {
      const newStats = {
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        budgetUtilization: [],
        categoryDistribution: {},
        incomeDistribution: {},
        monthlyTrend: {},
        topExpenses: [],
        topIncomes: []
      };

      // Process all expenses
      expenses.forEach(expense => {
        const amount = Math.abs(expense.amount);
        const date = new Date(expense.createdAt);
        const monthKey = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });

        // Track monthly trends
        if (!newStats.monthlyTrend[monthKey]) {
          newStats.monthlyTrend[monthKey] = { income: 0, expenses: 0 };
        }

        if (expense.type === 'income') {
          newStats.totalIncome += amount;
          newStats.monthlyTrend[monthKey].income += amount;
          newStats.topIncomes.push({ ...expense, amount });
          
          // Track income distribution
          if (!newStats.incomeDistribution[expense.category]) {
            newStats.incomeDistribution[expense.category] = 0;
          }
          newStats.incomeDistribution[expense.category] += amount;
        } else {
          newStats.totalExpenses += amount;
          newStats.monthlyTrend[monthKey].expenses += amount;
          newStats.topExpenses.push({ ...expense, amount });

          // Track category distribution
          if (!newStats.categoryDistribution[expense.category]) {
            newStats.categoryDistribution[expense.category] = 0;
          }
          newStats.categoryDistribution[expense.category] += amount;
        }
      });

      // Calculate net balance
      newStats.netBalance = newStats.totalIncome - newStats.totalExpenses;

      // Calculate budget utilization
      budgets.forEach(budget => {
        const budgetExpenses = expenses.filter(e => e.budgetId === budget.id);
        const spent = budgetExpenses.reduce((acc, exp) => {
          return acc + (exp.type === 'expense' ? Math.abs(exp.amount) : 0);
        }, 0);
        newStats.budgetUtilization.push({
          name: budget.name,
          allocated: budget.amount,
          spent: spent,
          percentage: (spent / budget.amount) * 100
        });
      });

      // Sort top expenses and incomes
      newStats.topExpenses.sort((a, b) => b.amount - a.amount);
      newStats.topIncomes.sort((a, b) => b.amount - a.amount);
      newStats.topExpenses = newStats.topExpenses.slice(0, 5);
      newStats.topIncomes = newStats.topIncomes.slice(0, 5);

      setStats(newStats);
      setLoading(false);
    };

    calculateStats();
  }, [budgets, expenses]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <LoadingSpinner />
        <p className="loading-text">Calculating overall statistics...</p>
      </div>
    );
  }

  const budgetUtilizationData = {
    labels: stats.budgetUtilization.map(b => b.name),
    datasets: [
      {
        label: 'Allocated',
        data: stats.budgetUtilization.map(b => b.allocated),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Spent',
        data: stats.budgetUtilization.map(b => b.spent),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ]
  };

  const categoryData = {
    labels: Object.keys(stats.categoryDistribution),
    datasets: [{
      data: Object.values(stats.categoryDistribution),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const incomeData = {
    labels: Object.keys(stats.incomeDistribution),
    datasets: [{
      data: Object.values(stats.incomeDistribution),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const monthlyTrendData = {
    labels: Object.keys(stats.monthlyTrend),
    datasets: [
      {
        label: 'Income',
        data: Object.values(stats.monthlyTrend).map(m => m.income),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: Object.values(stats.monthlyTrend).map(m => m.expenses),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  return (
    <div className="stats-grid">
      <div className="stats-card">
        <h3>Overall Financial Summary</h3>
        <div className="stats-summary">
          <div className="stat-item">
            <h4>Total Income</h4>
            <p className="income-text">{formatCurrency(stats.totalIncome)}</p>
          </div>
          <div className="stat-item">
            <h4>Total Expenses</h4>
            <p className="expense-text">{formatCurrency(stats.totalExpenses)}</p>
          </div>
          <div className="stat-item">
            <h4>Net Balance</h4>
            <p className={stats.netBalance >= 0 ? 'income-text' : 'expense-text'}>
              {formatCurrency(stats.netBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="stats-card">
        <h3>Budget Utilization</h3>
        <Bar 
          data={budgetUtilizationData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Budget Allocation vs Spending'
              }
            }
          }}
        />
      </div>

      <div className="stats-card">
        <h3>Expense Categories</h3>
        <div className="pie-chart-container">
          <Pie 
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                }
              }
            }}
          />
        </div>
      </div>

      <div className="stats-card">
        <h3>Income Categories</h3>
        <div className="pie-chart-container">
          <Pie 
            data={incomeData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                }
              }
            }}
          />
        </div>
      </div>

      <div className="stats-card">
        <h3>Monthly Income/Expense Trend</h3>
        <Line 
          data={monthlyTrendData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              }
            }
          }}
        />
      </div>

      <div className="stats-card">
        <h3>Top 5 Expenses</h3>
        <div className="top-list">
          {stats.topExpenses.map((expense, index) => (
            <div key={index} className="list-item">
              <span>{expense.name}</span>
              <span className="expense-text">{formatCurrency(expense.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-card">
        <h3>Top 5 Incomes</h3>
        <div className="top-list">
          {stats.topIncomes.map((income, index) => (
            <div key={index} className="list-item">
              <span>{income.name}</span>
              <span className="income-text">{formatCurrency(income.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverallStats; 