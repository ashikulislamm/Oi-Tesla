import express, { Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import authRoutes from "./app/modules/auth/auth.routes";
import { errorHandler, notFound } from "./app/middlewares/errorHandler";

const app = express();

// CORS and Body Parsers
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Oi Tesla API is operational",
    service: "backend",
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
