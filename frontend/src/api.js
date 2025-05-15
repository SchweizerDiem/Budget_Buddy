const API_BASE_URL = 'http://localhost:5000/api';

// User operations
export const createUser = async (userName) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName }),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
};

export const getUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`);
  if (!response.ok) throw new Error('Failed to get user');
  return response.json();
};

// Budget operations
export const createBudget = async ({ name, amount, categories, userId }) => {
  const response = await fetch(`${API_BASE_URL}/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      amount,
      categories,
      userId,
      color: `${Math.random() * 360} 65% 50%`, // Random HSL color
    }),
  });
  if (!response.ok) throw new Error('Failed to create budget');
  return response.json();
};

export const getBudgets = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/budgets/${userId}`);
  if (!response.ok) throw new Error('Failed to get budgets');
  return response.json();
};

export const deleteBudget = async (budgetId) => {
  const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete budget');
  return true;
};

// Expense operations
export const createExpense = async ({ name, amount, budgetId, type, category }) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      amount,
      budgetId,
      type,
      category,
    }),
  });
  if (!response.ok) throw new Error('Failed to create expense');
  return response.json();
};

export const getExpenses = async (budgetId) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${budgetId}`);
  if (!response.ok) throw new Error('Failed to get expenses');
  return response.json();
};

export const deleteExpense = async (expenseId) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete expense');
  return true;
}; 