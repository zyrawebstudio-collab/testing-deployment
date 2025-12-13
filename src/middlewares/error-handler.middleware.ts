import { NextFunction, Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";

export const errorHandler = (
  err: Error & { status?: number },
  _: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.name && err.name === "SequelizeUniqueConstraintError") {
    const error = err as UniqueConstraintError;
    return res.status(400).json({
      error: {
        message: `${error.errors[0].value} already exists`,
      },
    });
  }

  const status = err.status || 500;
  return res.status(status).json({
    error: {
      message: err.message || "Internal server error",
    },
  });
};
