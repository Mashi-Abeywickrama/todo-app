import request from "supertest";
import app from "../../src/app"; // your Express app
import { prisma } from "../../src/prismaClient";

// Clean DB before/after tests
beforeAll(async () => {
  await prisma.task.deleteMany(); // clear tasks
});

afterAll(async () => {
  await prisma.task.deleteMany();
  await prisma.$disconnect();
});

describe("Todo API Integration", () => {

  it("should get empty tasks list", async () => {
    const res = await request(app).get("/get-tasks");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("should add a new task", async () => {
    const res = await request(app)
      .post("/add-task")
      .send({ title: "Test Task", description: "Test Description" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Test Task");
  });

  it("should fail to add task without title", async () => {
    const res = await request(app)
      .post("/add-task")
      .send({ description: "No title" });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");

  });

  it("should update task status", async () => {
    // first, create a task
    const task = await prisma.task.create({
      data: { title: "Update Task", description: "Update Me", status: false },
    });

    const res = await request(app).patch(`/update-task/${task.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(true);
  });

  it("should fail to update invalid task id", async () => {
    const res = await request(app).patch("/update-task/999");
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Task not found");
  });

});