import { AuthenticationError } from "@/helper/errorHelper/AuthenticationError";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";

export const handleJWTError = (error: Error): AuthenticationError => {
  if (error instanceof TokenExpiredError) {
    return new AuthenticationError("Token has expired");
  }

  if (error instanceof JsonWebTokenError) {
    return new AuthenticationError("Invalid token");
  }

  if (error instanceof NotBeforeError) {
    return new AuthenticationError("Token not yet valid");
  }

  return new AuthenticationError("Authentication failed");
};
