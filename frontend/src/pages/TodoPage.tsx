import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { getTasks, addTask, updateTask } from "../services/todoService";
import { Todo } from "../types/todo";
import toast from "react-hot-toast";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getTasks();
        setTodos(data);
      } catch {
        setError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (todo: Todo) => {
    try {
      await addTask(todo);
      const updated = await getTasks();
      setTodos(updated);
      toast.success("Task added successfully!");
    } catch {
      toast.error("Failed to add task");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateTask(id);
      const updated = await getTasks();
      setTodos(updated);
      toast.success("Task marked as done!");
    } catch {
      toast.error("Failed to update task");
    }
  };

  if (loading) {
    // Keep UI stable, avoid flicker
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row justify-center items-start p-6 md:p-12 gap-8 transition-all">
      {/* Left Side */}
      <div className="flex-1 p-4 md:p-8">
        <TodoForm onAdd={handleAdd} />
      </div>

      {/* Divider line */}
      <div className="hidden md:block w-px bg-gray-300 self-stretch" />
      <div className="block md:hidden h-px bg-gray-300 w-full" />

      {/* Right Side */}
      <div className="flex-1 p-4 md:p-8">
        {error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <TodoList todos={todos} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );
}