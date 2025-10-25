import { Request, Response } from "express";
import * as getTaskUC from "../use-cases/task/getTask";
import * as addTaskUC from "../use-cases/task/addTask";
import * as updateTaskUC from "../use-cases/task/updateTaskStatus";

export const getTasks = async (_req: Request, res: Response) => {
  const todos = await getTaskUC.getTasks();
  res.json(todos);
};

export const addTask = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const task = await addTaskUC.addTask(title, description);
  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await updateTaskUC.updateTaskStatus(id);
  res.json(updated);
};