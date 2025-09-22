import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long'),
  description: z.string().max(200, 'Description is too long'),
  icon: z.string().optional()
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long').optional(),
  description: z.string().max(200, 'Description is too long').optional(),
  icon: z.string().optional()
});

export const createCategoriesSchema = z.object({
  categories: z.array(createCategorySchema)
    .min(2, 'At least 2 categories are required')
    .max(4, 'Maximum 4 categories allowed'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateCategoriesInput = z.infer<typeof createCategoriesSchema>; 