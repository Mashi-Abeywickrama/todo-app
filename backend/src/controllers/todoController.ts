import { Request, Response } from "express";
import * as getTaskUC from "../use-cases/task/getTask";
import * as addTaskUC from "../use-cases/task/addTask";
import * as updateTaskUC from "../use-cases/task/updateTaskStatus";
import { asyncHandler } from "../utils/asyncHandler";

export const getTasks = asyncHandler(async (_req: Request, res: Response) => {
  const todos = await getTaskUC.getTasks();
  res.json({ success: true, data: todos });
});

export const addTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body;
  if (!title || !description)
    throw new Error("Title and description are required");

  const task = await addTaskUC.addTask(title, description);
  res.status(201).json({ success: true, data: task });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new Error("Invalid task ID");

  const updated = await updateTaskUC.updateTaskStatus(id);
  res.json({ success: true, data: updated });
});