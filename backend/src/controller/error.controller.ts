import { ErrorRequestHandler, Response } from "express";

interface sendErrorFn {
  (
    error: {
      statusCode: number;
      status: string;
      stack: string;
      message: string;
    },
    res: Response
  ): void;
}

const sendErrorDev: sendErrorFn = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;
  res.status(statusCode).json({ status, message });
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  sendErrorDev(error, res);
};

export default globalErrorHandler;
