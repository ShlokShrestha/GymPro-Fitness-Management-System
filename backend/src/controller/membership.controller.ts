import { NextFunction, Response } from "express";
import { ExpressRequest } from "../middleware/authMiddleware";
import { catchAsync } from "../middleware/catchAsync";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../../prisma/prismaClient";
import { paginationFilterHelper } from "../helpers/paginationFilterHelper";

//Create Membership
export const createMembership = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { planId } = req.body;

    if (!userId || !planId) {
      return next(new ErrorHandler("User or Plan is missing", 400));
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return next(new ErrorHandler("Plan not found", 404));
    }

    const membership = await prisma.membership.create({
      data: {
        userId,
        planId,
        status: "PENDING",
      },
    });

    res.status(201).json({
      status: "success",
      data: membership,
    });
  },
);

export const activateMembership = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { membershipId } = req.body;

    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      include: { plan: true },
    });

    if (!membership) {
      return next(new ErrorHandler("Membership not found", 404));
    }

    if (membership.status === "ACTIVE") {
      return next(new ErrorHandler("Membership already active", 400));
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + membership.plan.durationInDays);

    const updatedMembership = await prisma.membership.update({
      where: { id: membershipId },
      data: {
        status: "ACTIVE",
        startDate,
        endDate,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Membership activated successfully",
      data: updatedMembership,
    });
  },
);
//Get logged-in user's membership
export const getMyMembership = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const membership = await prisma.membership.findFirst({
      where: { userId },
      include: {
        plan: true,
        payments: true,
        gymAttendances: true,
      },
    });

    if (!membership) {
      return next(new ErrorHandler("Membership not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: membership,
    });
  },
);

//Get membership by ID (admin or owner)
export const getMembershipById = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const membership = await prisma.membership.findUnique({
      where: { id },
      include: {
        user: true,
        plan: true,
        payments: true,
        gymAttendances: true,
      },
    });

    if (!membership) {
      return next(new ErrorHandler("Membership not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: membership,
    });
  },
);

//Get all memberships (Admin)
export const getAllMemberships = catchAsync(async (req, res: Response) => {
  const { skip, take, search } = req.query;

  const skipInt = skip ? parseInt(skip as string, 10) : 0;
  const takeInt = take ? parseInt(take as string, 10) : 10;

  const filterOptions = search
    ? {
        title: {
          contains: search as string,
          mode: "insensitive",
        },
      }
    : {};
  const includeOptions = {
    user: true,
    plan: true,
    payments: true,
    gymAttendances: true,
  };
  const { data, pagination } = await paginationFilterHelper(
    prisma.membership,
    filterOptions,
    includeOptions,
    skipInt,
    takeInt,
  );
  res.status(200).json({
    status: "success",
    data: data,
    pagination: pagination,
  });
});

//Update  memberships (Admin)
export const updateMembershipStatus = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { status } = req.body;

    if (!status) {
      return next(new ErrorHandler("Status is required", 400));
    }

    const membership = await prisma.membership.findUnique({
      where: { id },
    });

    if (!membership) {
      return next(new ErrorHandler("Membership not found", 404));
    }

    const updatedMembership = await prisma.membership.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      status: "success",
      data: updatedMembership,
    });
  },
);

//Auto-expire memberships (Cron / Admin trigger)
export const expireMemberships = catchAsync(async (_req, res: Response) => {
  const now = new Date();

  const result = await prisma.membership.updateMany({
    where: {
      status: "ACTIVE",
      endDate: { lt: now },
    },
    data: {
      status: "EXPIRED",
    },
  });

  res.status(200).json({
    status: "success",
    message: `${result.count} memberships expired`,
  });
});
