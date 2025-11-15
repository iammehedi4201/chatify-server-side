import { Document, Types } from "mongoose";

export interface IEmailVerification {
  userId: Types.ObjectId;
  email: string;
  code: string;
  type: "otp";
  expiresAt: Date;
  used: boolean;
  attempts: number;
}

export interface IEmailVerificationMethods {
  isValidCode(plainCode: string): Promise<boolean>;
}

export type EmailVerificationModel = Document<unknown, {}, IEmailVerification> &
  IEmailVerification &
  IEmailVerificationMethods;
