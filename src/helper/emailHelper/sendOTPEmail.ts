import { ENV } from "@/config";
import {
  getOTPEmailTemplate,
  getVerificationEmailTemplate,
} from "./emailTemplate";
import { sendEmail } from "./sendEmail";

export const sendOTPEmail = async (
  email: string,
  otp: string,
  expiryMinutes = 10,
) => {
  const html = getOTPEmailTemplate(otp, expiryMinutes);

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    html,
  });
};
