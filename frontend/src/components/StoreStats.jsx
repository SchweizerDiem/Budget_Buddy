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

const StoreStats = ({ expenses }) => {
  const [monthlyData, setMonthlyData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (!expenses || expenses.length === 0) {
      setMonthlyData(null);
      setCategoryData(null);
      setTrendData(null);
      setSelectedMonth(null);
      return;
    }

    // Get the month from the first expense (they should all be from the same month)
    const firstExpense = expenses[0];
    const date = new Date(firstExpense.createdAt);
    setSelectedMonth(date.toLocaleDateString('default', { month: 'long', year: 'numeric' }));

    // Process data for monthly comparison
    const monthlyComparison = processMonthlyData(expenses);
    setMonthlyData(monthlyComparison);

    // Process data for category distribution
    const categoryDistribution = processCategoryData(expenses);
    setCategoryData(categoryDistribution);

    // Process data for income/expense trend
    const trendAnalysis = processTrendData(expenses);
    setTrendData(trendAnalysis);
  }, [expenses]);

  const processMonthlyData = (expenses) => {
    const totals = {
      income: 0,
      expense: 0,
    };

    expenses.forEach((expense) => {
      const amount = Math.abs(expense.amount);
      if (expense.type === 'income') {
        totals.income += amount;
      } else {
        totals.expense += amount;
      }
    });

    return {
      labels: ['Income', 'Expenses'],
      income: [totals.income, 0],
      expense: [0, totals.expense],
    };
  };

  const processCategoryData = (expenses) => {
    const categoryTotals = {};
    let totalAmount = 0;

    expenses.forEach((expense) => {
      if (expense.type === 'expense') {
        const amount = Math.abs(expense.amount);
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + amount;
        totalAmount += amount;
      }
    });

    return {
      labels: Object.keys(categoryTotals),
      data: Object.values(categoryTotals),
      totalAmount,
    };
  };

  const processTrendData = (expenses) => {
    const dailyTotals = {
      income: {},
      expense: {},
    };

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const day = date.getDate();
      const amount = Math.abs(expense.amount);

      if (expense.type === 'income') {
        dailyTotals.income[day] = (dailyTotals.income[day] || 0) + amount;
      } else {
        dailyTotals.expense[day] = (dailyTotals.expense[day] || 0) + amount;
      }
    });

    const days = [...new Set([
      ...Object.keys(dailyTotals.income),
      ...Object.keys(dailyTotals.expense),
    ])].sort((a, b) => parseInt(a) - parseInt(b));

    return {
      labels: days.map(day => `Day ${day}`),
      income: days.map(day => dailyTotals.income[day] || 0),
      expense: days.map(day => dailyTotals.expense[day] || 0),
    };
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="stats-grid">
        <div className="stats-card">
          <h3>No Data Available</h3>
          <p>Add some expenses to see your statistics here.</p>
        </div>
      </div>
    );
  }

  if (!monthlyData || !categoryData || !trendData) {
    return null;
  }

  const monthlyChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.income,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: monthlyData.expense,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryChartData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
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
      },
    ],
  };

  const trendChartData = {
    labels: trendData.labels,
    datasets: [
      {
        label: 'Income',
        data: trendData.income,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: trendData.expense,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Income vs Expenses for ${selectedMonth}`,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `Expense Distribution for ${selectedMonth}`,
      },
    },
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Daily Income/Expense Trend for ${selectedMonth}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="stats-grid">
      <div className="stats-card">
        <h3>Monthly Comparison</h3>
        <Bar data={monthlyChartData} options={chartOptions} />
      </div>
      
      <div className="stats-card">
        <h3>Category Distribution</h3>
        <div className="pie-chart-container">
          <Pie data={categoryChartData} options={pieOptions} />
          <div className="total-amount">
            Total Expenses: {formatCurrency(categoryData.totalAmount)}
          </div>
        </div>
      </div>
      
      <div className="stats-card">
        <h3>Income/Expense Trend</h3>
        <Line data={trendChartData} options={trendOptions} />
      </div>
    </div>
  );
};

export default StoreStats; 