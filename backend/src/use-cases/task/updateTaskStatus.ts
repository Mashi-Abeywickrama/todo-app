import { prisma } from "../../prismaClient";

export const updateTaskStatus = async (id: number) => {
  return prisma.task.update({
    where: { id },
    data: { status: true },
  });
};