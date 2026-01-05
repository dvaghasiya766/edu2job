import { mailer } from "./mail.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOTP = async (otp, email, name) => {
  console.log(email, otp, name);
  try {
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "./otpTemplate.hbs"),
      "utf8"
    );
    const template = handlebars.compile(emailTemplateSource);
    await mailer.sendMail(
      email,
      "Edu2Job: Forget Password OTP",
      template({ otp: otp, name: name, year: 2025 })
    );
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw err;
  }
};
