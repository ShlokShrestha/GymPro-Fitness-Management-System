import { useState } from "react";
import { useNavigate, Link } from "react-router";
import API from "../../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      const role = res.data.role;
      role === "admin" ? navigate("/admin") : navigate("/user");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Login</button>
        <Link to="/forgot-password">Forgot Password?</Link>
        <p>
          Don't have account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
