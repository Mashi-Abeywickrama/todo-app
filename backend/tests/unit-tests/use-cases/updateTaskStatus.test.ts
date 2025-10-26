import { updateTaskStatus } from "../../../src/use-cases/task/updateTaskStatus";
import { prisma } from "../../../src/prismaClient";
import { AppError } from "../../../src/errors/AppError";

jest.mock("../../../src/prismaClient", () => ({
  prisma: {
    task: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("updateTaskStatus use case", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update task status successfully", async () => {
    const mockTask = { id: 1, title: "Task 1", description: "desc", status: false };
    const updatedTask = { ...mockTask, status: true };

    (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
    (prisma.task.update as jest.Mock).mockResolvedValue(updatedTask);

    const result = await updateTaskStatus(1);

    expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: true },
    });
    expect(result).toEqual(updatedTask);
  });

  it("should throw AppError if task not found", async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(updateTaskStatus(99)).rejects.toThrow(AppError);
    await expect(updateTaskStatus(99)).rejects.toThrow("Task not found");

    expect(prisma.task.update).not.toHaveBeenCalled();
  });

  it("should throw AppError if Prisma update fails", async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.task.update as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await expect(updateTaskStatus(1)).rejects.toThrow(AppError);
    await expect(updateTaskStatus(1)).rejects.toThrow("Failed to update task");
  });
});