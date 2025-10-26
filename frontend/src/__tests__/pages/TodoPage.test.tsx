import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TodoPage from "../../pages/TodoPage";
import { getTasks, addTask, updateTask } from "../../services/todoService";
import toast from "react-hot-toast";
import { Todo } from "../../types/todo";

// 🧠 Mock external dependencies
jest.mock("../../services/todoService");
jest.mock("react-hot-toast");

const mockGetTasks = getTasks as jest.Mock;
const mockAddTask = addTask as jest.Mock;
const mockUpdateTask = updateTask as jest.Mock;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("TodoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading message initially", async () => {
    mockGetTasks.mockResolvedValueOnce([]);
    render(<TodoPage />);

    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument()
    );
  });

  test("renders todos after successful fetch", async () => {
    const todos: Todo[] = [
      { id: 1, title: "Test Todo", description: "Check rendering" },
    ];
    mockGetTasks.mockResolvedValueOnce(todos);

    render(<TodoPage />);

    await waitFor(() =>
      expect(screen.getByText("Test Todo")).toBeInTheDocument()
    );

    expect(screen.getByText("Check rendering")).toBeInTheDocument();
  });

  test("shows error message when fetching fails", async () => {
    mockGetTasks.mockRejectedValueOnce(new Error("Server error"));

    render(<TodoPage />);

    await waitFor(() =>
      expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument()
    );
  });

  test("calls addTask and refreshes list on new todo", async () => {
    const todosAfterAdd: Todo[] = [
      { id: 1, title: "New Task", description: "Added successfully" },
    ];

    mockGetTasks
      .mockResolvedValueOnce([]) // initial load
      .mockResolvedValueOnce(todosAfterAdd); // after add
    mockAddTask.mockResolvedValueOnce(undefined);

    render(<TodoPage />);

    // Wait for initial load
    await waitFor(() =>
      expect(screen.queryByText(/loading tasks/i)).not.toBeInTheDocument()
    );

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Added successfully" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => expect(mockAddTask).toHaveBeenCalledTimes(1));
    expect(mockAddTask).toHaveBeenCalledWith({
      title: "New Task",
      description: "Added successfully",
    });
    expect(mockToast.success).toHaveBeenCalledWith("Task added successfully!");
  });

  test("calls updateTask and refreshes list when Done clicked", async () => {
    const todosBefore: Todo[] = [
      { id: 2, title: "Old Task", description: "Before done" },
    ];
    const todosAfter: Todo[] = [
      { id: 2, title: "Old Task", description: "Before done" },
    ];

    mockGetTasks
      .mockResolvedValueOnce(todosBefore) // initial
      .mockResolvedValueOnce(todosAfter); // after update
    mockUpdateTask.mockResolvedValueOnce(undefined);

    render(<TodoPage />);

    await waitFor(() =>
      expect(screen.getByText("Old Task")).toBeInTheDocument()
    );

    const doneButton = screen.getByRole("button", { name: /done/i });
    fireEvent.click(doneButton);

    await waitFor(() => expect(mockUpdateTask).toHaveBeenCalledWith(2));
    expect(mockToast.success).toHaveBeenCalledWith("Task marked as done!");
  });
});