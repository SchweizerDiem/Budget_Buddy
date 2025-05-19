import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { getBudgets } from "../api";

export async function categoryAction({ request }) {
  const formData = await request.formData();
  const { _action, budgetId } = Object.fromEntries(formData);
  
  console.log("Action:", _action);
  console.log("Budget ID:", budgetId);

  try {
    // Get all budgets for the user
    const budgets = await getBudgets(localStorage.getItem("userId"));
    console.log("All budgets:", budgets);
    
    // Find the specific budget
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
      console.error("Budget not found:", budgetId);
      throw new Error("Budget not found");
    }
    console.log("Found budget:", budget);
    
    // Parse categories from the budget
    let currentCategories = [];
    if (budget.categories) {
      if (typeof budget.categories === 'string') {
        currentCategories = budget.categories.split(',').filter(cat => cat.length > 0);
      } else if (Array.isArray(budget.categories)) {
        currentCategories = budget.categories;
      }
    }
    console.log("Parsed current categories:", currentCategories);

    switch (_action) {
      case "addCategory": {
        const newCategory = formData.get("newCategory");
        console.log("New category to add:", newCategory);
        
        if (!newCategory) throw new Error("Category name is required");
        
        // Check if category already exists
        if (currentCategories.includes(newCategory)) {
          console.log("Category already exists:", newCategory);
          toast.error("This category already exists!");
          return redirect(`/budget/${budgetId}`);
        }
        
        const updatedCategories = [...currentCategories, newCategory];
        console.log("Current categories:", currentCategories);
        console.log("Updated categories:", updatedCategories);
        
        const categoriesString = updatedCategories.join(',');
        console.log("Categories string to send:", categoriesString);
        
        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categories: categoriesString }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Failed to add category. Status:", response.status);
          console.error("Error response:", error);
          throw new Error("Failed to add category");
        }

        const responseData = await response.json();
        console.log("Add category response:", responseData);

        toast.success(`Added category ${newCategory}`);
        return redirect(`/budget/${budgetId}`);
      }

      case "deleteCategory": {
        const categoryToDelete = formData.get("categoryToDelete");
        console.log("Category to delete:", categoryToDelete);
        
        if (!categoryToDelete) throw new Error("Category to delete is required");

        const updatedCategories = currentCategories.filter(
          (cat) => cat !== categoryToDelete
        );
        console.log("Current categories:", currentCategories);
        console.log("Updated categories after delete:", updatedCategories);

        const categoriesString = updatedCategories.join(',');
        console.log("Categories string to send:", categoriesString);

        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categories: categoriesString }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Failed to delete category. Status:", response.status);
          console.error("Error response:", error);
          throw new Error("Failed to delete category");
        }

        const responseData = await response.json();
        console.log("Delete category response:", responseData);

        toast.success(`Deleted category ${categoryToDelete}`);
        return redirect(`/budget/${budgetId}`);
      }

      case "editCategory": {
        const oldCategory = formData.get("oldCategory");
        const newCategory = formData.get("newCategory");
        console.log("Edit category - Old:", oldCategory, "New:", newCategory);
        
        if (!oldCategory || !newCategory) {
          throw new Error("Both old and new category names are required");
        }

        // Check if new category name already exists
        if (currentCategories.includes(newCategory) && oldCategory !== newCategory) {
          console.log("New category name already exists:", newCategory);
          toast.error("This category name already exists!");
          return redirect(`/budget/${budgetId}`);
        }

        const updatedCategories = currentCategories.map((cat) =>
          cat === oldCategory ? newCategory : cat
        );
        console.log("Current categories:", currentCategories);
        console.log("Updated categories after edit:", updatedCategories);

        const categoriesString = updatedCategories.join(',');
        console.log("Categories string to send:", categoriesString);

        const response = await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categories: categoriesString }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("Failed to edit category. Status:", response.status);
          console.error("Error response:", error);
          throw new Error("Failed to edit category");
        }

        const responseData = await response.json();
        console.log("Edit category response:", responseData);

        toast.success(`Updated category ${oldCategory} to ${newCategory}`);
        return redirect(`/budget/${budgetId}`);
      }

      default:
        console.error("Unknown action:", _action);
        throw new Error("Unknown action");
    }
  } catch (error) {
    console.error("Error in categoryAction:", error);
    toast.error(error.message);
    return error;
  }
} 