// rrd imports
import { Form, Link } from "react-router-dom";
import { useState, useEffect } from "react";

// library imports
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/outline";

// components
import LoadingSpinner from "./LoadingSpinner";

// helper functions
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helpers";

const BudgetItem = ({ budget, showDelete = false }) => {
  const { id, name, amount, color } = budget;
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpentAmount = async () => {
      try {
        const spentAmount = await calculateSpentByBudget(id);
        setSpent(spentAmount);
      } catch (error) {
        console.error("Error loading spent amount:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSpentAmount();
  }, [id]);

  return (
    <div
      className="budget"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} Budgeted</p>
      </div>
      {loading ? (
        <div className="loading-spinner">
          <LoadingSpinner />
          <p className="loading-text">Calculating spent amount...</p>
        </div>
      ) : (
        <>
          <progress max={amount} value={spent}>
            {formatPercentage(spent / amount)}
          </progress>
          <div className="progress-text">
            <small>{formatCurrency(spent)} spent</small>
            <small>{formatCurrency(amount - spent)} remaining</small>
          </div>
        </>
      )}
      {showDelete ? (
        <div className="flex-sm">
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Are you sure you want to permanently delete this budget?"
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="btn">
              <span>Delete Budget</span>
              <TrashIcon width={20} />
            </button>
          </Form>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`/budget/${id}`} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  );
};
export default BudgetItem;
