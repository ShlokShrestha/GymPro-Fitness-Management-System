import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }
  if (token) {
    const decoded: any = jwtDecode(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  }
  return children;
}
