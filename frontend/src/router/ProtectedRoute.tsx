import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const decoded: any = jwtDecode(token);
    if (requiredRole && decoded.role !== requiredRole) {
      if (decoded.role === "admin") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/user" replace />;
      }
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
