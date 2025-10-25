import { Router } from "express";
import { getTasks, addTask, updateTask } from "../controllers/todoController";

const router = Router();

router.get("/get-tasks", getTasks);
router.post("/add-task", addTask);
router.patch("/update-task/:id", updateTask);

export default router;