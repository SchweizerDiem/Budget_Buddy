// rrd imports
import { useLoaderData } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import CategoryManager from "../components/CategoryManager";
import MonthSelector from "../components/MonthSelector";
import MonthlyStats from "../components/MonthlyStats";

// helpers
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers";
import { useState, useCallback } from "react";

// loader
export async function budgetLoader({ params }) {
  const budgets = await getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: params.id,
  });

  const budget = budgets[0];

  if (!budget) {
    throw new Error("The budget you're trying to find doesn't exist");
  }

  const expenses = await getAllMatchingItems({
    category: "expenses",
    key: "budgetId",
    value: params.id,
  });

  return { budget, expenses };
}

// action
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

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

  if (_action === "addCategory") {
    try {
      const budgets = await getAllMatchingItems({
        category: "budgets",
        key: "id",
        value: values.budgetId,
      });
      
      if (!budgets || budgets.length === 0) {
        throw new Error("Budget not found");
      }

      const budget = budgets[0];
      console.log("Current budget:", budget); // Debug log
      
      // Convert comma-separated string to array
      const currentCategories = budget.categories ? budget.categories.split(',').filter(cat => cat.length > 0) : [];
      
      if (currentCategories.includes(values.newCategory)) {
        return toast.error("This category already exists!");
      }

      currentCategories.push(values.newCategory);
      console.log("Updated categories:", currentCategories); // Debug log
      
      const response = await fetch(`/api/budgets/${values.budgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          categories: currentCategories.join(',')
        }),
      });

      console.log("Response status:", response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText); // Debug log
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to update categories");
        } catch (parseError) {
          throw new Error(`Server error: ${errorText || response.statusText}`);
        }
      }
      
      const responseData = await response.json();
      console.log("Success response:", responseData); // Debug log
      
      return toast.success("Category added!");
    } catch (e) {
      console.error("Error adding category:", e);
      return toast.error(e.message || "There was a problem adding the category.");
    }
  }

  if (_action === "deleteCategory") {
    try {
      const budgets = await getAllMatchingItems({
        category: "budgets",
        key: "id",
        value: values.budgetId,
      });
      
      if (!budgets || budgets.length === 0) {
        throw new Error("Budget not found");
      }

      const budget = budgets[0];
      console.log("Current budget:", budget); // Debug log
      
      if (!budget.categories) {
        throw new Error("No categories found for this budget");
      }

      // Convert comma-separated string to array, filter, then back to string
      const currentCategories = budget.categories.split(',').filter(cat => cat.length > 0);
      const updatedCategories = currentCategories.filter(cat => cat !== values.categoryToDelete);
      console.log("Updated categories:", updatedCategories); // Debug log
      
      const response = await fetch(`/api/budgets/${values.budgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          categories: updatedCategories.join(',')
        }),
      });

      console.log("Response status:", response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText); // Debug log
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to update categories");
        } catch (parseError) {
          throw new Error(`Server error: ${errorText || response.statusText}`);
        }
      }
      
      const responseData = await response.json();
      console.log("Success response:", responseData); // Debug log
      
      return toast.success("Category deleted!");
    } catch (e) {
      console.error("Error deleting category:", e);
      return toast.error(e.message || "There was a problem deleting the category.");
    }
  }

  if (_action === "editCategory") {
    try {
      const budgets = await getAllMatchingItems({
        category: "budgets",
        key: "id",
        value: values.budgetId,
      });
      
      if (!budgets || budgets.length === 0) {
        throw new Error("Budget not found");
      }

      const budget = budgets[0];
      console.log("Current budget:", budget); // Debug log
      
      if (!budget.categories) {
        throw new Error("No categories found for this budget");
      }

      // Convert comma-separated string to array
      const currentCategories = budget.categories.split(',').filter(cat => cat.length > 0);
      
      if (currentCategories.includes(values.newCategory)) {
        return toast.error("This category already exists!");
      }

      const updatedCategories = currentCategories.map(cat => 
        cat === values.oldCategory ? values.newCategory : cat
      );
      console.log("Updated categories:", updatedCategories); // Debug log

      const response = await fetch(`/api/budgets/${values.budgetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          categories: updatedCategories.join(',')
        }),
      });

      console.log("Response status:", response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText); // Debug log
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to update categories");
        } catch (parseError) {
          throw new Error(`Server error: ${errorText || response.statusText}`);
        }
      }

      const responseData = await response.json();
      console.log("Success response:", responseData); // Debug log

      // Update all expenses with the old category
      const expenses = await getAllMatchingItems({
        category: "expenses",
        key: "budgetId",
        value: values.budgetId,
      });

      for (const expense of expenses) {
        if (expense.category === values.oldCategory) {
          const expenseResponse = await fetch(`/api/expenses/${expense.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              category: values.newCategory,
            }),
          });

          if (!expenseResponse.ok) {
            console.error(`Failed to update expense ${expense.id}`);
          }
        }
      }

      return toast.success("Category updated!");
    } catch (e) {
      console.error("Error updating category:", e);
      return toast.error(e.message || "There was a problem updating the category.");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  const handleMonthChange = useCallback((selectedMonth) => {
    const [year, month] = selectedMonth.split('-');
    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.createdAt);
      return (
        expenseDate.getFullYear() === parseInt(year) &&
        expenseDate.getMonth() === parseInt(month) - 1
      );
    });
    setFilteredExpenses(filtered);
  }, [expenses]);

  return (
    <div
      className="grid-lg"
      style={{
        "--accent": budget.color,
      }}
    >
      <h1 className="h2">
        <span className="accent">{budget.name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} />
      </div>
      <CategoryManager budget={budget} />
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <MonthSelector onMonthChange={handleMonthChange} />
          <MonthlyStats expenses={filteredExpenses} />
          <Table expenses={filteredExpenses} showBudget={false} />
        </div>
      )}
    </div>
  );
};
export default BudgetPage;
