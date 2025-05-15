// rrd imports
import { useLoaderData } from "react-router-dom";

// library import
import { toast } from "react-toastify";

// component imports
import Table from "../components/Table";

// helpers
import { deleteItem, getAllMatchingItems, getUserId } from "../helpers";

// loader
export async function expensesLoader() {
  const userId = getUserId();
  if (!userId) return { expenses: [] };

  // Get all budgets for the user
  const budgets = await getAllMatchingItems({
    category: "budgets",
    key: "userId",
    value: userId,
  });

  // Get expenses for all budgets
  let allExpenses = [];
  for (const budget of budgets) {
    const expenses = await getAllMatchingItems({
      category: "expenses",
      key: "budgetId",
      value: budget.id,
    });
    allExpenses = [...allExpenses, ...expenses];
  }

  return { expenses: allExpenses };
}

// action
export async function expensesAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

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

const ExpensesPage = () => {
  const { expenses } = useLoaderData();

  return (
    <div className="grid-lg">
      <h1>All Expenses</h1>
      {expenses && expenses.length > 0 ? (
        <div className="grid-md">
          <h2>
            Recent Expenses <small>({expenses.length} total)</small>
          </h2>
          <Table expenses={expenses} />
        </div>
      ) : (
        <p>No Expenses to show</p>
      )}
    </div>
  );
};

export default ExpensesPage;
