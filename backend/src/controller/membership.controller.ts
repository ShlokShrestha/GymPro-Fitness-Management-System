import { NextFunction, Response } from "express";
import { ExpressRequest } from "../middleware/authMiddleware";
import { catchAsync } from "../middleware/catchAsync";
import ErrorHandler from "../utils/errorHandler";
import prisma from "../../prisma/prismaClient";
import { paginationFilterHelper } from "../helpers/paginationFilterHelper";

// Create Membership with Programs & Dynamic Pricing
export const createMembership = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { planId, programIds } = req.body;

    if (!userId || !planId || !programIds || !Array.isArray(programIds)) {
      return next(new ErrorHandler("User, Plan, or Programs are missing", 400));
    }

    const existingMembership = await prisma.membership.findFirst({
      where: { userId },
    });

    if (existingMembership) {
      return next(new ErrorHandler("Membership already exist", 409));
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return next(new ErrorHandler("Plan not found", 404));
    }

    const programs = await prisma.program.findMany({
      where: { id: { in: programIds } },
    });
    if (!programs || programs.length === 0) {
      return next(new ErrorHandler("Programs not found", 404));
    }

    // Calculate total price: sum of monthly program prices × plan duration
    const sumMonthly = programs.reduce((sum, p) => sum + p.price, 0);
    const totalBeforeDiscount = sumMonthly * plan.durationInDays;
    const finalPrice = plan.discount
      ? totalBeforeDiscount * (1 - plan.discount / 100)
      : totalBeforeDiscount;

    // Create membership with membershipProgram records
    const membership = await prisma.membership.create({
      data: {
        userId,
        planId,
        price: finalPrice,
        status: "PENDING",
        membershipPrograms: {
          create: programs.map((p) => ({
            programId: p.id,
            price: p.price * plan.durationInDays,
          })),
        },
      },
      include: { membershipPrograms: { include: { program: true } } },
    });

    res.status(201).json({
      status: "success",
      data: membership,
    });
  },
);

// Get logged-in user's membership with programs
export const getMyMembership = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const membership = await prisma.membership.findFirst({
      where: { userId },
      include: {
        plan: true,
        membershipPrograms: { include: { program: true } },
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

//Update  membership plan and program (user)
export const updateMembership = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const membershipId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const { planId, programIds } = req.body;

    if (!membershipId) {
      return next(new ErrorHandler("Membership ID is required", 400));
    }

    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      include: { membershipPrograms: true },
    });

    if (!membership) {
      return next(new ErrorHandler("Membership not found", 404));
    }

    let plan = null;
    if (planId) {
      plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) {
        return next(new ErrorHandler("Plan not found", 404));
      }
    } else {
      plan = await prisma.plan.findUnique({ where: { id: membership.planId } });
    }

    let programs = [];
    if (programIds) {
      if (!Array.isArray(programIds) || programIds.length === 0) {
        return next(
          new ErrorHandler("Programs must be a non-empty array", 400),
        );
      }
      programs = await prisma.program.findMany({
        where: { id: { in: programIds } },
      });
      if (!programs || programs.length === 0) {
        return next(new ErrorHandler("Programs not found", 404));
      }
    } else {
      programs = await prisma.program.findMany({
        where: {
          id: { in: membership.membershipPrograms.map((mp) => mp.programId) },
        },
      });
    }
    if (!plan) {
      return next(new ErrorHandler("Plan not found", 404));
    }
    const sumMonthly = programs.reduce((sum, p) => sum + p.price, 0);
    const totalBeforeDiscount = sumMonthly * plan.durationInDays;
    const finalPrice = plan.discount
      ? totalBeforeDiscount * (1 - plan.discount)
      : totalBeforeDiscount;

    const updatedMembership = await prisma.membership.update({
      where: { id: membershipId },
      data: {
        planId: plan.id,
        price: finalPrice,
        membershipPrograms: {
          deleteMany: {},
          create: programs.map((p) => ({
            programId: p.id,
            price: p.price * plan.durationInDays,
          })),
        },
      },
      include: { membershipPrograms: { include: { program: true } } },
    });

    res.status(200).json({
      status: "success",
      data: updatedMembership,
    });
  },
);

// Activate Membership: calculate endDate based on plan duration
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
    endDate.setMonth(startDate.getMonth() + membership.plan.durationInDays);

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

// Get membership by ID (admin)
export const getMembershipById = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const membership = await prisma.membership.findUnique({
      where: { id },
      include: {
        user: true,
        plan: true,
        membershipPrograms: { include: { program: true } },
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
  const { page, limit, search } = req.query;

  const pageInt = page ? parseInt(page as string, 10) : 0;
  const limitInt = limit ? parseInt(limit as string, 10) : 10;

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
    membershipPrograms: { include: { program: true } },
  };
  const { data, pagination } = await paginationFilterHelper(
    prisma.membership,
    filterOptions,
    includeOptions,
    {},
    pageInt,
    limitInt,
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
