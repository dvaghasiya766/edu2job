import { httpError } from "../../models/http.error.js";
import nodemailer from "nodemailer";
import "dotenv/config";

class Mailer {
  constructor(user = process.env.EMAIL_USER, pass = process.env.EMAIL_PASS) {
    this.user = user;
    this.pass = pass;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  sendMail(to, subject, html) {
    return this.transporter.sendMail(
      {
        from: `"Edu2Job" <${this.user}>`, // better sender format
        to,
        subject,
        html,
      }
      // function (err, info) {
      //   if (err) {
      //     console.log(err);
      //     next(
      //       new httpError("Error sending email", 500, {
      //         message: "Email address is not vaild",
      //         path: "email",
      //       })
      //     );
      //   }
      // }
    );
  }
}

export const mailer = new Mailer();
