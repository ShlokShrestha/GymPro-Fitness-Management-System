import { Outlet } from "react-router";
import Sidebar from "../components/sidebar/Sidebar";
import "./DashboardLayout.css";

export default function AdminLayout() {
  return (
    <div className="dashboard">
      <Sidebar role={"admin"} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
