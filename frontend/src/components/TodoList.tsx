import { Todo } from "../types/todo";

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: number) => void;
}

export default function TodoList({ todos , onUpdate }: TodoListProps) {
  if (!todos.length)
    return <p className="text-center text-gray-500">No tasks yet</p>;

  return (
    <div className="space-y-4">
      {todos.map((task) => (
        <div
          key={task.id ?? task.title}
          className="bg-gray-200 rounded-xl p-4 flex justify-between items-center shadow"
        >
          <div>
            <h3 className="font-bold text-lg">{task.title}</h3>
            <p className="text-sm text-gray-700">{task.description}</p>
          </div>
          <button
            className="border border-gray-500 px-3 py-1 rounded-md hover:bg-gray-300 transition"
            onClick={() => task.id !== undefined && onUpdate(task.id)}
          >
            Done
          </button>
        </div>
      ))}
    </div>
  );
}