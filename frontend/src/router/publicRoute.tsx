import { Navigate } from "react-router";

export default function PublicRoute({ children }: any) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If token exists → prevent going back to login
  if (token) {
    return role === "admin" ? (
      <Navigate to="/dashboard/admin" replace />
    ) : (
      <Navigate to="/dashboard/user" replace />
    );
  }

  return children;
}
