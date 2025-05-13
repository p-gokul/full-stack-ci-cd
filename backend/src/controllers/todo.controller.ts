import {
  getSingleTodoSchema,
  postTodoSchema,
  updateTodoSchema,
} from "../configs/zodConfig";
import type { Request, Response } from "express";
import { z } from "zod";
import {
  createTodo,
  deleteTodoById,
  findTodoById,
  getAllTodos,
  updateTodoService,
} from "../services/todo.service";

const getTodos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todos = await getAllTodos();

    res.status(200).json(todos);
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getSingleTodoSchema.parse(parseInt(req.params.id));

    const todo = await findTodoById(id);

    if (!todo) {
      res.status(404).json({ error: "Invalid ID" });
      return;
    }
    res.status(200).json({ todo });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(406).json({ error: "Invalid Input type" });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const postTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = postTodoSchema.parse(req.body);
    const todo = await createTodo(validatedData);

    res.status(201).json({ message: "Todo created successfully", todo });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(406).json({ error: "Invalid Input Type" });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateTodoSchema.parse({
      id: parseInt(req.params.id),
      ...req.body,
    });

    const todo = await findTodoById(validatedData.id);

    if (!todo) {
      res.status(404).json({ error: "Invalid ID" });
      return;
    }

    const updatedTodo = await updateTodoService(validatedData);

    res.status(200).json({ message: "Todo Updated Successfully", updatedTodo });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(406).json({ error: "Invalid Input Type" });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getSingleTodoSchema.parse(parseInt(req.params.id));
    const todo = await findTodoById(id);

    if (!todo) {
      res.status(404).json({ error: "Invalid ID" });
      return;
    }
    await deleteTodoById(id);
    res.status(200).json({ message: `Todo of ID ${id} is deleted.` });
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(406).json({ error: "Invalid Input Type" });
      return;
    }
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};

export { getTodoById, getTodos, postTodo, updateTodo, deleteTodo };
