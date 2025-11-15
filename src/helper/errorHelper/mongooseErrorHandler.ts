import { ErrorSource } from "@/interface/interface";
import { Error as MongooseError } from "mongoose";
import { AppError } from "./appError";
import { ValidationError } from "./ValidationError";

export const handleMongooseValidationError = (
  error: MongooseError.ValidationError,
): ValidationError => {
  const errorSources: ErrorSource[] = Object.values(error.errors).map(
    (err) => ({
      path: err.path ? [err.path] : ["_global"],
      message: err.message,
    }),
  );

  return new ValidationError("Mongoose validation failed", errorSources);
};

export const handleMongooseCastError = (
  error: MongooseError.CastError,
): AppError => {
  const errorSource: ErrorSource = {
    path: error.path ? [error.path] : ["_id"],
    message: `Invalid ${error.kind} for ${error.path}`,
  };

  return new ValidationError("Invalid data format", [errorSource]);
};
