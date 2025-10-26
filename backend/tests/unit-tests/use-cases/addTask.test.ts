import { addTask } from "../../../src/use-cases/task/addTask";
import { prisma } from "../../../src/prismaClient";

jest.mock("../../../src/prismaClient", () => ({
  prisma: {
    task: {
      create: jest.fn(),
    },
  },
}));

describe("addTask use case", () => {
  it("should create a task successfully", async () => {
    (prisma.task.create as jest.Mock).mockResolvedValue({
      id: 1,
      title: "Test task",
      description: "Some description",
      status: false,
    });

    const result = await addTask("Test task", "Some description");

    expect(result).toEqual({
      id: 1,
      title: "Test task",
      description: "Some description",
      status: false,
    });
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: { title: "Test task", description: "Some description" },
    });
  });

  it("should throw AppError if creation fails", async () => {
    (prisma.task.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await expect(addTask("title", "desc")).rejects.toThrow("Error creating task");
  });
});