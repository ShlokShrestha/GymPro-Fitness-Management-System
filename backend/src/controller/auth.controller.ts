import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../middleware/catchAsync";
import ErrorHandler from "../utils/errorHandler";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail";
import { generateResetToken, generateToken } from "../utils/generateToken";
import crypto from "crypto";
import { uploadImageKit } from "../utils/imageKitUpload";
import prisma from "../../prisma/prismaClient";

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, role, phoneNumber } = req.body;
    const file = req.file ?? null;

    if (!fullName || !email || !password) {
      return next(new ErrorHandler("Please fill form properly", 400));
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return next(new ErrorHandler("User with email already exists", 400));
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const userData: any = {
      fullName,
      email,
      password: hashPassword,
      role,
      phoneNumber,
    };
    let imageUrl: { url: string; fileId: string } | undefined;
    if (file) {
      const uploadParams = {
        file: file?.buffer,
        fileName: file?.originalname,
        folder: "/profile",
        useUniqueFileName: true,
      };
      imageUrl = await uploadImageKit(uploadParams);
    }
    if (imageUrl) {
      userData.profile = {
        create: {
          profileUrl: imageUrl.url,
          profileId: imageUrl.fileId,
        },
      };
    }
    const newUser = await prisma.user.create({
      data: userData,
    });

    if (!newUser) {
      return next(new ErrorHandler("Signup unsuccessful", 400));
    }

    res.status(201).json({
      status: "success",
      message: "Sign up successful",
    });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Enter a valid email and password", 400));
    }
    const result = await prisma.user.findFirst({ where: { email } });
    if (!result) {
      return next(new ErrorHandler("User with email doesnot exist", 401));
    }
    const comparePassword = await bcrypt.compare(password, result.password);
    if (!comparePassword) {
      return next(new ErrorHandler("Password doesnot match", 401));
    }
    const userData = {
      id: result.id,
      email: result.email,
      role: result.role,
    };
    const token = generateToken(userData);
    res
      .status(200)
      .json({ token: token, message: "Successfully login", data: userData });
  },
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorHandler("Enter a valid email", 400));
    }
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return next(new ErrorHandler("User doesnot exist with this email", 400));
    }
    const { resetToken, resetPasswordToken, resetPasswordExpire } =
      generateResetToken();
    sendEmail({
      email: user.email,
      subject: `GymPro Fitness Password Recovery`,
      resetToken,
    });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: resetPasswordExpire,
      },
    });
    res.status(200).json({
      status: "success",
      message: `Email sent to ${user.email} successfully`,
    });
  },
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;
    if (!token || !password) {
      return next(new ErrorHandler("Enter a valid token and password", 400));
    }
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await prisma.user.findFirst({ where: { resetPasswordToken } });
    if (
      !user ||
      !user.resetPasswordExpire ||
      user.resetPasswordExpire < new Date()
    ) {
      return next(new ErrorHandler("Invalid or expired token", 400));
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });
    res.status(200).json({
      status: "success",
      message: `Successfully reset password`,
    });
  },
);
