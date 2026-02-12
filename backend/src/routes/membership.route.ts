import express from "express";
import { isAuthorizedRoles } from "../middleware/authMiddleware";
import { createRateLimiter } from "../utils/rateLimiter";
import {
  activateMembership,
  createMembership,
  getAllMemberships,
  getMembershipById,
  getMyMembership,
  updateMembership,
  updateMembershipStatus,
} from "../controller/membership.controller";

const membershipRoute = express.Router();

const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
});

//user access route
membershipRoute.post("/", apiLimiter, createMembership);
membershipRoute.get("/me", apiLimiter, getMyMembership);
membershipRoute.patch("/update-membership/:id", apiLimiter, updateMembership);
membershipRoute.post("/activate", apiLimiter, activateMembership);

//admin access route
membershipRoute.get(
  "/",
  apiLimiter,
  isAuthorizedRoles("admin"),
  getAllMemberships,
);
membershipRoute.get(
  "/:id",
  apiLimiter,
  isAuthorizedRoles("admin"),
  getMembershipById,
);
membershipRoute.patch(
  "/:id/status",
  apiLimiter,
  isAuthorizedRoles("admin"),
  updateMembershipStatus,
);

export default membershipRoute;
