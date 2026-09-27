import { z } from "zod";

export const passengerSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const driverSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  plateOrName: z.string().min(2, "Tesla vehicle identifier or plate is required"),
  capacity: z
    .number()
    .int("Capacity must be an integer")
    .min(1, "Vehicle capacity must be at least 1")
    .max(8, "Vehicle capacity cannot exceed 8")
    .default(3),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type PassengerSignupInput = z.infer<typeof passengerSignupSchema>;
export type DriverSignupInput = z.infer<typeof driverSignupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
