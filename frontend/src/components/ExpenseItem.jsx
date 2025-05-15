// rrd imports
import { Link, useFetcher } from "react-router-dom";
import { useState, useEffect } from "react";

// library import
import { TrashIcon } from "@heroicons/react/24/solid";

// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudget = async () => {
      try {
        const [budgetData] = await getAllMatchingItems({
          category: "budgets",
          key: "id",
          value: expense.budgetId,
        });
        setBudget(budgetData);
      } catch (error) {
        console.error("Error loading budget:", error);
      } finally {
        setLoading(false);
      }
    };

    if (showBudget) {
      loadBudget();
    } else {
      setLoading(false);
    }
  }, [expense.budgetId, showBudget]);

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocaleString(expense.createdAt)}</td>
      <td>{expense.type}</td>
      <td>{expense.category}</td>
      {showBudget && (
        <td>
          {loading ? (
            <span>Loading...</span>
          ) : budget ? (
            <Link
              to={`/budget/${budget.id}`}
              style={{
                "--accent": budget.color,
              }}
            >
              {budget.name}
            </Link>
          ) : (
            <span className="error">Budget not found</span>
          )}
        </td>
      )}
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="deleteExpense" />
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            type="submit"
            className="btn btn--warning"
            aria-label={`Delete ${expense.name} expense`}
          >
            <TrashIcon width={20} />
          </button>
        </fetcher.Form>
      </td>
    </>
  );
};
export default ExpenseItem;
