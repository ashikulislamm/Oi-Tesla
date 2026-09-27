import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth";

export class AuthController {
  static async signupPassenger(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuthService.signupPassenger(req.body);
      res.status(201).json({
        success: true,
        message: "Passenger registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async signupDriver(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuthService.signupDriver(req.body);
      res.status(201).json({
        success: true,
        message: "Driver registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const user = await AuthService.getMe(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}
