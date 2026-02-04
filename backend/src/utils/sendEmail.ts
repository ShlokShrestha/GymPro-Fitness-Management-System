import nodemailer from "nodemailer";

interface Options {
  email: string;
  subject: string;
  resetToken: string;
}

const sendEmail = async (options: Options): Promise<void> => {
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
    to: options?.email,
    subject: options?.subject,
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #edf2f7;
        color: #2d3748;
      }
      .email-wrapper {
        padding: 20px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(90deg, #667eea, #764ba2);
        padding: 30px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content p {
        margin: 10px 0;
        font-size: 16px;
        line-height: 1.6;
      }
      .token-box {
        margin: 20px auto;
        padding: 15px 25px;
        background: #edf2f7;
        border: 2px solid #667eea;
        border-radius: 8px;
        font-size: 20px;
        font-weight: bold;
        color: #2d3748;
        letter-spacing: 2px;
        display: inline-block;
      }
      .cta {
        margin-top: 30px;
      }
      .cta a {
        display: inline-block;
        padding: 12px 30px;
        background: #667eea;
        color: #ffffff;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        border-radius: 6px;
        transition: background 0.3s ease;
      }
      .cta a:hover {
        background: #764ba2;
      }
      .footer {
        padding: 20px;
        text-align: center;
        background: #f7fafc;
        font-size: 14px;
        color: #718096;
      }
      .footer a {
        color: #667eea;
        text-decoration: none;
      }

      /* Mobile responsiveness */
      @media (max-width: 600px) {
        .header h1 {
          font-size: 24px;
        }
        .content p {
          font-size: 14px;
        }
        .token-box {
          font-size: 18px;
          padding: 12px 20px;
        }
        .cta a {
          font-size: 14px;
          padding: 10px 25px;
        }
        .footer p {
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello Sir/Madam,</p>
          <p>You recently requested to reset your password. Use the code below to complete the process:</p>
          <div class="token-box">
            ${options.resetToken}
          </div>
          <p><strong>Note:</strong> This code will expire in 15 minutes. Please complete the process before it expires.</p>
          <p>If you didn’t request this, please ignore this email or reach out to our support team for assistance.</p>
        </div>
        <div class="footer">
          <p>If you need help, <a href="#">contact support</a>.</p>
          <p>Thank you, <br>The Support Team</p>
        </div>
      </div>
    </div>
  </body>
</html>

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

export default sendEmail;
