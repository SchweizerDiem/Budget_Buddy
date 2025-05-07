import React, { useState } from 'react';

export default function Calculator() {
  const [value, setValue] = useState('0');
  const [transactionType, setTransactionType] = useState('expense');
  const [category, setCategory] = useState('');

  const append = v => setValue(prev => (prev === '0' ? v : prev + v));
  const backspace = () =>
    setValue(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  const clear = () => setValue('0');
  const calculate = () => {
    try {
      const expr = value
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/%/g, '*0.01');
      const result = eval(expr);
      setValue(String(result));
    } catch {
      setValue('Error');
    }
  };

  const buttons = [
    { label: 'C', action: clear, cls: 'btn-op' },
    { label: '(', action: () => append('('), cls: 'btn-op' },
    { label: ')', action: () => append(')'), cls: 'btn-op' },
    { label: '%', action: () => append('%'), cls: 'btn-op' },
    { label: '7', action: () => append('7'), cls: 'btn-num' },
    { label: '8', action: () => append('8'), cls: 'btn-num' },
    { label: '9', action: () => append('9'), cls: 'btn-num' },
    { label: '÷', action: () => append('÷'), cls: 'btn-op' },
    { label: '4', action: () => append('4'), cls: 'btn-num' },
    { label: '5', action: () => append('5'), cls: 'btn-num' },
    { label: '6', action: () => append('6'), cls: 'btn-num' },
    { label: '×', action: () => append('×'), cls: 'btn-op' },
    { label: '1', action: () => append('1'), cls: 'btn-num' },
    { label: '2', action: () => append('2'), cls: 'btn-num' },
    { label: '3', action: () => append('3'), cls: 'btn-num' },
    { label: '−', action: () => append('−'), cls: 'btn-op' },
    { label: '0', action: () => append('0'), cls: 'btn-num btn-zero' },
    { label: '.', action: () => append('.'), cls: 'btn-num' },
    { label: '⌫', action: backspace, cls: 'btn-op' },
    { label: '=', action: calculate, cls: 'btn-eq' },
  ];

  // (you can wire these into your data model when you "save" a transaction)
  console.log({ transactionType, category, amount: value });

  return (
    <div className="left-panel">
      <h2>Calculator</h2>

      {/* ←— NEW: transaction selects */}
      <div className="transaction-selects">
        <select
          value={transactionType}
          onChange={e => setTransactionType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="rent">Rent</option>
          <option value="salary">Salary</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>
      {/* ———————————————————————————————— */}

      <div className="calculator">
        <div className="display">{value}</div>
        {buttons.map((btn, i) => (
          <button key={i} className={btn.cls} onClick={btn.action}>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
