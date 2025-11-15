import { processError } from "@/helper/errorHelper/errorPreprocessing";
import { ValidationError } from "@/helper/errorHelper/ValidationError";
import { ErrorResponse } from "@/interface/interface";
import { ErrorRequestHandler } from "express";
import { ConflictError } from "../../helper/errorHelper/ConflictError";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  // Process the error
  const processedError = processError(error);

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    statusCode: processedError.statusCode,
    message: processedError.message,
    errorDetails: processedError.message,
    errorSources: [],
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Add error sources if available
  if (
    processedError instanceof ValidationError ||
    processedError instanceof ConflictError
  ) {
    errorResponse.errorSources = processedError.errorSources;
    errorResponse.errorDetails = processedError.errorSources
      .map((source) => {
        const fieldName = Array.isArray(source.path)
          ? source.path[source.path.length - 1] // Take only the last part of the path
          : source.path;
        return `${fieldName}: ${source.message}`;
      })
      .join(". "); // Use period and space instead of semicolon
  }

  // Add stack trace in development
  if (process.env.NODE_ENV !== "production") {
    errorResponse.stack = processedError.stack;
  }

  // Log error (you can replace this with your logging service)
  // logError(processedError, req);

  // Send response
  res.status(errorResponse.statusCode).json(errorResponse);
};
