import { useState } from "react";
import API from "../../api/axios";
import "./auth.css";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await API.post("/auth/resetPassword", { otp, password });
      alert("Password Reset Successful");
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  return (
    <div className="auth-card">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="OTP"
          value={otp}
          required
          onChange={(e) => setOtp(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
