// rrd imports
import { Link, useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import LoadingSpinner from "../components/LoadingSpinner";

//  helper functions
import {
  createBudget,
  createExpense,
  deleteItem,
  getUserId,
  formatCurrency,
  waait,
  calculateTotalSpent,
} from "../helpers";

// API functions
import { createUser, getBudgets, getExpenses, getUser } from "../api";

// loader
export async function dashboardLoader() {
  const userId = getUserId();
  if (!userId) {
    return { userName: null, budgets: [], expenses: [] };
  }

  try {
    // Get user data
    const user = await getUser(userId);
    const budgets = await getBudgets(userId);
    let allExpenses = [];
    
    // Fetch expenses for each budget
    for (const budget of budgets) {
      const expenses = await getExpenses(budget.id);
      allExpenses = [...allExpenses, ...expenses];
    }

    return { 
      userName: user.name,
      budgets, 
      expenses: allExpenses 
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    throw new Error("There was a problem loading your dashboard.");
  }
}

// action
export async function dashboardAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // new user submission
  if (_action === "newUser") {
    try {
      const user = await createUser(values.userName);
      localStorage.setItem("userId", user.id);
      return toast.success(`Welcome, ${values.userName}`);
    } catch (e) {
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "createBudget") {
    try {
      await createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
        categories: values.newBudgetCategories
      });
      return toast.success("Budget created!");
    } catch (e) {
      throw new Error("There was a problem creating your budget.");
    }
  }

  if (_action === "createExpense") {
    try {
      await createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
        type: values.newExpenseType,
        category: values.newExpenseCategory
      });
      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      await deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const Dashboard = () => {
  const { userName, budgets, expenses } = useLoaderData();
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTotalSpent = async () => {
      try {
        const total = await calculateTotalSpent(budgets);
        setTotalSpent(total);
      } catch (error) {
        console.error("Error calculating total spent:", error);
        toast.error("Failed to calculate total balance");
      } finally {
        setLoading(false);
      }
    };

    if (budgets?.length) {
      loadTotalSpent();
    } else {
      setLoading(false);
    }
  }, [budgets]);

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <h3>
            Total Balance = {loading ? (
              <div className="loading-spinner" style={{ display: 'inline-flex', marginLeft: '10px' }}>
                <LoadingSpinner />
              </div>
            ) : (
              formatCurrency(totalSpent)
            )}
          </h3>

          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Existing Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to="expenses" className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Personal budgeting is the secret to financial freedom.</p>
                <p>Create a budget to get started!</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default Dashboard;
