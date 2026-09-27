import request from "supertest";
import app from "../src/app";

describe("API Health Check", () => {
  it("GET / should return 200 and operational status", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Oi Tesla API is operational");
  });

  it("GET /api/unknown should return 404", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
