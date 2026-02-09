import express from "express";
import {
  isAuthenitcatedUser,
  isAuthorizedRoles,
} from "../middleware/authMiddleware";
import { createRateLimiter } from "../utils/rateLimiter";
import {
  createProgram,
  deleteProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
} from "../controller/program.controller";

const programRoutes = express.Router();

const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
});

programRoutes.get("/", getAllPrograms);
programRoutes.get("/:id", apiLimiter, getProgramById);
programRoutes.post(
  "/",
  apiLimiter,
  isAuthenitcatedUser,
  isAuthorizedRoles("admin"),
  createProgram,
);
programRoutes.put(
  "/:id",
  apiLimiter,
  isAuthenitcatedUser,
  isAuthorizedRoles("admin"),
  updateProgram,
);
programRoutes.delete(
  "/:id",
  apiLimiter,
  isAuthenitcatedUser,
  isAuthorizedRoles("admin"),
  deleteProgram,
);

export default programRoutes;
