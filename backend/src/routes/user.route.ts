import express from "express";
import { isAuthorizedRoles } from "../middleware/authMiddleware";
import { uploadImageMiddleWare } from "../middleware/uploadMiddleware";
import { createRateLimiter } from "../utils/rateLimiter";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updatePassword,
  updateProfile,
  updateProfileImage,
  updateUser,
  userProfile,
} from "../controller/user.controller";

const userRoutes = express.Router();

const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 min
  limit: 60,
});
//user route
userRoutes.get("/profile", apiLimiter, userProfile);
userRoutes.put("/updateProfile", apiLimiter, updateProfile);
userRoutes.put(
  "/updateProfileImage",
  apiLimiter,
  uploadImageMiddleWare.single("profileImage"),
  updateProfileImage,
);
userRoutes.put("/updatePassword", apiLimiter, updatePassword);

//admin route
userRoutes.get("/", apiLimiter, isAuthorizedRoles("admin"), getAllUser);
userRoutes.get("/:id", apiLimiter, isAuthorizedRoles("admin"), getSingleUser);
userRoutes.put("/:id", apiLimiter, isAuthorizedRoles("admin"), updateUser);
userRoutes.delete("/:id", apiLimiter, isAuthorizedRoles("admin"), deleteUser);

export default userRoutes;
