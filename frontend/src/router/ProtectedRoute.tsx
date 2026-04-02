import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client";
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
    const role = decoded.role?.toLowerCase();
    if (requiredRole && role !== requiredRole) {
      const redirectPath = role === "admin" ? "/admin" : "/client";
      if (location.pathname !== redirectPath) {
        return <Navigate to={redirectPath} replace />;
      }
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
