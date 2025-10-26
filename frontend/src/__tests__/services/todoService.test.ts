import axiosInstance from "../../services/api/axiosInstance";
import { getTasks, addTask, updateTask } from "../../services/todoService";
import { Todo } from "../../types/todo";
import { handleApiError } from "../../utils/handleApiError";

// Mock dependencies
jest.mock("../../services/api/axiosInstance", () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
}));

jest.mock("../../utils/handleApiError", () => ({
  handleApiError: jest.fn(),
}));

// Re-import mocked modules after the manual mock
const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;
const mockedHandleApiError = handleApiError as jest.MockedFunction<typeof handleApiError>;

describe("todoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should fetch tasks successfully", async () => {
      const mockData: Todo[] = [
        { id: 1, title: "Task 1", description: "Desc", status: false },
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { success: true, data: mockData },
      });

      const result = await getTasks();
      expect(mockedAxios.get).toHaveBeenCalledWith("/get-tasks");
      expect(result).toEqual(mockData);
    });

    it("should throw an error when API fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));
      mockedHandleApiError.mockReturnValueOnce("Failed to load tasks");

      await expect(getTasks()).rejects.toThrow("Failed to load tasks");
    });
  });

  describe("addTask", () => {
    it("should add a task successfully", async () => {
      const newTodo: Todo = { id: 2, title: "New Task", description: "Test", status: false };
      mockedAxios.post.mockResolvedValueOnce({ data: newTodo });

      const result = await addTask(newTodo);
      expect(mockedAxios.post).toHaveBeenCalledWith("/add-task", newTodo);
      expect(result).toEqual(newTodo);
    });

    it("should handle add task failure", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Add failed"));
      mockedHandleApiError.mockReturnValueOnce("Failed to add task");

      await expect(addTask({ id: 1, title: "X", description: "Y", status: false })).rejects.toThrow(
        "Failed to add task"
      );
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      const updatedTodo: Todo = { id: 1, title: "Updated", description: "Done", status: true };
      mockedAxios.patch.mockResolvedValueOnce({ data: updatedTodo });

      const result = await updateTask(1);
      expect(mockedAxios.patch).toHaveBeenCalledWith("/update-task/1");
      expect(result).toEqual(updatedTodo);
    });

    it("should handle update task failure", async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error("Patch failed"));
      mockedHandleApiError.mockReturnValueOnce("Failed to update");

      await expect(updateTask(1)).rejects.toThrow("Failed to update");
    });
  });
});