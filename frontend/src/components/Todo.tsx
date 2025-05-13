import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

const URL = import.meta.env.VITE_URL;

type Todo = {
  id: number;
  title: string;
  body: string;
  isCompleted: boolean;
};

const Todos: React.FC = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: "", body: "", isCompleted: false });

  const { data, isLoading, isError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axios.get(`${URL}/api/todo`);
      return response.data;
    },
  });

  const createTodo = useMutation({
    mutationFn: async (newTodo: Omit<Todo, "id">) =>
      await axios.post(`${URL}/api/todo`, newTodo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: number) =>
      await axios.delete(`${URL}/api/todo/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const updateTodo = useMutation({
    mutationFn: async (todo: Todo) =>
      await axios.patch(`${URL}/api/todo/${todo.id}`, todo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return alert("Fill in all fields");
    createTodo.mutate(form);
    setForm({ title: "", body: "", isCompleted: false });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Todo List</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            id="completed"
            checked={form.isCompleted}
            onCheckedChange={(checked) =>
              setForm({ ...form, isCompleted: Boolean(checked) })
            }
          />
          <label htmlFor="completed" className="text-sm">
            Completed
          </label>
        </div>
        <Button type="submit">Add Todo</Button>
      </form>

      <div className="space-y-4">
        {data?.map((todo) => (
          <div
            key={todo.id}
            className="border p-4 rounded shadow flex justify-between items-center"
            data-testid="todos"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.isCompleted}
                onCheckedChange={() =>
                  updateTodo.mutate({
                    ...todo,
                    isCompleted: !todo.isCompleted,
                  })
                }
                className="my-auto"
              />
              <div className="flex flex-col justify-center">
                <h2
                  className={`text-lg font-semibold ${
                    todo.isCompleted ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.title}
                </h2>
                <p
                  className={`text-sm ${
                    todo.isCompleted ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.body}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteTodo.mutate(todo.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;
