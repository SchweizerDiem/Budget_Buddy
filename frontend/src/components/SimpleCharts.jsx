import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleCharts = ({ expenses }) => {
  // Group expenses by date
  const dailyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        date,
        total: 0,
        count: 0
      };
    }
    acc[date].total += expense.amount;
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(dailyData).sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <h3>Daily Transaction Amounts</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" name="Total Amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-wrapper">
        <h3>Daily Transaction Count</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" name="Number of Transactions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleCharts; 
