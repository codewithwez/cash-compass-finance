const nodemailer = require("nodemailer");

const getTransporter = () => {
  const requiredSettings = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
  ];

  if (requiredSettings.some((setting) => !process.env[setting])) {
    throw new Error(
      "Password reset email is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD to server/.env."
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: "Reset your CashCompass password",
    text: `Use this link to reset your CashCompass password. It expires in 1 hour: ${resetUrl}`,
    html: `<p>Use the link below to reset your CashCompass password.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in 1 hour.</p>`,
  });
};

module.exports = { sendPasswordResetEmail };
