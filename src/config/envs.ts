import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),

  JWT_ACCESS_SECRET_KEY: z.string().min(1, "JWT_ACCESS_SECRET_KEY is required"),
  JWT_REFRESH_SECRET_KEY: z
    .string()
    .min(1, "JWT_REFRESH_SECRET_KEY is required"),
  PASSWORD_RESET_SECRET: z.string().min(1, "PASSWORD_RESET_SECRET is required"),
  ACCESS_TOKEN_EXPIERY: z.string().default("10d"),
  REFRESH_TOKEN_EXPIERY: z.string().default("365d"),

  EMAIL: z.string().email(),
  EMAIL_VERIFICATION_SECRET: z
    .string()
    .min(1, "EMAIL_VERIFICATION_SECRET is required"),
  APP_PASSWORD: z.string(),
  EMAIL_SERVICE: z.string().default("smtp.gmail.com"),

  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string(),
  RESET_PASS_UI_URL: z.string().url(),
  SALT_ROUNDS: z.string().default("10"),

  ACCESS_KEY_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_SENDER: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    env.error.flatten().fieldErrors,
  );
  process.exit(1);
}

export const ENV = {
  NODE_ENV: env.data.NODE_ENV,
  PORT: Number(env.data.PORT),
  MONGO_URI: env.data.MONGO_URI,

  CLIENT_URL: env.data.CLIENT_URL,

  JWT_ACCESS_SECRET_KEY: env.data.JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY: env.data.JWT_REFRESH_SECRET_KEY,
  ACCESS_TOKEN_EXPIERY: env.data.ACCESS_TOKEN_EXPIERY,
  REFRESH_TOKEN_EXPIERY: env.data.REFRESH_TOKEN_EXPIERY,

  EMAIL: env.data.EMAIL,
  EMAIL_VERIFICATION_SECRET: env.data.EMAIL_VERIFICATION_SECRET,
  APP_PASSWORD: env.data.APP_PASSWORD,
  EMAIL_SERVICE: env.data.EMAIL_SERVICE,

  SUPER_ADMIN_EMAIL: env.data.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: env.data.SUPER_ADMIN_PASSWORD,
  RESET_PASS_UI_URL: env.data.RESET_PASS_UI_URL,
  PASSWORD_RESET_SECRET: env.data.PASSWORD_RESET_SECRET,
  SALT_ROUNDS: Number(env.data.SALT_ROUNDS),

  CLOUDINARY_CLOUD_NAME: env.data.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: env.data.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: env.data.CLOUDINARY_API_SECRET,
};
