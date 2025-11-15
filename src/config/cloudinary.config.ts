import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { ENV } from "./envs";

dotenv.config();

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;
