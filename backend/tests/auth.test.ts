import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import app from "../src/app";
import prisma from "../src/app/utils/prisma";
import config from "../src/app/config";

// Mock Prisma client to allow fast, deterministic execution across all environments
jest.mock("../src/app/utils/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tesla: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("Authentication & RBAC Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/passenger/signup", () => {
    it("should reject signup when email is invalid", async () => {
      const res = await request(app).post("/api/auth/passenger/signup").send({
        name: "Nusrat",
        email: "not-an-email",
        password: "TeslaPassword123!",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Validation failed");
    });

    it("should reject signup when password is shorter than 6 chars", async () => {
      const res = await request(app).post("/api/auth/passenger/signup").send({
        name: "Nusrat",
        email: "nusrat@oitesla.com",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject signup if email is already taken (409 Conflict)", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "user-1",
        email: "nusrat@oitesla.com",
      });

      const res = await request(app).post("/api/auth/passenger/signup").send({
        name: "Nusrat",
        email: "nusrat@oitesla.com",
        password: "TeslaPassword123!",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Email is already registered");
    });

    it("should create passenger and return JWT on valid input", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "passenger-uuid-nusrat",
        name: "Nusrat",
        email: "nusrat@oitesla.com",
        role: Role.passenger,
        createdAt: new Date(),
      });

      const res = await request(app).post("/api/auth/passenger/signup").send({
        name: "Nusrat",
        email: "nusrat@oitesla.com",
        password: "TeslaPassword123!",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("nusrat@oitesla.com");
      expect(res.body.data.user.role).toBe("passenger");

      // Verify token payload
      const decoded = jwt.verify(
        res.body.data.token,
        config.jwtSecret
      ) as { id: string; email: string; role: string };
      expect(decoded.email).toBe("nusrat@oitesla.com");
      expect(decoded.role).toBe("passenger");
    });
  });

  describe("POST /api/auth/driver/signup", () => {
    it("should register driver, create associated Tesla with capacity, and return JWT", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback({
          user: {
            create: jest.fn().mockResolvedValue({
              id: "driver-uuid-jashim",
              name: "Jashim",
              email: "jashim@oitesla.com",
              role: Role.driver,
              createdAt: new Date(),
            }),
          },
          tesla: {
            create: jest.fn().mockResolvedValue({
              id: "tesla-bullet-uuid",
              plateOrName: "Bullet",
              capacity: 3,
              isOnline: false,
            }),
          },
        });
      });

      const res = await request(app).post("/api/auth/driver/signup").send({
        name: "Jashim",
        email: "jashim@oitesla.com",
        password: "TeslaPassword123!",
        plateOrName: "Bullet",
        capacity: 3,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe("driver");
      expect(res.body.data.user.tesla.plateOrName).toBe("Bullet");
      expect(res.body.data.user.tesla.capacity).toBe(3);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should reject login with non-existent email (401)", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        email: "unknown@oitesla.com",
        password: "TeslaPassword123!",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid email or password");
    });

    it("should reject login with wrong password (401)", async () => {
      const passwordHash = await bcrypt.hash("CorrectPassword123!", 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "passenger-uuid-nusrat",
        name: "Nusrat",
        email: "nusrat@oitesla.com",
        passwordHash,
        role: Role.passenger,
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "nusrat@oitesla.com",
        password: "WrongPassword999!",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should authenticate valid user and return JWT", async () => {
      const rawPassword = "TeslaPassword123!";
      const passwordHash = await bcrypt.hash(rawPassword, 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "passenger-uuid-nusrat",
        name: "Nusrat",
        email: "nusrat@oitesla.com",
        passwordHash,
        role: Role.passenger,
        createdAt: new Date(),
        tesla: null,
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "nusrat@oitesla.com",
        password: rawPassword,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("nusrat@oitesla.com");
    });
  });

  describe("Protected Route & RBAC Guards", () => {
    it("should reject GET /api/auth/me without Bearer token (401)", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Authorization token required");
    });

    it("should reject GET /api/auth/me with invalid token (401)", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token-string");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return user profile for authenticated request", async () => {
      const token = jwt.sign(
        {
          id: "passenger-uuid-nusrat",
          email: "nusrat@oitesla.com",
          role: Role.passenger,
        },
        config.jwtSecret
      );

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "passenger-uuid-nusrat",
        name: "Nusrat",
        email: "nusrat@oitesla.com",
        role: Role.passenger,
        createdAt: new Date(),
        tesla: null,
      });

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe("nusrat@oitesla.com");
      expect(res.body.data.role).toBe("passenger");
    });
  });
});
