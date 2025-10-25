import { prisma } from "../../prismaClient";

export const addTask = async (title: string, description: string) => {
  return prisma.task.create({
    data: { title, description },
  });
};