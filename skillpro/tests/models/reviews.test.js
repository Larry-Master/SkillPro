import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/mentors/[id]/reviews";
import Mentor from "@/models/Mentor";

// Mock connectDB to avoid hitting a real DB
jest.mock("../../lib/db", () => {
  const fn = jest.fn().mockResolvedValue();
  fn.connectDB = fn;
  return fn;
});

describe("Mentor Reviews API (Unit)", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 404 if mentor not found on GET", async () => {
    const selectMock = jest.fn().mockResolvedValue(null);
    jest.spyOn(Mentor, "findById").mockReturnValue({ select: selectMock });

    const { req, res } = createMocks({
      method: "GET",
      query: { id: "missing-id" },
    });

    await handler(req, res);

    expect(Mentor.findById).toHaveBeenCalledWith("missing-id");
    expect(selectMock).toHaveBeenCalledWith("rating");
    expect(res._getStatusCode()).toBe(404);
  });

  it("returns current rating if mentor exists on GET", async () => {
    const doc = { rating: 2 };
    const selectMock = jest.fn().mockResolvedValue(doc);
    jest.spyOn(Mentor, "findById").mockReturnValue({ select: selectMock });

    const { req, res } = createMocks({
      method: "GET",
      query: { id: "exists-id" },
    });

    await handler(req, res);

    expect(Mentor.findById).toHaveBeenCalledWith("exists-id");
    expect(selectMock).toHaveBeenCalledWith("rating");
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).data.rating).toBe(2);
  });

  it("returns 404 if mentor not found on POST", async () => {
    const updateSpy = jest
      .spyOn(Mentor, "findByIdAndUpdate")
      .mockResolvedValue(null);

    const { req, res } = createMocks({
      method: "POST",
      query: { id: "missing-id" },
    });
    req.body = { rating: 5 };

    await handler(req, res);

    expect(updateSpy).toHaveBeenCalledWith(
      "missing-id",
      { $inc: { rating: 5 } },
      { new: true },
    );
    expect(res._getStatusCode()).toBe(404);
  });

  it("increments rating on POST when mentor exists", async () => {
    const updated = { rating: 7 };
    const updateSpy = jest
      .spyOn(Mentor, "findByIdAndUpdate")
      .mockResolvedValue(updated);

    const { req, res } = createMocks({
      method: "POST",
      query: { id: "mentor-id" },
    });
    req.body = { rating: 5 };

    await handler(req, res);

    expect(updateSpy).toHaveBeenCalledWith(
      "mentor-id",
      { $inc: { rating: 5 } },
      { new: true },
    );
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).data.rating).toBe(7);
  });
});
