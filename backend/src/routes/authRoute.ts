import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signUp,
} from "../controller/authController";
import { uploadImageMiddleWare } from "../middleware/uploadMiddleware";
const authRoutes = express.Router();

//auth route
authRoutes.post("/signup", uploadImageMiddleWare.single("profileImage"), signUp);
authRoutes.post("/login", login);
authRoutes.post("/forgotPassword", forgotPassword);
authRoutes.post("/resetPassword", resetPassword);

export default authRoutes;
