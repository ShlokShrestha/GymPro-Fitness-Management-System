import prisma from "../../prisma/prismaClient";
import { catchAsync } from "../middleware/catchAsync";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";

// Get all programs
export const getAllPrograms = catchAsync(
  async (req: Request, res: Response) => {
    const programs = await prisma.program.findMany();
    res.status(200).json({
      status: "success",
      results: programs.length,
      data: programs,
    });
  },
);

// Get a program by ID
export const getProgramById = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id: string = req.params["id"] as string;
    const program = await prisma.program.findUnique({ where: { id: id } });
    if (!program) {
      return next(new ErrorHandler("Program not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: program,
    });
  },
);

// Create a new program
export const createProgram = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const { name, price } = req.body;
    if (!name || !price) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    const program = await prisma.program.create({
      data: { name, price },
    });

    res.status(201).json({
      status: "success",
      data: program,
    });
  },
);

// Update an existing program
export const updateProgram = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id: string = req.params["id"] as string;
    const { name, price } = req.body;

    const existingProgram = await prisma.program.findUnique({ where: { id } });
    if (!existingProgram) {
      return next(new ErrorHandler("Program not found", 404));
    }

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: { name, price },
    });

    res.status(200).json({
      status: "success",
      data: updatedProgram,
    });
  },
);

// Delete a program
export const deleteProgram = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const id: string = req.params["id"] as string;

    const existingProgram = await prisma.program.findUnique({ where: { id } });
    if (!existingProgram) {
      return next(new ErrorHandler("Program not found", 404));
    }

    await prisma.program.delete({ where: { id } });

    res.status(200).json({
      status: "success",
      message: "Program deleted successfully",
    });
  },
);
