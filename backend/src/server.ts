import express from "express";
import dotenv from "dotenv";
import globalErrorHandler from "./controller/error.controller";
import { isAuthenitcatedUser } from "./middleware/authMiddleware";
import cors from "cors";
import { createRateLimiter } from "./utils/rateLimiter";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import planRoutes from "./routes/plan.route";
import membershipRoute from "./routes/membership.route";
import programRoutes from "./routes/program.route";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());
server.use("/uploads", express.static("public/uploads"));

const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
});
server.use(globalLimiter);

server.use("/api/v1/auth", authRoutes);
server.use("/api/v1/user", isAuthenitcatedUser, userRoutes);
server.use("/api/v1/plan", planRoutes);
server.use("/api/v1/program", programRoutes);
server.use("/api/v1/membership", isAuthenitcatedUser, membershipRoute);
server.use(globalErrorHandler);

server.listen(process.env.SERVER_PORT, () => {
  console.log("Server is running in port", process.env.SERVER_PORT);
});
