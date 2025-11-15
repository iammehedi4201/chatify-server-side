import { z } from "zod";
import { userRoles } from "./User.constant";

// Reusable password validation
const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Must contain at least one uppercase letter",
  })
  .refine((val) => /[a-z]/.test(val), {
    message: "Must contain at least one lowercase letter",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Must contain at least one number",
  });

// ✅ Core user schema (used both for model typing and validation)
const BaseUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(Object.keys(userRoles) as [keyof typeof userRoles]),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
});

// ✅ Full request validation schema (for Express middleware)
export const RegisterUserSchema = z.object({
  body: BaseUserSchema.refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  ),
});

export const UserLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const UserValidation = {
  RegisterUserSchema,
  UserLoginSchema,
};
