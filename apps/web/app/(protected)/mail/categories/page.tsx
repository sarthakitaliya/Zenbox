"use client";

import { CreateCategoryModal } from "@/components/mail/CreateCategoryModal";
import { EditCategoryModal } from "@/components/mail/EditCategoryModal";
import { useCategoryStore, useUIStore } from "@repo/store";
import { Folder, Menu, Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MAX_CATEGORIES = 4;

export default function CategoriesPage() {
  const { fetchCategories, categories } = useCategoryStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const { setSidebarOpen, sidebarOpen } = useUIStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoryCount = categories.length;
  const canCreateMore = categoryCount < MAX_CATEGORIES;
  const categoryLimitText = useMemo(
    () => `${categoryCount}/${MAX_CATEGORIES} categories used`,
    [categoryCount]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-[#1A1A1A]">
        <div className="flex items-center justify-between border-b border-[#3f3f3f7a] px-4 py-3 sm:px-5 sm:py-4">
          <div className="cursor-pointer">
            <Menu
              size={17}
              className="text-gray-400 transition hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={!canCreateMore}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3a3a3a] bg-[#242424] px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:bg-[#2d2d2d] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            title={
              canCreateMore
                ? "Create a new category"
                : `Maximum of ${MAX_CATEGORIES} categories reached`
            }
          >
            <Plus className="h-4 w-4" />
            Create Category
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-4 sm:p-5 scrollbar-custom">
        <div className="mb-5 rounded-xl border border-[#2c2c2c] bg-[#171717] p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-100">Categories</h2>
            <p className="mt-1 text-sm text-gray-400">
              Manage your custom categories for email organization.
            </p>
            <p className="mt-2 text-xs text-gray-500">{categoryLimitText}</p>
          </div>

          {categoryCount === 0 ? (
            <div className="rounded-lg border border-[#2f2f2f] bg-[#141414] p-6">
              <p className="text-sm text-gray-300">No categories found.</p>
              <p className="mt-1 text-xs text-gray-500">
                Add at least one category to start organizing your inbox.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-lg border border-[#303030] bg-[#141414] p-4 transition hover:border-[#4a4a4a]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 items-center gap-2">
                      <Folder className="h-5 w-5 text-gray-400 shrink-0" />
                      <h3 className="truncate text-lg font-semibold capitalize text-gray-100">
                        {category.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCategory({
                          id: category.id,
                          name: category.name,
                          description: category.description ?? "",
                        })
                      }
                      className="cursor-pointer text-gray-500 transition hover:text-gray-300"
                      title="Edit category"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">{category.description}</p>

                  <span className="mt-3 inline-block rounded-full bg-[#242424] px-2.5 py-1 text-xs font-medium text-gray-300">
                    {category._count?.emails ?? 0} email
                    {(category._count?.emails ?? 0) === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <EditCategoryModal
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        categoryId={editingCategory?.id ?? ""}
        initialName={editingCategory?.name ?? ""}
        initialDescription={editingCategory?.description ?? ""}
      />
    </div>
  );
}
