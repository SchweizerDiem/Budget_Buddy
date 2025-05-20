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
    // Sort expenses by date
    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Create a map of dates to track running totals
    const timelineData = {};
    let runningIncome = 0;
    let runningExpense = 0;

    sortedExpenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const dateKey = date.toLocaleDateString();
      const amount = Math.abs(expense.amount);

      if (!timelineData[dateKey]) {
        timelineData[dateKey] = {
          date: dateKey,
          income: 0,
          expense: 0,
          runningIncome: 0,
          runningExpense: 0
        };
      }

      if (expense.type === 'income') {
        timelineData[dateKey].income += amount;
        runningIncome += amount;
        timelineData[dateKey].runningIncome = runningIncome;
      } else {
        timelineData[dateKey].expense += amount;
        runningExpense += amount;
        timelineData[dateKey].runningExpense = runningExpense;
      }
    });

    // Convert to arrays for the chart
    const data = Object.values(timelineData);

    return {
      labels: data.map(d => d.date),
      income: data.map(d => d.income),
      expense: data.map(d => d.expense),
      runningIncome: data.map(d => d.runningIncome),
      runningExpense: data.map(d => d.runningExpense)
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
        label: 'Daily Income',
        data: trendData.income,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Daily Expenses',
        data: trendData.expense,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Cumulative Income',
        data: trendData.runningIncome,
        borderColor: 'rgba(75, 192, 192, 0.8)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        label: 'Cumulative Expenses',
        data: trendData.runningExpense,
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        yAxisID: 'y1',
      }
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
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Income/Expense Timeline for ${selectedMonth}`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Daily Amount'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Cumulative Amount'
        },
        grid: {
          drawOnChartArea: false,
        },
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