import { Outlet } from "react-router";
import "./authlayout.css";

export default function AuthLayout() {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>
          Welcome to <br />
          Smart Fitness
        </h1>
        <p>
          Track your workouts, achieve your fitness goals, and stay motivated
          every day.
        </p>
      </div>
      <div className="auth-right">
        <Outlet />
      </div>
    </div>
  );
}
