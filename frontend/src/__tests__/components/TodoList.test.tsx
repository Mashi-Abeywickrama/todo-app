import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "../../components/TodoList";
import { Todo } from "../../types/todo";

describe("TodoList", () => {
  test("renders 'No tasks yet' when todos array is empty", () => {
    const mockUpdate = jest.fn();
    render(<TodoList todos={[]} onUpdate={mockUpdate} />);

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  test("renders todo items when provided", () => {
    const mockUpdate = jest.fn();
    const todos: Todo[] = [
      { id: 1, title: "Learn React", description: "Practice components" },
      { id: 2, title: "Write Tests", description: "Use React Testing Library" },
    ];

    render(<TodoList todos={todos} onUpdate={mockUpdate} />);

    // Check if both tasks are rendered
    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.getByText("Practice components")).toBeInTheDocument();
    expect(screen.getByText("Write Tests")).toBeInTheDocument();
    expect(screen.getByText("Use React Testing Library")).toBeInTheDocument();
  });

  test("calls onUpdate with correct id when Done is clicked", () => {
    const mockUpdate = jest.fn();
    const todos: Todo[] = [
      { id: 5, title: "Finish Homework", description: "Math and Science" },
    ];

    render(<TodoList todos={todos} onUpdate={mockUpdate} />);

    const button = screen.getByRole("button", { name: /done/i });
    fireEvent.click(button);

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(5);
  });

  test("does not call onUpdate if todo has no id", () => {
    const mockUpdate = jest.fn();
    const todos: Todo[] = [
      { title: "Untitled", description: "Missing ID" }, // no id
    ];

    render(<TodoList todos={todos} onUpdate={mockUpdate} />);

    const button = screen.getByRole("button", { name: /done/i });
    fireEvent.click(button);

    expect(mockUpdate).not.toHaveBeenCalled();
  });
});