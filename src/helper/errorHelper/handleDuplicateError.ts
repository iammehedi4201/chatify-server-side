import { ConflictError } from "@/helper/errorHelper/ConflictError";
import { ErrorSource } from "@/interface/interface";

interface DuplicateErrorData {
  code?: number | string;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
  meta?: {
    target?: string[];
  };
}

export const handleDuplicateError = (
  error: DuplicateErrorData,
): ConflictError => {
  let errorSources: ErrorSource[] = [];

  // Mongoose duplicate key error
  if (error.keyPattern) {
    const fields = Object.keys(error.keyPattern);
    errorSources = fields.map((field) => ({
      path: [field],
      message: `${field} already exists`,
    }));
  }
  // Prisma or generic duplicate error
  else {
    const targets = error.meta?.target ?? ["field"];
    errorSources = targets.map((field) => ({
      path: [field],
      message: `${field} already exists`,
    }));
  }

  return new ConflictError("Duplicate entry detected", errorSources);
};
