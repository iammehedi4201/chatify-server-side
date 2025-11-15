import ValidateRequest from "@/middlewares/common/ValidationRequest";
import { Router } from "express";
import { AuthController } from "./Auth.controller";
import {
  createCustomerValidation,
  createDeliveryManValidation,
  createVendorValidation,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  verifyOTPSchema,
} from "./Auth.validation";

const router = Router();

//! Create New Customer
router.post(
  "/register-customer",
  ValidateRequest(createCustomerValidation),
  AuthController.registerCustomerToDB,
);

//! Create Vendor
router.post(
  "/register-vendor",
  ValidateRequest(createVendorValidation),
  AuthController.registerVendorToDB,
);

//! Create Delivery Man
router.post(
  "/register-deliveryman",
  ValidateRequest(createDeliveryManValidation),
  AuthController.registerDeliveryManToDB,
);

//! Login User
router.post("/login", ValidateRequest(loginSchema), AuthController.loginToDB);

//! Send OTP Fallback Route
router.post("/send-otp", AuthController.sendOTP);

//! Verify Email Route
router.get("/verify-email", AuthController.verifyEmail);

//! Verify OTP Route
router.post(
  "/verify-otp",
  ValidateRequest(verifyOTPSchema),
  AuthController.verifyOTPCode,
);

//! Refresh Access Token Route
router.post(
  "/refresh-token",
  ValidateRequest(refreshTokenSchema),
  AuthController.refreshAccessToken,
);

//! Forgot Password Route
router.post(
  "/forgot-password",
  ValidateRequest(forgotPasswordSchema),
  AuthController.forgotPassword,
);

//! Reset Password Route
router.post(
  "/reset-password",
  ValidateRequest(resetPasswordSchema),
  AuthController.resetPassword,
);

export const Authroutes = router;
