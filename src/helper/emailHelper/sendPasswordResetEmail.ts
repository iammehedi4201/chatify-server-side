import { ENV } from "@/config";
import { getPasswordResetEmailTemplate } from "./emailTemplate";
import { sendEmail } from "./sendEmail";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: getPasswordResetEmailTemplate(resetUrl),
  });
};
