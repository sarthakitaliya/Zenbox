import { Request, Response, NextFunction } from "express";
import { create_category, delete_category, get_categories, update_category, create_categories, check_categories } from "../services/categories.service";
import { ValidationError, NotFoundError } from "../utils/errors";
import { createCategorySchema, updateCategorySchema, createCategoriesSchema } from "../schemas/category.schema";

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await get_categories(req.user.id);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const checkCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hasCategories = await check_categories(req.user.id);
    res.json({ hasCategories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = createCategorySchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Invalid input";
      throw new ValidationError(errorMessage);
    }

    const { name, description, icon } = validationResult.data;
    const category = await create_category(req.user.id, name, description, icon);
    res.status(201).json(category);
  } catch (error) {
    console.log("Error creating category:", error);
    
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      throw new ValidationError("Category ID is required");
    }
    const validationResult = createCategorySchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Invalid input";
      throw new ValidationError(errorMessage);
    }

    const { name, description } = validationResult.data;

    const category = await update_category(req.user.id, categoryId, name, description);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      throw new ValidationError("Category ID is required");
    }

    const deleted = await delete_category(req.user.id, categoryId);
    if (!deleted) {
      throw new NotFoundError("Category not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = createCategoriesSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || "Invalid input";
      throw new ValidationError(errorMessage);
    }

    const categories = await create_categories(req.user.id, validationResult.data.categories);
    res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
};