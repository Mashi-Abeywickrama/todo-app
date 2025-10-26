import { prisma } from "../../prismaClient";
import { AppError } from "../../errors/AppError";

export const getTasks = async () => {
  try {
    const tasks = await prisma.task.findMany({
      where: { status: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return tasks;
  } catch (error) {
    throw new AppError("Failed to fetch tasks", 500);
  }
};