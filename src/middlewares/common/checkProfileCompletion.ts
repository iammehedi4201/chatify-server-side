import { NextFunction, Request, Response } from "express";
import { Vendor } from "../../Modules/Vendor/Vendor.model";
import CatchAsync from "../../Utils/CatchAsync";
import sendResponse from "../../Utils/SendResponse";

export const checkProfileCompletion = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const vendor = await Vendor.findById(userId);

      if (!vendor) {
        return sendResponse(res, {
          success: false,
          statusCode: 404,
          message: "Vendor not found",
          data: null,
        });
      }

      if (!vendor.isProfileComplete) {
        return sendResponse(res, {
          success: false,
          statusCode: 403,
          message: "Please complete your profile to continue",
          data: {
            nextStep: "/profile",
          },
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },
);
