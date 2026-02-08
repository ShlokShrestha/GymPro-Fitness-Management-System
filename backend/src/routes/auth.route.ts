import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signUp,
} from "../controller/auth.controller";
import { uploadImageMiddleWare } from "../middleware/uploadMiddleware";
import { createRateLimiter } from "../utils/rateLimiter";
const authRoutes = express.Router();

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 5,
  message: "Too many attempts. Try again later.",
});

authRoutes.post(
  "/signup",
  authLimiter,
  uploadImageMiddleWare.single("profileImage"),
  signUp,
);
authRoutes.post("/login", authLimiter, login);
authRoutes.post("/forgotPassword", authLimiter, forgotPassword);
authRoutes.post("/resetPassword", authLimiter, resetPassword);

export default authRoutes;
