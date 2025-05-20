import {
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
  todoSchema,
  todoArraySchema,
} from "../src/lib/zodSchema";

describe("Zod Schema Validations", () => {
  test("createTodoSchema should pass valid data", () => {
    const result = createTodoSchema.safeParse({
      title: "Buy Milk",
      body: "Go to the store and buy milk",
    });

    expect(result.success).toBe(true);
    expect(result.success && result.data.isCompleted).toBe(false); // default applied
  });

  test("updateTodoSchema should pass with all fields", () => {
    const result = updateTodoSchema.safeParse({
      id: 1,
      title: "Update title",
      body: "Update body",
      isCompleted: true,
    });

    expect(result.success).toBe(true);
  });

  test("updateTodoSchema should fail missing id", () => {
    const result = updateTodoSchema.safeParse({
      title: "Update title",
      body: "Update body",
      isCompleted: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().id?._errors).toBeDefined();
    }
  });

  test("deleteTodoSchema should validate id only", () => {
    const result = deleteTodoSchema.safeParse({ id: 42 });
    expect(result.success).toBe(true);
  });

  test("todoSchema should pass valid todo object", () => {
    const result = todoSchema.safeParse({
      id: 101,
      title: "Test Todo",
      body: "Description",
      isCompleted: true,
    });

    expect(result.success).toBe(true);
  });

  test("todoArraySchema should pass array of todos", () => {
    const result = todoArraySchema.safeParse([
      {
        id: 1,
        title: "Todo 1",
        body: "Body 1",
        isCompleted: false,
      },
      {
        id: 2,
        title: "Todo 2",
        body: "Body 2",
        isCompleted: true,
      },
    ]);

    expect(result.success).toBe(true);
  });

  test("todoArraySchema should fail with invalid item", () => {
    const result = todoArraySchema.safeParse([
      {
        id: 1,
        title: "Todo 1",
        body: "Body 1",
        isCompleted: false,
      },
      {
        id: "not-a-number", // invalid
        title: "Todo 2",
        body: "Body 2",
        isCompleted: true,
      },
    ]);

    expect(result.success).toBe(false);
  });
});
