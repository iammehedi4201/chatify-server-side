import { ErrorSource } from "@/interface/interface";
import { ZodError, ZodIssue } from "zod";
import { ValidationError } from "./ValidationError";

export const handleZodError = (error: ZodError): ValidationError => {
  const errorSources: ErrorSource[] = error.issues.map((issue: ZodIssue) => ({
    path:
      issue.path.length > 0
        ? issue.path.map(String) // ✅ convert numbers/symbols to string
        : ["_global"],
    message: issue.message,
  }));

  return new ValidationError("Validation failed", errorSources);
};
