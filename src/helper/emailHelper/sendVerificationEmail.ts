import { ENV } from "@/config";
import { getVerificationEmailTemplate } from "./emailTemplate";
import { sendEmail } from "./sendEmail";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${ENV.CLIENT_URL}/api/auth/verify-email?token=${token}`;

  const html = getVerificationEmailTemplate(verificationUrl);

  await sendEmail({
    to: email,
    subject: "Verify Your Email Address",
    html,
  });
};
