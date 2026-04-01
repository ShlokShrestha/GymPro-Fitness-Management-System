import nodemailer from "nodemailer";

interface CreateUserEmailOptions {
  email: string;
  subject: string;
  htmlContent: string;
}

export const sendUserEmail = async (
  options: CreateUserEmailOptions,
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    secure: true,
  });

  const mailData = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: `
    <div style="font-family: Arial; background:#f4f6f8; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden;">
        <div style="background:linear-gradient(90deg,#4facfe,#00f2fe); padding:20px; text-align:center; color:#fff;">
          <h2>Our Platform</h2>
        </div>

        <div style="padding:30px; text-align:center;">
          ${options.htmlContent}
        </div>

        <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px;">
          <p>If you didn’t expect this email, please contact support.</p>
        </div>

      </div>
    </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailData);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};
