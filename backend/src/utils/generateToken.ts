import jwt from "jsonwebtoken";
import crypto from "crypto";

type payloadProps = {
  id: string;
  email: string;
  role: string;
};

export const generateToken = (payload: payloadProps): string | null => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "JWT_SECRET_KEY is not defined in the environment variables.",
    );
  }
  if (!payload) {
    console.error("Payload cannot be null.");
    return null;
  }
  try {
    const token = jwt.sign(
      { id: payload.id, role: payload.role },
      secret as jwt.Secret,
      {
        expiresIn:
          (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "1h",
      },
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
