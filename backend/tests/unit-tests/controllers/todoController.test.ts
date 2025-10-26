import { Request, Response } from "express";
import * as getTaskUC from "../../../src/use-cases/task/getTask";
import * as addTaskUC from "../../../src/use-cases/task/addTask";
import * as updateTaskUC from "../../../src/use-cases/task/updateTaskStatus";
import { getTasks, addTask, updateTask } from "../../../src/controllers/todoController";

// Mock the use-case modules
jest.mock("../../../src/use-cases/task/getTask");
jest.mock("../../../src/use-cases/task/addTask");
jest.mock("../../../src/use-cases/task/updateTaskStatus");

describe("Task Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock })) as any;
        res = {
            json: jsonMock,
            status: statusMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ---- GET TASKS ----
    it("should return all tasks successfully", async () => {
        const mockTasks = [{ id: 1, title: "Task", description: "Desc", status: false }];
        (getTaskUC.getTasks as jest.Mock).mockResolvedValue(mockTasks);

        await getTasks(req as Request, res as Response);

        expect(getTaskUC.getTasks).toHaveBeenCalled();
        expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockTasks });
    });

    // ---- ADD TASK ----
    it("should add a task successfully", async () => {
        req = { body: { title: "Task", description: "Desc" } };
        const mockTask = { id: 1, title: "Task", description: "Desc" };

        (addTaskUC.addTask as jest.Mock).mockResolvedValue(mockTask);

        await addTask(req as Request, res as Response);

        expect(addTaskUC.addTask).toHaveBeenCalledWith("Task", "Desc");
        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({ success: true, data: mockTask });
    });

    it("should throw error if title or description missing", async () => {
        req = { body: { title: "" } };
        const next = jest.fn();

        await addTask(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe("Title and description are required");
    });


    // ---- UPDATE TASK ----
    it("should update task successfully", async () => {
        req = { params: { id: "1" } };
        const updatedTask = { id: 1, title: "Task", status: true };

        (updateTaskUC.updateTaskStatus as jest.Mock).mockResolvedValue(updatedTask);

        await updateTask(req as Request, res as Response);

        expect(updateTaskUC.updateTaskStatus).toHaveBeenCalledWith(1);
        expect(jsonMock).toHaveBeenCalledWith({ success: true, data: updatedTask });
    });

    it("should throw error for invalid task id", async () => {
        req = { params: { id: "abc" } };

        const next = jest.fn();
        await updateTask(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next.mock.calls[0][0].message).toBe("Invalid task ID");  
    });
});