import { useNavigate } from "react-router";
import "./sidebar.css";
import { adminRoutes, userRoutes } from "../../config/sidebarRoutes";

const Sidebar = ({ role }: any) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const routes = role === "admin" ? adminRoutes : userRoutes;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Smart Fitness Pro</h2>
      </div>

      <ul className="sidebar-menu">
        {routes.map((route, index) => (
          <li key={index} onClick={() => navigate(route.path)}>
            {route.icon} {route.label}
          </li>
        ))}

        <li className="logout" onClick={logout}>
          🚪 Logout
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
