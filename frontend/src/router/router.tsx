import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./publicRoute";
import Membership from "../pages/admin/Membership/Membership";
import Programs from "../pages/admin/Programs/Programs";
import Clients from "../pages/admin/Clients/Clients";
import Plans from "../pages/admin/Plans/Plans";
import AddPlan from "../pages/admin/Plans/AddPlan";
import EditPlan from "../pages/admin/Plans/EditPlan";
import AddProgram from "../pages/admin/Programs/AddProgram";
import EditProgram from "../pages/admin/Programs/EditProgram";
import EditClient from "../pages/admin/Clients/EditClient";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      { path: "membership", element: <Membership /> },
      { path: "plans", element: <Plans /> },
      { path: "plans/add", element: <AddPlan /> },
      { path: "plans/edit/:id", element: <EditPlan /> },
      { path: "programs", element: <Programs /> },
      { path: "programs/add", element: <AddProgram /> },
      { path: "programs/edit/:id", element: <EditProgram /> },
      { path: "clients", element: <Clients /> },
      { path: "clients/edit/:id", element: <EditClient /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute requiredRole="user">
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
    ],
  },
]);

export default router;
