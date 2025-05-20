import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  isCompleted: z.boolean().optional().default(false),
});

export const updateTodoSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  isCompleted: z.boolean(),
});

export const deleteTodoSchema = z.object({
  id: z.number(),
});

export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  isCompleted: z.boolean(),
});

export const todoArraySchema = z.array(todoSchema);
