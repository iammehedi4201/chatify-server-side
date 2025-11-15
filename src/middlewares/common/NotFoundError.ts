import { AppError } from "@/helper/errorHelper/appError";

export class NotFoundError extends AppError {
  public constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404);
  }
}
