import express from "express";
import { isAuthorizedRoles } from "../middleware/authMiddleware";
import { createRateLimiter } from "../utils/rateLimiter";
import {
  activateMembership,
  createMembership,
  createClientMembershipWithPayment,
  getAllMemberships,
  getMembershipById,
  getMyMembership,
  updateMembership,
  updateMembershipStatus,
  updateClientMembership,
  renewMembership,
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
membershipRoute.post(
  "/user-membership",
  apiLimiter,
  isAuthorizedRoles("admin"),
  createClientMembershipWithPayment,
);
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
membershipRoute.patch(
  "/:id",
  apiLimiter,
  isAuthorizedRoles("admin"),
  updateClientMembership,
);
membershipRoute.post(
  "/:id/renew",
  apiLimiter,
  isAuthorizedRoles("admin"),
  renewMembership,
);

export default membershipRoute;
