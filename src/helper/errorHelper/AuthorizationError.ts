import { AppError } from "@/helper/errorHelper/appError";

export class AuthorizationError extends AppError {
  public constructor(message: string = "Insufficient permissions") {
    super(message, 403);
  }
}
