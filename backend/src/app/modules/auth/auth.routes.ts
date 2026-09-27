import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validate";
import {
  passengerSignupSchema,
  driverSignupSchema,
  loginSchema,
} from "./auth.validation";
import { verifyToken } from "../../middlewares/auth";

const router = Router();

router.post(
  "/passenger/signup",
  validateRequest(passengerSignupSchema),
  AuthController.signupPassenger
);

router.post(
  "/driver/signup",
  validateRequest(driverSignupSchema),
  AuthController.signupDriver
);

router.post(
  "/login",
  validateRequest(loginSchema),
  AuthController.login
);

router.get(
  "/me",
  verifyToken,
  AuthController.getMe
);

export default router;
