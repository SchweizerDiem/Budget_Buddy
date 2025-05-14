// rrd imports
import { useLoaderData } from "react-router-dom";

// library
import { toast } from "react-toastify";

// components
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";
import CategoryManager from "../components/CategoryManager";

// helpers
import { createExpense, deleteItem, getAllMatchingItems, fetchData } from "../helpers";

// loader
export async function budgetLoader({ params }) {
  const budget = await getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: params.id,
  })[0];

  const expenses = await getAllMatchingItems({
    category: "expenses",
    key: "budgetId",
    value: params.id,
  });

  if (!budget) {
    throw new Error("The budget you're trying to find doesn't exist");
  }

  return { budget, expenses };
}

// action
export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createExpense") {
    try {
      createExpense({
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
      deleteItem({
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
      const existingBudgets = fetchData("budgets");
      const budget = existingBudgets.find(b => b.id === values.budgetId);
      
      if (budget.categories.includes(values.newCategory)) {
        return toast.error("This category already exists!");
      }

      budget.categories.push(values.newCategory);
      localStorage.setItem("budgets", JSON.stringify(existingBudgets));
      return toast.success("Category added!");
    } catch (e) {
      throw new Error("There was a problem adding the category.");
    }
  }

  if (_action === "deleteCategory") {
    try {
      const existingBudgets = fetchData("budgets");
      const budget = existingBudgets.find(b => b.id === values.budgetId);
      
      budget.categories = budget.categories.filter(cat => cat !== values.categoryToDelete);
      localStorage.setItem("budgets", JSON.stringify(existingBudgets));
      return toast.success("Category deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting the category.");
    }
  }

  if (_action === "editCategory") {
    try {
      const existingBudgets = fetchData("budgets");
      const budget = existingBudgets.find(b => b.id === values.budgetId);
      
      if (budget.categories.includes(values.newCategory)) {
        return toast.error("This category already exists!");
      }

      budget.categories = budget.categories.map(cat => 
        cat === values.oldCategory ? values.newCategory : cat
      );

      // Update all expenses with the old category to use the new category name
      const expenses = fetchData("expenses") ?? [];
      const updatedExpenses = expenses.map(expense => {
        if (expense.budgetId === values.budgetId && expense.category === values.oldCategory) {
          return { ...expense, category: values.newCategory };
        }
        return expense;
      });

      localStorage.setItem("budgets", JSON.stringify(existingBudgets));
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
      return toast.success("Category updated!");
    } catch (e) {
      throw new Error("There was a problem updating the category.");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

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
          <Table expenses={expenses} showBudget={false} />
        </div>
      )}
    </div>
  );
};
export default BudgetPage;
