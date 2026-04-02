import { NextFunction, Response } from "express";
import prisma from "../../prisma/prismaClient";
import { ExpressRequest } from "../middleware/authMiddleware";
import { catchAsync } from "../middleware/catchAsync";

export const getAdminDashboard = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    try {
      const totalUsers = await prisma.user.count();
      const activeMemberships = await prisma.membership.count({
        where: {
          status: "ACTIVE",
        },
      });

      const revenueResult = await prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
        },
        _sum: {
          amount: true,
        },
      });

      const totalRevenue = revenueResult._sum.amount || 0;

      const pendingPayments = await prisma.payment.count({
        where: {
          status: "PENDING",
        },
      });

      const recentUsers = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      const recentPayments = await prisma.payment.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          amount: true,
          status: true,
          method: true,
          createdAt: true,
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json({
        stats: {
          totalUsers,
          activeMemberships,
          totalRevenue,
          pendingPayments,
        },
        recentUsers,
        recentPayments,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to load admin dashboard",
      });
    }
  },
);
