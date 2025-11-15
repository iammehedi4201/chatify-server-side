// models/EmailVerification.model.ts
import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import {
  EmailVerificationModel,
  IEmailVerification,
} from "./EmailVerification.interface";

const emailVerificationSchema = new Schema<EmailVerificationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// === INDEXES ===
emailVerificationSchema.index({ email: 1 });
emailVerificationSchema.index({ userId: 1, used: 1 });

// Auto-delete expired tokens (MongoDB TTL) - deletes after 10 minutes
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// === METHODS ===
emailVerificationSchema.methods.isValidCode = async function (
  plainCode: string,
): Promise<boolean> {
  return await bcrypt.compare(plainCode, this.code);
};

export const EmailVerification = model<EmailVerificationModel>(
  "EmailVerification",
  emailVerificationSchema,
);
