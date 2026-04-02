import express from "express";
import { createRateLimiter } from "../utils/rateLimiter";
import { getAdminDashboard } from "../controller/adminDashboard.controller";
import { isAuthorizedRoles } from "../middleware/authMiddleware";

const adminDashboardRoute = express.Router();

const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
});

adminDashboardRoute.get(
  "/",
  apiLimiter,
  isAuthorizedRoles("admin"),
  getAdminDashboard,
);

export default adminDashboardRoute;
