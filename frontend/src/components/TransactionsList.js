import React from 'react';

export default function TransactionsList() {
  const transactions = [
    { date: '2025-05-01', description: 'Coffee Shop', amount: '-$4.50' },
    { date: '2025-05-02', description: 'Salary', amount: '+$2,500.00' },
    { date: '2025-05-03', description: 'Groceries', amount: '-$76.23' },
    { date: '2025-05-04', description: 'Electric Bill', amount: '-$120.00' },
  ];

  return (
    <div className="right-panel transactions">
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr key={i}>
              <td>{tx.date}</td>
              <td>{tx.description}</td>
              <td>{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
