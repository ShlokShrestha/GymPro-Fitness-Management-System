import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router";

export default function PublicRoute({ children }: any) {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded: any = jwtDecode(token);
    return decoded.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/user" replace />
    );
  }

  return children;
}
