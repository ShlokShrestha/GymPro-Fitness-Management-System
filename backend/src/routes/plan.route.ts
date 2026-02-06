import express from "express";
import {
  isAuthenitcatedUser,
  isAuthorizedRoles,
} from "../middleware/authMiddleware";
import { createRateLimiter } from "../utils/rateLimiter";
import {
  createPlan,
  deletePlan,
  getAllPlans,
  getPlanById,
  updatePlan,
} from "../controller/plan.controller";

const planRoutes = express.Router();

const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
});

planRoutes.get("/", getAllPlans);
planRoutes.get("/:id", apiLimiter, getPlanById);
planRoutes.post(
  "/",
  apiLimiter,
  isAuthenitcatedUser,
  isAuthorizedRoles("admin"),
  createPlan,
);
planRoutes.put(
  "/:id",
  apiLimiter,
  isAuthenitcatedUser,
  isAuthorizedRoles("admin"),
  updatePlan,
);
planRoutes.delete(
  "/:id",
  apiLimiter,
  isAuthenitcatedUser,
  isAuthorizedRoles("admin"),
  deletePlan,
);

export default planRoutes;
