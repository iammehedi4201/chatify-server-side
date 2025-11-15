import { randomInt } from "crypto";
import { ENV } from "@/config";
import { sendOTPEmail } from "@/helper/emailHelper/sendOTPEmail";
import { sendPasswordResetEmail } from "@/helper/emailHelper/sendPasswordResetEmail";
import { sendVerificationEmail } from "@/helper/emailHelper/sendVerificationEmail";
import { AppError } from "@/helper/errorHelper/appError";
import { generateToken, verifyToken } from "@/helper/jwtHelper";
import { performDBTransaction } from "@/Utils/performDBTransaction";
import { CustomerRegisterPayload } from "../Customer/Customer.interface";
import { Customer } from "../Customer/Customer.model";
import { DeliveryMan } from "../DeliveryMan/DeliveryMan.model"; // add near other imports
import { EmailVerification } from "../EmailVerification/EmailVerification.model";
import { userRoles } from "../User/User.constant";
import { User } from "../User/User.model";
import { Vendor } from "../Vendor/Vendor.model"; // add import near other imports

import { hashPassword } from "./../../helper/password.helper";

//! Register Customer Service
const registerCustomerToDB = async (payLoad: CustomerRegisterPayload) => {
  const { name, email, password } = payLoad;

  const hashedPassword = await hashPassword(password);

  // Perform transaction for DB operations only
  const { user, customer } = await performDBTransaction(async (session) => {
    const isCustomerExists = await Customer.findOne({ email }).session(session);
    if (isCustomerExists) {
      throw new AppError("Customer already exists", 400);
    }

    // Create user
    const [user] = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          role: userRoles.Customer,
        },
      ],
      { session },
    );

    // Create customer
    const [customer] = await Customer.create(
      [
        {
          name,
          email,
          user_id: user._id,
        },
      ],
      { session },
    );

    return { user, customer };
  });

  // Generate Magic Link JWT
  const magicToken = generateToken(
    {
      id: user._id,
      email: user.email,
    },
    ENV.EMAIL_VERIFICATION_SECRET,
    "15min",
  );

  await sendVerificationEmail(email, magicToken);

  return customer;
};

//! Create Vendor Service
const createVendorToDB = async (payLoad: {
  name: string;
  email: string;
  password: string;
  phone: string | number;
  store_name?: string;
  paymentMethod?: any;
  address?: any;
  verification?: any;
}) => {
  const {
    name,
    email,
    password,
    phone,
    store_name,
    paymentMethod,
    address,
    verification,
  } = payLoad;

  const hashedPassword = await hashPassword(password);

  const { user, vendor } = await performDBTransaction(async (session) => {
    // If user exists, ensure not already vendor and upgrade role
    let user = await User.findOne({ email }).session(session);

    if (user) {
      if (user.role === userRoles.Vendor) {
        throw new AppError("Vendor already exists", 400);
      }
      // upgrade existing customer to vendor
      user.role = userRoles.Vendor;
      user.name = name || user.name;
      user.password = hashedPassword;
      await user.save({ session });
    } else {
      // create a new user as vendor
      [user] = await User.create(
        [
          {
            name,
            email,
            password: hashedPassword,
            role: userRoles.Vendor,
          },
        ],
        { session },
      );
    }

    // Ensure no vendor record already exists for this user
    const existingVendor = await Vendor.findOne({ user_id: user._id }).session(
      session,
    );
    if (existingVendor) {
      throw new AppError("Vendor already exists", 400);
    }

    // create vendor document
    const [vendor] = await Vendor.create(
      [
        {
          user_id: user._id,
          name,
          phone,
          email,
          store_name: store_name || "",
          paymentMethod: paymentMethod || {},
          address: address || {},
          verification: verification || {},
        },
      ],
      { session },
    );

    return { user, vendor };
  });

  // Generate Magic Link JWT
  const magicToken = generateToken(
    {
      id: user._id,
      email: user.email,
    },
    ENV.EMAIL_VERIFICATION_SECRET,
    "15min",
  );

  await sendVerificationEmail(email, magicToken);

  return vendor;
};

//! Create DeliveryMan Service
const createDeliveryManToDB = async (payLoad: {
  name: string;
  email: string;
  password: string;
  phone: string | number;
  vehicleType: string;
  address?: any;
  location?: { latitude: number; longitude: number };
  verification?: any;
}) => {
  const {
    name,
    email,
    password,
    phone,
    vehicleType,
    address,
    location,
    verification,
  } = payLoad;

  const hashedPassword = await hashPassword(password);

  const { user, deliveryMan } = await performDBTransaction(async (session) => {
    // find existing user
    let user = await User.findOne({ email }).session(session);

    if (user) {
      if (user.role === userRoles.Delivery_Man) {
        throw new AppError("DeliveryMan already exists", 400);
      }
      // upgrade role and update password/name
      user.role = userRoles.Delivery_Man;
      user.name = name || user.name;
      user.password = hashedPassword;
      await user.save({ session });
    } else {
      // create new user as deliveryman
      [user] = await User.create(
        [
          {
            name,
            email,
            password: hashedPassword,
            role: userRoles.Delivery_Man,
          },
        ],
        { session },
      );
    }

    // ensure no delivery man document exists
    const existing = await DeliveryMan.findOne({ userId: user._id }).session(
      session,
    );

    if (existing) {
      throw new AppError("DeliveryMan already exists", 400);
    }

    // create delivery man document
    const [deliveryMan] = await DeliveryMan.create(
      [
        {
          userId: user._id,
          name,
          phone,
          address: address || {},
          location: location || undefined,
          vehicleType,
          verification: verification || {},
        },
      ],
      { session },
    );

    return { user, deliveryMan };
  });

  // Generate Magic Link JWT
  const magicToken = generateToken(
    {
      id: user._id,
      email: user.email,
    },
    ENV.EMAIL_VERIFICATION_SECRET,
    "15min",
  );

  await sendVerificationEmail(email, magicToken);

  return deliveryMan;
};

//! Login Service
const loginToDB = async (payLoad: { email: string; password: string }) => {
  const { email, password } = payLoad;

  const user = await User.findOne({ email, isActive: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await User.isPasswordCorrect(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  // Generate tokens AFTER transaction (doesn't need DB lock)
  const payload = { id: user._id, email: user.email, role: user.role };

  const accessToken = generateToken(payload, ENV.JWT_ACCESS_SECRET_KEY, "15m");
  const refreshToken = generateToken(payload, ENV.JWT_REFRESH_SECRET_KEY, "7d");

  return {
    user,
    accessToken,
    refreshToken,
  };
};

//! Verify Email Service
const verifyEmail = async (token: string) => {
  if (!token) {
    throw new AppError("token is required", 400);
  }

  const decoded = verifyToken(token, ENV.EMAIL_VERIFICATION_SECRET);

  const user = await User.findOne({
    _id: decoded.id,
    email: decoded.email,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Generate tokens
  const accessToken = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    ENV.JWT_ACCESS_SECRET_KEY,
    "15m",
  );

  const refreshToken = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    ENV.JWT_REFRESH_SECRET_KEY,
    "7d",
  );

  // 4. Mark as verified ONLY if not already
  const alreadyVerified = user.isVerified;
  if (!alreadyVerified) {
    user.isVerified = true;
    await user.save();
  }

  return {
    accessToken,
    refreshToken,
  };
};

//! Send OTP Service
const sendOTP = async (email: string) => {
  const user = await User.findOne({ email, isVerified: false });
  if (!user) throw new AppError("User not found or already verified", 404);

  const recentOTP = await EmailVerification.findOne({
    email,
    createdAt: { $gt: new Date(Date.now() - 60 * 1000) }, // 1 min cooldown
  });

  if (recentOTP) {
    throw new AppError("Please wait 1 minute before requesting a new OTP", 429);
  }

  // Revoke old OTPs
  await EmailVerification.deleteMany({ userId: user._id, used: false });

  // Use crypto.randomInt for secure OTP generation
  const code = randomInt(100000, 1000000).toString(); // 6-digit
  const hashed = await hashPassword(code);

  await EmailVerification.create({
    userId: user._id,
    email,
    code: hashed,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  });

  await sendOTPEmail(email, code);
  return { message: "OTP sent to email" };
};

//! Verify OTP Service
const verifyOTPCode = async (email: string, code: string) => {
  const record = await EmailVerification.findOne({
    email,
    used: false,
    expiresAt: { $gt: new Date() }, // ← CRITICAL: Check expiry
  });

  if (!record) throw new AppError("Invalid or expired code", 400);

  // Check attempts (fail fast)
  if (record.attempts >= 3) {
    // Mark as used to ensure it's not attempted further
    await EmailVerification.updateOne({ _id: record._id }, { used: true });
    throw new AppError("Too many failed attempts. Request a new OTP.", 429);
  }

  // Validate code
  if (!(await record.isValidCode(code))) {
    // Increment attempts atomically
    const updated = await EmailVerification.findByIdAndUpdate(
      record._id,
      { $inc: { attempts: 1 } },
      { new: true },
    );

    if (updated && updated.attempts >= 3) {
      // Lock this OTP after reaching attempt limit
      await EmailVerification.updateOne({ _id: record._id }, { used: true });
      throw new AppError("Too many failed attempts. Request a new OTP.", 429);
    }

    throw new AppError("Incorrect code", 400);
  }

  // Mark OTP as used atomically to prevent reuse/race conditions
  await EmailVerification.findOneAndUpdate(
    { _id: record._id, used: false },
    { $set: { used: true } },
  );

  const user = await User.findByIdAndUpdate(
    record.userId,
    { isVerified: true },
    { new: true },
  );

  if (!user) throw new AppError("User not found", 404);

  // Generate tokens AFTER transaction/verification
  const accessToken = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    ENV.JWT_ACCESS_SECRET_KEY,
    "15m",
  );

  const refreshToken = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    ENV.JWT_REFRESH_SECRET_KEY,
    "7d",
  );

  return { accessToken, refreshToken };
};

//! Refresh Token Service
const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  // Verify refresh token
  const decoded = verifyToken(refreshToken, ENV.JWT_REFRESH_SECRET_KEY);

  // Find user and verify they still exist and are active
  const user = await User.findOne({
    _id: decoded.id,
    email: decoded.email,
    isActive: true,
    isVerified: true,
  });

  if (!user) {
    throw new AppError("User not found or inactive", 404);
  }

  // Generate new access token
  const accessToken = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    ENV.JWT_ACCESS_SECRET_KEY,
    "15m",
  );

  return {
    accessToken,
  };
};

//! Forgot Password Service
const forgotPassword = async (email: string) => {
  // Find user by email
  const user = await User.findOne({ email, isActive: true });

  // Always return success to prevent email enumeration
  if (!user) {
    return {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  // Generate password reset token
  const resetToken = generateToken(
    {
      id: user._id,
      email: user.email,
      purpose: "password-reset",
    },
    ENV.PASSWORD_RESET_SECRET,
    "15min",
  );

  // Send password reset email
  await sendPasswordResetEmail(email, resetToken);

  return {
    message:
      "If an account exists with this email, a password reset link has been sent.",
  };
};

//! Reset Password Service
const resetPassword = async (token: string, newPassword: string) => {
  // Verify reset token
  const decoded = verifyToken(token, ENV.PASSWORD_RESET_SECRET);

  // Validate token purpose
  if (decoded.purpose !== "password-reset") {
    throw new AppError("Invalid token", 401);
  }

  // Find user
  const user = await User.findOne({
    _id: decoded.id,
    email: decoded.email,
    isActive: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  user.password = hashedPassword;
  await user.save();

  // Invalidate all existing sessions (optional but recommended)
  // You might want to implement a token blacklist or version system

  return {
    message:
      "Password reset successfully. Please login with your new password.",
  };
};

export const AuthService = {
  registerCustomerToDB,
  loginToDB,
  verifyEmail,
  sendOTP,
  verifyOTPCode,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  createVendorToDB,
  createDeliveryManToDB, // added
};
