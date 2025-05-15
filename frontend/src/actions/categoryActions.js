import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

export async function categoryAction({ request }) {
  const formData = await request.formData();
  const { _action, budgetId } = Object.fromEntries(formData);

  // Get the current budget
  const res = await fetch(`http://localhost:5000/api/budgets/${budgetId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch budget");
  }
  const budget = await res.json();
  const currentCategories = budget.categories || [];

  try {
    switch (_action) {
      case "addCategory": {
        const newCategory = formData.get("newCategory");
        if (!newCategory) throw new Error("Category name is required");
        
        // Check if category already exists
        if (currentCategories.includes(newCategory)) {
          toast.error("This category already exists!");
          return redirect(`/budget/${budgetId}`);
        }
        
        const updatedCategories = [...currentCategories, newCategory];
        console.log("Current categories:", currentCategories);
        console.log("Updated categories:", updatedCategories);
        
        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categories: updatedCategories }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Failed to add category:", error);
          throw new Error("Failed to add category");
        }

        toast.success(`Added category ${newCategory}`);
        return redirect(`/budget/${budgetId}`);
      }

      case "deleteCategory": {
        const categoryToDelete = formData.get("categoryToDelete");
        if (!categoryToDelete) throw new Error("Category to delete is required");

        const updatedCategories = currentCategories.filter(
          (cat) => cat !== categoryToDelete
        );
        console.log("Current categories:", currentCategories);
        console.log("Updated categories after delete:", updatedCategories);

        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categories: updatedCategories }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Failed to delete category:", error);
          throw new Error("Failed to delete category");
        }

        toast.success(`Deleted category ${categoryToDelete}`);
        return redirect(`/budget/${budgetId}`);
      }

      case "editCategory": {
        const oldCategory = formData.get("oldCategory");
        const newCategory = formData.get("newCategory");
        
        if (!oldCategory || !newCategory) {
          throw new Error("Both old and new category names are required");
        }

        // Check if new category name already exists
        if (currentCategories.includes(newCategory) && oldCategory !== newCategory) {
          toast.error("This category name already exists!");
          return redirect(`/budget/${budgetId}`);
        }

        const updatedCategories = currentCategories.map((cat) =>
          cat === oldCategory ? newCategory : cat
        );
        console.log("Current categories:", currentCategories);
        console.log("Updated categories after edit:", updatedCategories);

        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categories: updatedCategories }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Failed to edit category:", error);
          throw new Error("Failed to edit category");
        }

        toast.success(`Updated category ${oldCategory} to ${newCategory}`);
        return redirect(`/budget/${budgetId}`);
      }

      default:
        throw new Error("Unknown action");
    }
  } catch (error) {
    console.error("Error in categoryAction:", error);
    toast.error(error.message);
    return error;
  }
} 