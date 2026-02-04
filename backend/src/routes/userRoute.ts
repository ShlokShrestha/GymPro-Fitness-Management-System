import express from "express";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updatePassword,
  updateProfile,
  updateProfileImage,
  updateUser,
  userProfile,
} from "../controller/userController";
import { isAuthorizedRoles } from "../middleware/authMiddleware";
import { uploadImageMiddleWare } from "../middleware/uploadMiddleware";
const userRoutes = express.Router();

//user route
userRoutes.get("/profile", userProfile);
userRoutes.put("/updateProfile", updateProfile);
userRoutes.put(
  "/updateProfileImage",
  uploadImageMiddleWare.single("profileImage"),
  updateProfileImage,
);
userRoutes.put("/updatePassword", updatePassword);

//admin route
userRoutes.get("/getAllUser", isAuthorizedRoles("admin"), getAllUser);
userRoutes.get("/getSingleUser/:id", isAuthorizedRoles("admin"), getSingleUser);
userRoutes.put("/updateUser", isAuthorizedRoles("admin"), updateUser);
userRoutes.delete("/deleteUser", isAuthorizedRoles("admin"), deleteUser);

export default userRoutes;
