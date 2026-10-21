import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASS } from "../../config/config.service.js";
export async function sendMail({ to, text, subject, html, cc, bcc }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: USER_PASS,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `"Route Academy " <${USER_EMAIL}>`,
      to,
      subject,
      text,
      cc,
      html,
      bcc,
    });
  
  } catch (error) {
    console.log(`Error While sending Emil:${error}`);
  }
}


export const emailSubject = {
    confirmEmail : "confirm Your Email",
    resetPassword : "reset Your Password",
    wlecome: "welcome To Route Academy",
    contactUs: "ContactUs"

}