import { NextFunction, Response } from "express";
import { ExpressRequest } from "../middleware/authMiddleware";
import { catchAsync } from "../middleware/catchAsync";
import prisma from "../../prisma/prismaClient";
import ErrorHandler from "../utils/errorHandler";

export const getMyAttendance = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const attendance = await prisma.gymAttendance.findMany({
      where: { userId },
      include: {
        membership: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: {
        checkIn: "desc",
      },
    });
    res.status(200).json({
      status: "success",
      data: attendance,
    });
  },
);

export const checkInAttendance = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAttendance = await prisma.gymAttendance.findFirst({
      where: {
        userId,
        checkIn: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (todayAttendance) {
      return next(
        new ErrorHandler("You have already checked in today", 400)
      );
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });

    if (!membership) {
      return next(new ErrorHandler("No active membership found", 400));
    }

    const attendance = await prisma.gymAttendance.create({
      data: {
        userId,
        membershipId: membership.id,
      },
      include: {
        membership: {
          include: {
            plan: true,
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Checked in successfully",
      data: attendance,
    });
  }
);

export const checkOutAttendance = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const activeSession = await prisma.gymAttendance.findFirst({
      where: {
        userId,
        checkOut: null,
      },
      orderBy: {
        checkIn: "desc",
      },
    });

    if (!activeSession) {
      return next(new ErrorHandler("No active check-in found", 400));
    }

    const updated = await prisma.gymAttendance.update({
      where: {
        id: activeSession.id,
      },
      data: {
        checkOut: new Date(),
      },
      include: {
        membership: {
          include: {
            plan: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      message: "Checked out successfully",
      data: updated,
    });
  },
);
