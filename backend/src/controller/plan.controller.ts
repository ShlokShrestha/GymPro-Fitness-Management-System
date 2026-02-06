import prisma from "../../prisma/prismaClient";
import { catchAsync } from "../middleware/catchAsync";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

// Get all plans
export const getAllPlans = catchAsync(async (req: Request, res: Response) => {
  const plans = await prisma.plan.findMany();
  res.status(200).json({
    status: "success",
    results: plans.length,
    data: plans,
  });
});

// Get a plan by ID
export const getPlanById = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id: string = req.params["id"] as string;
    const plan = await prisma.plan.findUnique({ where: { id: id } });
    if (!plan) {
      return next(new ErrorHandler("Plan not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: plan,
    });
  },
);

// Create a new plan
export const createPlan = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const { name, description, price, durationInDays } = req.body;
    if (!name || !price || !durationInDays) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    const plan = await prisma.plan.create({
      data: { name, description, price, durationInDays },
    });

    res.status(201).json({
      status: "success",
      data: plan,
    });
  },
);

// Update an existing plan
export const updatePlan = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id: string = req.params["id"] as string;
    const { name, description, price, durationInDays } = req.body;

    const existingPlan = await prisma.plan.findUnique({ where: { id } });
    if (!existingPlan) {
      return next(new ErrorHandler("Plan not found", 404));
    }

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: { name, description, price, durationInDays },
    });

    res.status(200).json({
      status: "success",
      data: updatedPlan,
    });
  },
);

// Delete a plan
export const deletePlan = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id: string = req.params["id"] as string;

    const existingPlan = await prisma.plan.findUnique({ where: { id } });
    if (!existingPlan) {
      return next(new ErrorHandler("Plan not found", 404));
    }

    await prisma.plan.delete({ where: { id } });

    res.status(200).json({
      status: "success",
      message: "Plan deleted successfully",
    });
  },
);
