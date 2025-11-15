import { ENV } from "@/config";
import CatchAsync from "../../Utils/CatchAsync";
import sendResponse from "../../Utils/SendResponse";
import { AuthService } from "./Auth.service";

// const LoginUser = CatchAsync(async (req, res) => {
//   const result = await AuthService.LoginUserToDb(req.body);
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     data: result,
//     message: "User Logged In Successfully",
//   });
// });

//! Register Customer Controller
const registerCustomerToDB = CatchAsync(async (req, res) => {
  const result = await AuthService.registerCustomerToDB(req.body);

  // 2️⃣ Send response with access token + customer info
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Customer registered successfully",
    data: result,
  });
});

//! Login User Controller
const loginToDB = CatchAsync(async (req, res) => {
  const { accessToken, refreshToken, user } = await AuthService.loginToDB(
    req.body,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Logged in successfully",
    data: { accessToken, user },
  });
});

//! Verify Email Controller
const verifyEmail = CatchAsync(async (req, res) => {
  const { token } = req.query;

  if (typeof token !== "string") {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Invalid token",
      data: null,
    });
  }

  const { accessToken, refreshToken } = await AuthService.verifyEmail(token);

  // 1. Set refreshToken in httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });

  // 2. Redirect to /home with accessToken
  const redirectUrl = new URL("/", ENV.CLIENT_URL);
  redirectUrl.searchParams.set("accessToken", accessToken);

  // Optional: Add flag so frontend knows it's post-verification
  redirectUrl.searchParams.set("verified", "true");
  // 3. Send a tiny JSON response (optional) then redirect
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Email verified and logged in",
    data: { redirectTo: redirectUrl.toString() },
  });
});

//! Send OTP Controller
const sendOTP = CatchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.sendOTP(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

//! Verify OTP Controller
const verifyOTPCode = CatchAsync(async (req, res) => {
  const { email, code } = req.body;
  const { accessToken, refreshToken } = await AuthService.verifyOTPCode(
    email,
    code,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  const redirectUrl = new URL("/home", ENV.CLIENT_URL);
  redirectUrl.searchParams.set("accessToken", accessToken);
  redirectUrl.searchParams.set("verified", "true");

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP verified",
    data: { redirectTo: redirectUrl.toString() },
  });
});

//! Refresh Token Controller
const refreshAccessToken = CatchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken } = await AuthService.refreshAccessToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Access token refreshed successfully",
    data: { accessToken },
  });
});

//! Forgot Password Controller
const forgotPassword = CatchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

//! Reset Password Controller
const resetPassword = CatchAsync(async (req, res) => {
  const { token, password } = req.body;
  const result = await AuthService.resetPassword(token, password);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.message,
    data: null,
  });
});

//! Register Vendor Controller
const registerVendorToDB = CatchAsync(async (req, res) => {
  const result = await AuthService.createVendorToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Vendor registered successfully",
    data: result,
  });
});

//! Register DeliveryMan Controller
const registerDeliveryManToDB = CatchAsync(async (req, res) => {
  const result = await AuthService.createDeliveryManToDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Delivery man registered successfully",
    data: result,
  });
});

export const AuthController = {
  loginToDB,
  registerCustomerToDB,
  verifyEmail,
  sendOTP,
  verifyOTPCode,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  registerVendorToDB,
  registerDeliveryManToDB,
};
