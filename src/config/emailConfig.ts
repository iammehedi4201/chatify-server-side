import nodemailer from "nodemailer";
import { ENV } from "./envs";

const transporter = nodemailer.createTransport({
  host: ENV.EMAIL_SERVICE,
  port: 465,
  secure: true,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.APP_PASSWORD,
  },
});

export default transporter;
