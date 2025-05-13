import { postTodoSchema, updateTodoSchema, getSingleTodoSchema } from "../../src/configs/zodConfig";

describe("Zod Schema Validation", () => {
  test("Valid postTodoSchema passes", () => {
    const input = {
      title: "Do laundry",
      body: "Use detergent",
      isCompleted: false,
    };

    const result = postTodoSchema.parse(input);
    expect(result).toEqual(input);
  });

  test("Invalid postTodoSchema throws (title too long)", () => {
    const input = {
      title: "This title is way more than twenty characters",
      body: "Oops",
      isCompleted: true,
    };

    expect(() => postTodoSchema.parse(input)).toThrow();
  });

  test("Valid updateTodoSchema with partial fields", () => {
    const input = {
      id: 1,
      isCompleted: true,
    };

    const result = updateTodoSchema.parse(input);
    expect(result).toEqual(input);
  });

  test("Invalid getSingleTodoSchema (string instead of number)", () => {
    expect(() => getSingleTodoSchema.parse("abc")).toThrow();
  });
});
