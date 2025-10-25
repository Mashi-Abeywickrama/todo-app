import { prisma } from "../../prismaClient";

export const getTasks = async () => {
  return prisma.task.findMany({
    where: { status: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
};