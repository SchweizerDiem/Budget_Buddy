import { useState, useEffect } from 'react';
import { formatCurrency } from '../helpers';
import LoadingSpinner from './LoadingSpinner';

const MonthlyStats = ({ expenses }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStats = () => {
      const monthlyStats = {
        totalExpenses: 0,
        totalIncome: 0,
        largestExpense: { amount: 0, name: '', date: '' },
        largestIncome: { amount: 0, name: '', date: '' },
        mostFrequentCategory: '',
        categoryCount: {},
        transactionCount: expenses.length,
        averageTransactionAmount: 0
      };

      expenses.forEach(expense => {
        const amount = Math.abs(expense.amount);
        
        // Track category frequency
        monthlyStats.categoryCount[expense.category] = (monthlyStats.categoryCount[expense.category] || 0) + 1;

        if (expense.type === 'expense') {
          monthlyStats.totalExpenses += amount;
          
          // Track largest expense
          if (amount > monthlyStats.largestExpense.amount) {
            monthlyStats.largestExpense = {
              amount,
              name: expense.name,
              date: new Date(expense.createdAt).toLocaleDateString()
            };
          }
        } else {
          monthlyStats.totalIncome += amount;
          
          // Track largest income
          if (amount > monthlyStats.largestIncome.amount) {
            monthlyStats.largestIncome = {
              amount,
              name: expense.name,
              date: new Date(expense.createdAt).toLocaleDateString()
            };
          }
        }
      });

      // Calculate most frequent category
      let maxCount = 0;
      Object.entries(monthlyStats.categoryCount).forEach(([category, count]) => {
        if (count > maxCount) {
          maxCount = count;
          monthlyStats.mostFrequentCategory = category;
        }
      });

      // Calculate average transaction amount
      const totalAmount = monthlyStats.totalIncome + monthlyStats.totalExpenses;
      monthlyStats.averageTransactionAmount = expenses.length ? totalAmount / expenses.length : 0;

      setStats(monthlyStats);
      setLoading(false);
    };

    calculateStats();
  }, [expenses]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <LoadingSpinner />
        <p className="loading-text">Calculating statistics...</p>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <h3>Monthly Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <h4>Total Transactions</h4>
          <p>{stats.transactionCount}</p>
        </div>
        <div className="stat-item">
          <h4>Total Expenses</h4>
          <p className="expense-text">{formatCurrency(stats.totalExpenses)}</p>
        </div>
        <div className="stat-item">
          <h4>Total Income</h4>
          <p className="income-text">{formatCurrency(stats.totalIncome)}</p>
        </div>
        <div className="stat-item">
          <h4>Average Transaction</h4>
          <p>{formatCurrency(stats.averageTransactionAmount)}</p>
        </div>
        <div className="stat-item">
          <h4>Largest Expense</h4>
          <p className="expense-text">
            {formatCurrency(stats.largestExpense.amount)}
            <small>
              {stats.largestExpense.name} ({stats.largestExpense.date})
            </small>
          </p>
        </div>
        <div className="stat-item">
          <h4>Largest Income</h4>
          <p className="income-text">
            {formatCurrency(stats.largestIncome.amount)}
            <small>
              {stats.largestIncome.name} ({stats.largestIncome.date})
            </small>
          </p>
        </div>
        <div className="stat-item">
          <h4>Most Used Category</h4>
          <p>{stats.mostFrequentCategory} ({stats.categoryCount[stats.mostFrequentCategory]} transactions)</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyStats; 