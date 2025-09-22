import { api } from "./axiosInstance";
import axios, { AxiosError } from "axios";
import { handleError } from "./handleError";

interface Category {
  id: string;
  name: string;
  description: string;
  userId: string;
}

interface CategoryInput {
  name: string;
  description: string;
  icon?: string; // Optional icon field
}




const validateCategory = (category: CategoryInput): void => {
  if (!category.name || category.name.trim() === "" || category.description.trim() === "") {
    throw new Error("Name and description are required");
  }
  if (category.description && category.description.length > 100) {
    throw new Error("Description cannot exceed 100 characters");
  }
};

const validateCategories = (categories: CategoryInput[]): void => {
  if (!Array.isArray(categories)) {
    throw new Error("Categories must be an array");
  }
  if (categories.length === 0) {
    throw new Error("At least one category is required");
  }
  if (categories.length > 4) {
    throw new Error("Cannot create more than 4 categories at once");
  }
  categories.forEach(validateCategory);
};

const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const checkCategories = async (): Promise<boolean> => {
  try {
    const response = await api.get<{ hasCategories: boolean }>("/categories/setup-status");
    return response.data.hasCategories;
  } catch (error) {
    return handleError(error);
  }
};

const createCategory = async (category: CategoryInput): Promise<Category> => {
  validateCategory(category);

  try {
    const response = await api.post<Category>("/categories", category);
    return response.data;
  } catch (error) {
    console.log(error);
    
    return handleError(error);
  }
}

const createCategories = async (categories: CategoryInput[]): Promise<Category[]> => {
  validateCategories(categories);

  try {
    console.log("Creating categories:", categories);
    
    const response = await api.post<Category[]>("/categories/bulk", { categories });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateCategory = async (categoryId: string, category: CategoryInput): Promise<Category> => {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }
  validateCategory(category);

  try {
    const response = await api.put<Category>(`/categories/${categoryId}`, category);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

const deleteCategory = async (categoryId: string): Promise<void> => {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  try {
    await api.delete(`/categories/${categoryId}`);
  } catch (error) {
    handleError(error);
  }
}

export const apiCategory = {
  checkCategories,
  getCategories,
  createCategory,
  createCategories,
  updateCategory,
  deleteCategory,
};