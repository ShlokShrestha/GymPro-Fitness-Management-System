import { Outlet } from "react-router";
import Sidebar from "../components/sidebar/Sidebar";
import "./DashboardLayout.css";

export default function UserLayout() {
  return (
    <div className="dashboard">
      <Sidebar role={"user"} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
