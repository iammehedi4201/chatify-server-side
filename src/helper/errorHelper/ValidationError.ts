import { ErrorSource } from "@/interface/interface";
import { AppError } from "./appError";

export class ValidationError extends AppError {
  public constructor(
    message: string,
    public readonly errorSources: ErrorSource[],
  ) {
    super(message, 400);
  }
}
