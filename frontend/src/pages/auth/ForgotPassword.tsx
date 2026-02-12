import { useState } from "react";
import API from "../../api/axios";
import "./auth.css";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/forgotPassword", { email });
      if (response.status === 200) {
        alert("Reset link sent to email");
        navigate("/reset-password");
      }
    } catch (err) {
      alert("Failed to send reset link");
    }
  };

  return (
    <div className="auth-card">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}
