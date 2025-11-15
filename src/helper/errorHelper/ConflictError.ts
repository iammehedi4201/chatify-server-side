import { AppError } from "@/helper/errorHelper/appError";
import { ErrorSource } from "@/interface/interface";

export class ConflictError extends AppError {
  public constructor(
    message: string,
    public readonly errorSources: ErrorSource[],
  ) {
    super(message, 409);
  }
}
