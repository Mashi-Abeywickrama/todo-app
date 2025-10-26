import { getTasks } from "../../../src/use-cases/task/getTask";
import { prisma } from "../../../src/prismaClient";
import { AppError } from "../../../src/errors/AppError";

jest.mock("../../../src/prismaClient", () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
    },
  },
}));

describe("getTasks use case", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of tasks when successful", async () => {
    const mockTasks = [
      { id: 1, title: "Task 1", description: "Test 1", status: false },
      { id: 2, title: "Task 2", description: "Test 2", status: false },
    ];

    (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

    const result = await getTasks();

    expect(result).toEqual(mockTasks);
    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { status: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  });

  it("should throw AppError if fetching fails", async () => {
    (prisma.task.findMany as jest.Mock).mockRejectedValue(new Error("DB Error"));

    await expect(getTasks()).rejects.toThrow(AppError);
    await expect(getTasks()).rejects.toThrow("Failed to fetch tasks");

    expect(prisma.task.findMany).toHaveBeenCalled();
  });
});