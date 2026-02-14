import { useState } from "react";
import { useNavigate, Link } from "react-router";
import API from "../../api/axios";
import "./auth.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      alert("Signup Failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phoneNumber}
          required
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />
        <button type="submit">Create Account</button>
      </form>
      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}
