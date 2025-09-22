import { create } from "zustand";
import { apiCategory } from "@repo/api-client/apis";
import { useUIStore } from "./useUIStore";

const { setLoading, setError, setMessage } = useUIStore.getState();
export const useCategoryStore = create<State>((set) => ({
  categories: [],
  checkCategories: async () => {
    try {
      setLoading(true);
      const hasCategories = await apiCategory.checkCategories();
      return hasCategories;
    } catch (error) {
      setError("Failed to check categories");
      return false;
    } finally {
      setLoading(false);
    }
  },
  fetchCategories: async () => {
    try {
      setLoading(true);
      const categories = await apiCategory.getCategories();
      console.log("Fetched categories:", categories);

      set({ categories });
    } catch (error) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  },
  createCategory: async (categoryData) => {
    try {
      setLoading(true);
      const newCategory = await apiCategory.createCategory(categoryData);
      set((state) => ({ categories: [...state.categories, newCategory] }));
    } catch (error: Error | any) {
      setError(error.message || "Failed to create category");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  createCategories: async (categoriesData) => {
    try {
      setLoading(true);
      const newCategories = await apiCategory.createCategories(categoriesData);
      set((state) => ({ categories: [...state.categories, ...newCategories] }));
    } catch (error) {
      console.error("Failed to create categories", error);
      setError("Failed to create categories");
      throw error;
    } finally {
      setLoading(false);
    }
  },
  updateCategory: async (categoryId, categoryData) => {
    try {
      setLoading(true);
      const updatedCategory = await apiCategory.updateCategory(
        categoryId,
        categoryData
      );
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === categoryId ? updatedCategory : cat
        ),
      }));
    } catch (error) {
      setError("Failed to update category");
    } finally {
      setLoading(false);
    }
  },
  deleteCategory: async (categoryId) => {
    try {
      setLoading(true);
      await apiCategory.deleteCategory(categoryId);
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== categoryId),
      }));
    } catch (error) {
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  },
}));

type category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  _count?: {
    emails: number;
  };
};
type State = {
  categories: category[];
  checkCategories: () => Promise<boolean>;
  fetchCategories: () => Promise<void>;
  createCategory: (categoryData: {
    name: string;
    description: string;
    icon?: string;
  }) => Promise<void>;
  createCategories: (
    categoriesData: { name: string; description: string; icon?: string }[]
  ) => Promise<void>;
  updateCategory: (
    categoryId: string,
    categoryData: { name: string; description: string }
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
};
