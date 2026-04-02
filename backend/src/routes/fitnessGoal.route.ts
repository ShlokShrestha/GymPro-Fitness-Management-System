import express from "express";
import { createRateLimiter } from "../utils/rateLimiter";
import {
  createFitnessGoal,
  getMyFitnessGoal,
  getWorkoutRecommendation,
  updateFitnessGoal,
} from "../controller/fitnessGoal.controller";

const fitnessGoalRoute = express.Router();

const apiLimiter = createRateLimiter({
  windowMs: 1 * 60 * 1000,
  limit: 60,
});

fitnessGoalRoute.post("/", apiLimiter, createFitnessGoal);
fitnessGoalRoute.get("/", apiLimiter, getMyFitnessGoal);
fitnessGoalRoute.put("/", apiLimiter, updateFitnessGoal);
fitnessGoalRoute.get("/workout", apiLimiter, getWorkoutRecommendation);

export default fitnessGoalRoute;
