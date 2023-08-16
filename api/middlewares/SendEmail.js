const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  sendEmailResetPassword: async (email, token) => {
    const ResetPasswordMessage = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset Your Password",
      html: `
      <p>To reset your password, click the link below:</p>
      <p>The link is valid for only 15 minutes. after that you need to generate another link.</p>
      <a href="http://localhost:3000/resetPassword/${token}">Reset Password</a>
    `,
    };

    return await transporter.sendMail(ResetPasswordMessage);
  },

  sendEmail: async (email, subject, text) => {
    const WelcomeMessage = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: subject,
      html: text,
    };

    return await transporter.sendMail(WelcomeMessage);
  },

  sendEmailContactUs: async (email, subject, text) => {
    const ContactMessage = {
      from: email,
      to: process.env.EMAIL_USERNAME,
      subject: subject,
      html: text,
    };

    return await transporter.sendMail(ContactMessage);
  },
};
