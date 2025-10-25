import axios from "axios";
import { Todo } from "../types/todo";
import { API_BASE } from "./api/baseUrl";

export const getTasks = async (): Promise<Todo[]> => {
  const res = await axios.get(`${API_BASE}/get-tasks`);
  return res.data;
};

export const addTask = async (todo: Todo): Promise<Todo> => {
  const res = await axios.post(`${API_BASE}/add-task`, todo);
  return res.data;
};