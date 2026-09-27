import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import prisma from "../../utils/prisma";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import {
  PassengerSignupInput,
  DriverSignupInput,
  LoginInput,
} from "./auth.validation";
import { TokenPayload } from "../../middlewares/auth";

export class AuthService {
  private static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: "7d",
    });
  }

  static async signupPassenger(data: PassengerSignupInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: Role.passenger,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user };
  }

  static async signupDriver(data: DriverSignupInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: Role.driver,
        },
      });

      const tesla = await tx.tesla.create({
        data: {
          driverId: user.id,
          plateOrName: data.plateOrName,
          capacity: data.capacity,
          isOnline: false,
        },
      });

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          tesla: {
            id: tesla.id,
            plateOrName: tesla.plateOrName,
            capacity: tesla.capacity,
            isOnline: tesla.isOnline,
          },
        },
      };
    });

    const token = this.generateToken({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });

    return { token, user: result.user };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        tesla: {
          select: {
            id: true,
            plateOrName: true,
            capacity: true,
            isOnline: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        tesla: user.tesla,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        tesla: {
          select: {
            id: true,
            plateOrName: true,
            capacity: true,
            isOnline: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
