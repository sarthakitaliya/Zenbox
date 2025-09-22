"use client";
import { CreateCategoryModal } from "@/components/mail/CreateCategoryModal";
import { useCategoryStore, useUIStore } from "@repo/store";
import { useEffect, useState } from "react";
import { Folder, Menu, Pencil } from "lucide-react";

export default function CategoriesPage() {
  const { fetchCategories, categories, createCategory } = useCategoryStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { setSidebarOpen, sidebarOpen } = useUIStore();

  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };
    loadCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (name: string, description: string) => {
    await createCategory({ name, description });
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <p className="text-gray-700">No categories found.</p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create Category
        </button>
        <CreateCategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-5 m-5">
      <div className="cursor-pointer mb-">
        <Menu
          size={17}
          className="text-gray-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Categories</h2>
          <p className="text-gray-500 mb-4">
            Here are your custom categories. You can use these to organize your
            emails.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Create Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition flex flex-col gap-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <h3 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-100">
                  {category.name}
                </h3>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition cursor-pointer"
                title="Edit category"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {category.description}
            </p>
            <span className="mt-2 inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full w-max">
              {category._count?.emails ?? 0} email
              {category._count?.emails === 1 ? "" : "s"}
            </span>
          </div>
        ))}
      </div>
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
