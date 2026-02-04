import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (payload: string | null): string | null => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "JWT_SECRET_KEY is not defined in the environment variables."
    );
  }
  if (!payload) {
    console.error("Payload cannot be null.");
    return null;
  }
  try {
    const token = jwt.sign(
      { id: payload },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Default to 1 hour if not specified
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(3).toString("hex");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  return { resetToken, resetPasswordToken, resetPasswordExpire };
};
