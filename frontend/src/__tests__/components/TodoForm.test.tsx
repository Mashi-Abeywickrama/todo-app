import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoForm from "../../components/TodoForm";
import { Todo } from "../../types/todo";

describe("TodoForm", () => {
    test("renders form elements", () => {
        const mockAdd = jest.fn();
        render(<TodoForm onAdd={mockAdd} />);

        // UI checks
        expect(screen.getByText("Add a Task")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    test("does not call onAdd when fields are empty", async () => {
        const mockAdd = jest.fn();
        render(<TodoForm onAdd={mockAdd} />);

        const button = screen.getByRole("button", { name: /add/i });
        fireEvent.click(button);

        expect(mockAdd).not.toHaveBeenCalled();
    });

    test("calls onAdd with title and description, then clears inputs", async () => {
        const mockAdd = jest.fn().mockResolvedValueOnce(undefined);
        render(<TodoForm onAdd={mockAdd} />);

        const titleInput = screen.getByPlaceholderText("Title") as HTMLInputElement;
        const descInput = screen.getByPlaceholderText("Description") as HTMLTextAreaElement;
        const button = screen.getByRole("button", { name: /add/i });

        // Fill fields
        fireEvent.change(titleInput, { target: { value: "Learn Testing" } });
        fireEvent.change(descInput, { target: { value: "Write Jest tests" } });
        fireEvent.click(button);

        await waitFor(() => expect(mockAdd).toHaveBeenCalledTimes(1));

        expect(mockAdd).toHaveBeenCalledWith({
            title: "Learn Testing",
            description: "Write Jest tests",
        });

        // ✅ Wait for React to apply state updates
        await waitFor(() => {
            expect(titleInput.value).toBe("");
            expect(descInput.value).toBe("");
        });
    });
});