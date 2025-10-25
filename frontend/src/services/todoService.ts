import axiosInstance from "./api/axiosInstance";
import { Todo } from "../types/todo";
import { handleApiError } from "../utils/handleApiError";

export const getTasks = async (): Promise<Todo[]> => {
  try {
    const res = await axiosInstance.get<Todo[]>("/get-tasks");
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const addTask = async (todo: Todo): Promise<Todo> => {
  try {
    const res = await axiosInstance.post<Todo>("/add-task", todo);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateTask = async (id: number): Promise<Todo> => {
  try {
    const res = await axiosInstance.patch<Todo>(`/update-task/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};