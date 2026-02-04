import { NextFunction, Request, Response } from "express";
import { catchAsync } from "./catchAsync";
import ErrorHandler from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient";
import { user } from "../generated/prisma/client";

export interface ExpressRequest extends Request {
  user?: user;
}

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}
type Role = "admin" | "client" | "staff";

export const isAuthenitcatedUser = catchAsync(
  async (
    req: ExpressRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resources", 401),
      );
    }
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      return next(
        new ErrorHandler(
          "JWT_SECRET_KEY is not defined in the environment variables.",
          400,
        ),
      );
    }
    const verifyToken = jwt.verify(token, secret) as DecodedToken;
    if (!verifyToken) {
      return next(new ErrorHandler("Token is expired", 403));
    }
    const user = await prisma.user.findUnique({
      where: {
        id: verifyToken.id,
      },
    });
    req.user = user ?? undefined;
    next();
  },
);

export const isAuthorizedRoles = (...roles: Role[]) => {
  return (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as Role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resources`,
          403,
        ),
      );
    }
    next();
  };
};
