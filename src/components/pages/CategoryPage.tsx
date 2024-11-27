import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AxiosBase from "@/lib/axios";
import { FaSpinner, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useCategory";
import ConfirmModel from "../shared/ConfirmModel";

export default function CategoryPage() {
  const queryClient = useQueryClient();

  const [categoryName, setCategoryName] = useState<string>("");
  const [subCategoryName, setSubCategoryName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editCategory, setEditCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: categories = [], isLoading, isError } = useCategories();

  const createCategoryMutation = useMutation({
    mutationFn: async ({
      name,
      parentId,
    }: {
      name: string;
      parentId?: string;
    }) => {
      const { data } = await AxiosBase.post("/api/admin/category/create", {
        name,
        parentId,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategoryName("");
    },
    onError: () => {
      toast.error("Failed to create category.");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await AxiosBase.put(`/api/admin/category/update/${id}`, {
        name,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditCategory(null);
    },
    onError: () => {
      toast.error("Failed to update category.");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await AxiosBase.delete(
        `/api/admin/category/delete/${id}`
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to delete category.");
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return toast.error("Category name cannot be empty.");
    createCategoryMutation.mutate({ name: categoryName });
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory?.name)
      return toast.error("Category name cannot be empty.");
    updateCategoryMutation.mutate({
      id: editCategory.id,
      name: editCategory.name,
    });
  };

  const handleAddSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategoryName || !selectedCategory)
      return toast.error(
        "Please select a category and provide a subcategory name."
      );
    createCategoryMutation.mutate({
      name: subCategoryName,
      parentId: selectedCategory,
    });
    setSubCategoryName("");
    setSelectedCategory("");
  };

  return (
    <div className="min-h-screen  p-2 lg:p-6 ">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Category Manager
      </h1>

      {/* Form Section */}
      <div className="bg-gray-50 dark:bg-gray-800 shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {editCategory ? "Edit Category" : "Create Category"}
        </h2>
        <form
          onSubmit={editCategory ? handleUpdateCategory : handleCreateCategory}
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={editCategory ? editCategory.name : categoryName}
              onChange={(e) =>
                editCategory
                  ? setEditCategory({ ...editCategory, name: e.target.value })
                  : setCategoryName(e.target.value)
              }
              placeholder="Enter category name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <Button
              type="submit"
              disabled={
                createCategoryMutation.isPending ||
                updateCategoryMutation.isPending
              }
            >
              {createCategoryMutation.isPending ||
              updateCategoryMutation.isPending ? (
                <FaSpinner className="animate-spin" />
              ) : editCategory ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-gray-50 dark:bg-gray-800 shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Categories
        </h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-500">
            Failed to load categories. Please try again.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <li
                key={category.id}
                className="py-4 flex justify-between items-center"
              >
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {category.name}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditCategory({ id: category.id, name: category.name })
                    }
                  >
                    <FaEdit /> Edit
                  </Button>
                  <ConfirmModel
                    onConfirm={() => deleteCategoryMutation.mutate(category.id)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </ConfirmModel>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Subcategory Form */}
      <div className="bg-gray-50 dark:bg-gray-800 shadow rounded p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Add Subcategory
        </h2>
        <form onSubmit={handleAddSubCategory}>
          <div className="flex flex-col gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <Button disabled={createCategoryMutation.isPending} type="submit">
              <FaPlus /> Add Subcategory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
