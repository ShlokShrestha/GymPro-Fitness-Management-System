import { NextFunction, Response } from "express";
import prisma from "../../prisma/prismaClient";
import { ExpressRequest } from "../middleware/authMiddleware";
import { catchAsync } from "../middleware/catchAsync";
import ErrorHandler from "../utils/errorHandler";
import { predictWorkout, labelMap } from "../ml/predict";
import { buildFeatures } from "../ml/features";
import { workoutMap } from "../ml/workoutMap";

const safeNumber = (value: any): number | null => {
  const num = Number(value);
  if (isNaN(num)) return null;
  return num;
};

const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return Number((weight / (heightM * heightM)).toFixed(2));
};

export const createFitnessGoal = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const { dateOfBirth, gender, goalType, targetWeight, startWeight, height } =
      req.body;

    if (
      !userId ||
      !goalType ||
      !startWeight ||
      !height ||
      !dateOfBirth ||
      !gender
    ) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    const safeHeight = safeNumber(height);
    const safeWeight = safeNumber(startWeight);
    const safeTarget = safeNumber(targetWeight);

    if (!safeHeight || !safeWeight) {
      return next(new ErrorHandler("Invalid height or weight", 400));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth,
        gender: gender ?? user.gender,
      },
    });

    const dob = dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth;
    const age = dob ? new Date().getFullYear() - dob.getFullYear() : null;

    const existingGoal = await prisma.fitnessGoal.findFirst({
      where: { userId },
    });

    if (existingGoal) {
      return next(new ErrorHandler("Fitness goal already exists", 409));
    }

    const bmi = calculateBMI(safeWeight, safeHeight);

    const goal = await prisma.fitnessGoal.create({
      data: {
        userId,
        goalType,
        targetWeight: safeTarget,
        startWeight: safeWeight,
        height: safeHeight,
        bmi,
        age,
      },
    });

    res.status(201).json({
      status: "success",
      data: goal,
    });
  },
);

/* ========================= */

export const getMyFitnessGoal = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const goal = await prisma.fitnessGoal.findFirst({
      where: { userId },
      include: { user: true },
    });

    if (!goal) {
      return next(new ErrorHandler("Fitness goal not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: goal,
    });
  },
);

export const updateFitnessGoal = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const { goalType, targetWeight, startWeight, height, dateOfBirth, gender } =
      req.body;

    if (!userId) {
      return next(new ErrorHandler("User not found", 401));
    }

    const existingGoal = await prisma.fitnessGoal.findFirst({
      where: { userId },
    });

    if (!existingGoal) {
      return next(new ErrorHandler("Fitness goal not found", 404));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth,
        gender: gender ?? user.gender,
      },
    });

    const dob = dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth;
    const age = dob ? new Date().getFullYear() - dob.getFullYear() : null;

    const finalHeight: any =
      height !== undefined && height !== null && height !== ""
        ? Number(height)
        : existingGoal.height;

    const finalWeight: any =
      startWeight !== undefined && startWeight !== null && startWeight !== ""
        ? Number(startWeight)
        : existingGoal.startWeight;

    const finalTarget =
      targetWeight !== undefined && targetWeight !== null && targetWeight !== ""
        ? Number(targetWeight)
        : existingGoal.targetWeight;

    const bmi = calculateBMI(finalWeight, finalHeight);

    const updatedGoal = await prisma.fitnessGoal.update({
      where: { id: existingGoal.id },
      data: {
        goalType: goalType ?? existingGoal.goalType,
        targetWeight: finalTarget,
        startWeight: finalWeight,
        height: finalHeight,
        bmi,
        age,
      },
    });

    res.status(200).json({
      status: "success",
      data: updatedGoal,
    });
  },
);

export const getWorkoutRecommendation = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      const goal = await prisma.fitnessGoal.findFirst({
        where: { userId },
      });

      if (!goal) {
        return res.status(404).json({ message: "No fitness goal found" });
      }

      const features = buildFeatures(goal);

      const prediction = predictWorkout(features);

      return res.json({
        userId,
        goal: goal.goalType,
        prediction: labelMap[prediction],
        recommendedWorkouts: workoutMap[prediction],
        analytics: {
          bmi: features.bmi,
          weightDifference: features.weightDiff,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  },
);
