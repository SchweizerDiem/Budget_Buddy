import {
  createBudget as apiCreateBudget,
  createExpense as apiCreateExpense,
  getBudgets,
  getExpenses,
  deleteBudget as apiDeleteBudget,
  deleteExpense as apiDeleteExpense
} from './api';

export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

// Get user ID from localStorage (we'll keep this in localStorage for now)
export const getUserId = () => {
  return localStorage.getItem('userId');
};

// Get all items from API
export const getAllMatchingItems = async ({ category, key, value }) => {
  if (category === "budgets") {
    const userId = getUserId();
    if (!userId) return [];
    const budgets = await getBudgets(userId);
    return budgets.filter((item) => item[key] === value);
  } else if (category === "expenses") {
    const expenses = await getExpenses(value); // value should be budgetId
    return expenses;
  }
  return [];
};

// delete item from API
export const deleteItem = async ({ key, id }) => {
  if (key === "budgets") {
    await apiDeleteBudget(id);
  } else if (key === "expenses") {
    await apiDeleteExpense(id);
  } else if (key === "userName") {
    localStorage.removeItem('userId');
  }
};

// create budget
export const createBudget = async ({ name, amount, categories }) => {
  const userId = getUserId();
  if (!userId) throw new Error('User not found');
  
  return await apiCreateBudget({
    name,
    amount: +amount,
    categories: categories.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0),
    userId
  });
};

// calculate total spent
export const calculateTotalSpent = async (budgets) => {
  if (!budgets?.length) return 0;
  
  let totalSpent = 0;
  for (const budget of budgets) {
    const expenses = await getExpenses(budget.id);
    totalSpent += expenses.reduce((acc, expense) => {
      const amount = expense.type === "expense" ? -expense.amount : expense.amount;
      return acc + amount;
    }, 0);
  }
  return totalSpent;
};

// create expense
export const createExpense = async ({ name, amount, budgetId, type, category }) => {
  return await apiCreateExpense({
    name,
    amount: +amount,
    budgetId,
    type,
    category
  });
};

// calculate spent by budget
export const calculateSpentByBudget = async (budgetId) => {
  const expenses = await getExpenses(budgetId);
  return expenses.reduce((acc, expense) => {
    const amount = expense.type === "expense" ? -expense.amount : expense.amount;
    return acc + amount;
  }, 0);
};

// FORMATTING
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

// Formatting percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format currency
export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};
