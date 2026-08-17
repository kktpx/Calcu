import { z } from "zod";

export const foodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  calories: z.number().min(0, "Calories must be positive"),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0),
  servingSize: z.string().min(1, "Serving size is required"),
});

export const profileUpdateSchema = z.object({
  age: z.coerce.number().min(10).max(120),
  gender: z.enum(['male', 'female', 'other']),
  heightCm: z.coerce.number().min(50).max(300),
  weightKg: z.coerce.number().min(20).max(500),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  fitnessGoal: z.enum(['lose', 'maintain', 'gain'])
});

export const weightRecordSchema = z.object({
  weightKg: z.coerce.number().min(1, "Weight must be positive"),
  date: z.string().optional()
});

export const mealItemSchema = z.object({
  foodId: z.string().min(1, "Food ID is required"),
  servingMultiplier: z.number().min(0.01, "Amount must be positive"),
  mealType: z.string().min(1, "Meal type is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
