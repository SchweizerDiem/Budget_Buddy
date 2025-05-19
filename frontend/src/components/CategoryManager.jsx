// react imports
import { useState } from "react";

// rrd imports
import { useFetcher } from "react-router-dom";

// library imports
import { PlusCircleIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";

const CategoryManager = ({ budget }) => {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e, action, category = "") => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_action", action);
    formData.append("budgetId", budget.id);
    
    if (action === "deleteCategory") {
      formData.append("categoryToDelete", category);
    } else if (action === "editCategory") {
      formData.append("oldCategory", editingCategory);
      formData.append("newCategory", newCategory);
    } else if (action === "addCategory") {
      formData.append("newCategory", newCategory);
    }

    fetcher.submit(formData, { method: "post" });
    setNewCategory("");
    setIsEditing(false);
    setEditingCategory(null);
  };

  return (
    <div className="categories-wrapper">
      <h3>Store Categories</h3>
      <div className="categories-list">
        {budget.categories?.map((category) => (
          <div key={category} className="category-item">
            {editingCategory === category ? (
              <fetcher.Form 
                onSubmit={(e) => handleSubmit(e, "editCategory")}
                className="category-edit-form"
                method="post"
                action={`/budget/${budget.id}`}
              >
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder={category}
                  required
                />
                <button type="submit" className="btn btn--dark">
                  <PencilIcon width={20} />
                </button>
                <button 
                  type="button" 
                  className="btn btn--warning"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingCategory(null);
                    setNewCategory("");
                  }}
                >
                  <XMarkIcon width={20} />
                </button>
              </fetcher.Form>
            ) : (
              <>
                <span>{category}</span>
                <div className="category-actions">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingCategory(category);
                      setNewCategory(category);
                    }}
                    className="btn btn--dark"
                  >
                    <PencilIcon width={20} />
                  </button>
                  <fetcher.Form 
                    onSubmit={(e) => handleSubmit(e, "deleteCategory", category)}
                    className="category-delete-form"
                    method="post"
                    action={`/budget/${budget.id}`}
                  >
                    <button type="submit" className="btn btn--warning">
                      <TrashIcon width={20} />
                    </button>
                  </fetcher.Form>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {!isEditing && (
        <fetcher.Form 
          onSubmit={(e) => handleSubmit(e, "addCategory")}
          className="category-add-form"
          method="post"
          action={`/budget/${budget.id}`}
        >
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            required
          />
          <button type="submit" className="btn btn--dark">
            <PlusCircleIcon width={20} />
          </button>
        </fetcher.Form>
      )}
    </div>
  );
};

export default CategoryManager; 