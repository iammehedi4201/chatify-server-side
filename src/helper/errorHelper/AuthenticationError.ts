import { AppError } from "@/helper/errorHelper/appError";

export class AuthenticationError extends AppError {
  public constructor(message: string = "Authentication failed") {
    super(message, 401);
  }
}
