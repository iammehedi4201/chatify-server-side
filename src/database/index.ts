import { ENV } from "@/config";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI as string);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
