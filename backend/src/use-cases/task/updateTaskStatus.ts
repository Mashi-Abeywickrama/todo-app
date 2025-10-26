import { prisma } from "../../prismaClient";
import { AppError } from "../../errors/AppError";

export const updateTaskStatus = async (id: number) => {
  try {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) throw new AppError("Task not found", 404);

    return await prisma.task.update({
      where: { id },
      data: { status: true },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to update task", 500);
  }
};