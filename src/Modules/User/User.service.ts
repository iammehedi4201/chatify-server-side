import { ENV } from "@/config";
import { sendVerificationEmail } from "@/helper/emailHelper/sendVerificationEmail";
import { AppError } from "@/helper/errorHelper/appError";
import { generateToken } from "@/helper/jwtHelper";
import { email } from "zod";
import { IUser } from "./User.interface";
import { User } from "./User.model";

// const RegisterUserToDB = async (payLoad: IUser) => {
//check if user already exists
//   const isUserExist = await User.findOne({ email: payLoad?.email });
//   if (isUserExist) {
//     throw new AppError("User already exists", 400);
//   }

//create access token
//   const jwtPayload: IJwtPayload = {
//     email: payLoad?.email,
//     role: payLoad?.role,
//   };

//   const accessToken = await CreateAccessToken(jwtPayload);

//create user
//   await User.create(payLoad);

//   return {
//     accessToken: accessToken,
//   };
// };

// export const UserService = {
//   RegisterUserToDB,
// };

const GetAllUsers = async () => {
  const users = await User.find({}, { password: 0, confirmPassword: 0 }).sort({
    createdAt: -1,
  });

  if (!users) {
    throw new AppError("Users not found", 404);
  }

  return users;
};

const GetUserById = async (id: string) => {
  const user = await User.findById(id, { password: 0, confirmPassword: 0 });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

const UpdateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);

  const { name, email, password, confirmPassword, ...safeData } = payload;
  // let verificationSent = false;

  // if (safeData.email && safeData.email !== user.email) {
  //   const existingUser = await User.findOne({ email: safeData.email });
  //   if (existingUser && existingUser._id.toString() !== id) {
  //     throw new AppError("Email already in use", 400);
  //   }

  //   safeData.isVerified = false;

  //   const token = generateToken(
  //     { id, email: safeData.email },
  //     ENV.JWT_ACCESS_SECRET_KEY,
  //   );
  //   await sendVerificationEmail(safeData.email, token);
  //   verificationSent = true;
  // }

  const updatedUser = await User.findByIdAndUpdate(id, safeData, {
    new: true,
    runValidators: true,
  }).select("-password -confirmPassword");

  return {
    user: updatedUser,
    // verificationSent,
  };
};

const DeleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isActive) {
    throw new AppError("User already inactive", 400);
  }

  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  return { message: "User Delete successfully" };
};

export const UserService = {
  GetAllUsers,
  GetUserById,
  UpdateUser,
  DeleteUser,
};

// import jwt from "jsonwebtoken";
// import User from "../models/User.model";

// const verifyEmail = async (req, res) => {
//   const { token } = req.body;

//   try {
//     const decoded = jwt.verify(token, process.env.EMAIL_SECRET!);
//     const user = await User.findById(decoded.id);
//     if (!user) throw new Error("User not found");

//     user.isVerified = true;
//     await user.save();

//     res.status(200).json({ message: "Email verified successfully" });
//   } catch (err) {
//     res.status(400).json({ message: "Invalid or expired token" });
//   }
// };
