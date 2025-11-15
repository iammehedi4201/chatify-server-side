import e from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { Error as MongooseError } from "mongoose";
import { ZodError } from "zod";
import { AppError } from "./appError";
import { handleDuplicateError } from "./handleDuplicateError";
import { handleZodError } from "./handleZodErrror";
import { handleJWTError } from "./jwtErrorHandler";
import {
  handleMongooseCastError,
  handleMongooseValidationError,
} from "./mongooseErrorHandler";

export const processError = (error: unknown): AppError => {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  // Handle Mongoose validation errors
  if (error instanceof MongooseError.ValidationError) {
    return handleMongooseValidationError(error);
  }

  // Handle Mongoose cast errors
  if (error instanceof MongooseError.CastError) {
    return handleMongooseCastError(error);
  }

  // Handle duplicate/unique constraint errors
  if (isDuplicateError(error)) {
    return handleDuplicateError(error);
  }

  // Handle JWT errors
  if (isJWTError(error)) {
    return handleJWTError(error);
  }

  // Handle custom AppError instances
  if (error instanceof AppError) {
    return error;
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }

  // Handle unknown errors
  return new AppError("An unexpected error occurred", 500);
};

type DuplicateError = { code: number | string };

const isDuplicateError = (error: unknown): error is DuplicateError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    ((error as DuplicateError).code === 11000 ||
      (error as DuplicateError).code === "P2002")
  );
};

const isJWTError = (error: unknown): error is JsonWebTokenError => {
  return error instanceof JsonWebTokenError;
};
