import express from "express";
import { isAuthorizedRoles } from "../middleware/authMiddleware";
import { createRateLimiter } from "../utils/rateLimiter";
import {
  checkInAttendance,
  checkOutAttendance,
  getMyAttendance,
} from "../controller/attendance.controller";

const attendanceRoute = express.Router();

const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
});

//client access route
attendanceRoute.get(
  "/me",
  apiLimiter,
  isAuthorizedRoles("client"),
  getMyAttendance,
);
attendanceRoute.post(
  "/check-in",
  apiLimiter,
  isAuthorizedRoles("client"),
  checkInAttendance,
);
attendanceRoute.post(
  "/check-out",
  apiLimiter,
  isAuthorizedRoles("client"),
  checkOutAttendance,
);

export default attendanceRoute;
