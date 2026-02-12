import { Navigate } from "react-router";

export default function ProtectedRoute({ children, role }: any) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/dashboard/user" replace />;
  }
  return children;
}
