const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,  // your gmail address
    pass: process.env.GMAIL_PASS,  // your gmail app password
  },
});

const sendResetEmail = async (toEmail, resetLink) => {
  await transporter.sendMail({
    from: `"Kosala Support" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Request — Kosala",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #166534;">🐄 Kosala — Password Reset</h2>
        <p style="color: #374151; font-size: 15px;">
          We received a request to reset your password. Click the button below to set a new one.
          This link expires in <strong>15 minutes</strong>.
        </p>
        <a href="${resetLink}"
          style="display:inline-block; margin: 24px 0; padding: 12px 28px;
                 background: #166534; color: white; text-decoration: none;
                 border-radius: 8px; font-size: 15px; font-weight: bold;">
          Reset My Password
        </a>
        <p style="color: #6b7280; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
          Your password will not change.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Kosala Gaushala Management System</p>
      </div>
    `,
  });
};

module.exports = sendResetEmail;