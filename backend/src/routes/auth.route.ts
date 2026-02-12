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
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many attempts. Try again later.",
});

const sensitiveLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000,
  limit: 3,
  message: "Too many attempts. Try again later.",
});

authRoutes.post(
  "/signup",
  authLimiter,
  uploadImageMiddleWare.single("profileImage"),
  signUp,
);
authRoutes.post("/login", authLimiter, login);
authRoutes.post("/forgotPassword", sensitiveLimiter, forgotPassword);
authRoutes.post("/resetPassword", sensitiveLimiter, resetPassword);

export default authRoutes;
