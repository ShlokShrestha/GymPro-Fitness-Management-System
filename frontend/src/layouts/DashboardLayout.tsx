import { Outlet, useNavigate } from "react-router";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Gym Panel</h3>
        <ul>
          <li onClick={() => navigate("admin")}>Admin</li>
          <li onClick={() => navigate("user")}>User</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
