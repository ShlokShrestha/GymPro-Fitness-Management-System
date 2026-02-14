import { useLocation, useNavigate } from "react-router";
import "./sidebar.css";
import { adminRoutes, userRoutes } from "../../config/sidebarRoutes";

const Sidebar = ({ role }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const routes = role === "admin" ? adminRoutes : userRoutes;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getActiveRoute = () => {
    let activeRoute = null;
    let maxLength = 0;
    routes.forEach((route) => {
      if (
        location.pathname.startsWith(route.path) &&
        route.path.length > maxLength
      ) {
        activeRoute = route.path;
        maxLength = route.path.length;
      }
    });
    return activeRoute;
  };

  const activePath = getActiveRoute();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Smart Fitness Pro</h2>
      </div>

      <ul className="sidebar-menu">
        {routes.map((route, index) => (
          <li
            key={index}
            onClick={() => navigate(route.path)}
            className={activePath === route.path ? "active" : ""}
          >
            {route.icon} {route.label}
          </li>
        ))}
      </ul>
      <div className="logout" onClick={logout}>
        🚪 Logout
      </div>
    </aside>
  );
};

export default Sidebar;
