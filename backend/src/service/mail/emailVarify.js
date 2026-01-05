import { mailer } from "./mail.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {
  try {
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "./template.hbs"),
      "utf8"
    );
    const template = handlebars.compile(emailTemplateSource);

    await mailer.sendMail(
      email,
      "Edu2Job Account Verification",
      template({ token: encodeURIComponent(token) })
    );
  } catch (err) {
    console.error("Error sending verification email:", err);
    throw err;
  }
};
