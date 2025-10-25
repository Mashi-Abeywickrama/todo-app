import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { getTasks, addTask } from "../services/todoService";
import { Todo } from "../types/todo";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTodos(data);
    } catch (err) {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async (todo: Todo) => {
    try {
      await addTask(todo);
      loadTodos();
    } catch {
      alert("Error adding todo");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-center items-start bg-gray-100 p-6 gap-8">
      {/* Left Side */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
        <TodoForm onAdd={handleAdd} />
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl p-8">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <TodoList todos={todos} />
        )}
      </div>
    </div>
  );
}