import { prisma } from "../../prismaClient";
import { AppError } from "../../errors/AppError";

export const addTask = async (title: string, description: string) => {
  try {
    return await prisma.task.create({
      data: { title, description },
    });
  } catch (error) {
    throw new AppError("Error creating task", 500);
  }
};