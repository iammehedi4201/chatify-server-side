import httpStatus from "http-status";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import JwtError from "./errorHelper/jwtError";

export const generateToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string | number = "1h",
): string => {
  try {
    const options: SignOptions = {
      algorithm: "HS256",
      expiresIn: expiresIn as any,
    };

    return jwt.sign(payload, secret, options);
  } catch (err) {
    throw new JwtError(
      "Failed to generate token",
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== "object" || !("exp" in decoded)) {
      throw new JwtError("Malformed token", httpStatus.UNAUTHORIZED);
    }

    return decoded as JwtPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new JwtError("Token expired", httpStatus.UNAUTHORIZED);
    }
    if (err.name === "JsonWebTokenError") {
      throw new JwtError("Invalid token", httpStatus.UNAUTHORIZED);
    }
    throw new JwtError(
      "Token verification failed",
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
