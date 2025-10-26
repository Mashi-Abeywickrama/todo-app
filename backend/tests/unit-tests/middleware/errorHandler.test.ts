import { errorHandler } from "../../../src/middleware/errorHandler";
import { AppError } from "../../../src/errors/AppError";
import { Request, Response } from "express";

describe("errorHandler middleware", () => {
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = { status: statusMock } as unknown as Response;
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("handles AppError correctly", () => {
    const err = new AppError("Custom error", 400);
    errorHandler(err, {} as Request, res as unknown as Response, {} as any);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Custom error",
    });
  });

  it("handles unexpected errors correctly", () => {
    const err = new Error("Unexpected error");
    errorHandler(err, {} as Request, res as unknown as Response, {} as any);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});