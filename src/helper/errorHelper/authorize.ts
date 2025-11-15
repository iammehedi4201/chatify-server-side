import { AppError } from "@/helper/errorHelper/appError";
import { verifyToken } from "@/helper/jwtHelper";
import { IJwtPayload, TUserRoles } from "@/Modules/User/User.interface";
import { User } from "@/Modules/User/User.model";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const authorize = (...allowedRoles: TUserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token)
        throw new AppError("Token not found", httpStatus.UNAUTHORIZED);

      if (!token)
        throw new AppError("Token format invalid", httpStatus.UNAUTHORIZED);

      const decoded = verifyToken(
        token,
        process.env.JWT_ACCESS_SECRET!,
      ) as IJwtPayload;

      const user = await User.findOne({ email: decoded.email });
      if (!user) throw new AppError("User not found", httpStatus.NOT_FOUND);

      // Only check if user is active
      if (!user.isActive) {
        throw new AppError("User is not active", httpStatus.FORBIDDEN);
      }

      // Role check
      if (
        allowedRoles.length &&
        !allowedRoles.includes(decoded.role as TUserRoles)
      ) {
        throw new AppError(
          "Access denied: insufficient permissions",
          httpStatus.FORBIDDEN,
        );
      }

      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  };
};
