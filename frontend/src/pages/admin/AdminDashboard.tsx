import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data.stats);
      setRecentUsers(res.data.recentUsers);
      setRecentPayments(res.data.recentPayments);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Active Memberships</div>
          <div className="stat-value">{stats.activeMemberships}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">Rs {stats.totalRevenue.toFixed(2)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Pending Payments</div>
          <div className="stat-value">{stats.pendingPayments}</div>
        </div>
      </div>

      <div className="content-grid">
        {/* USERS */}
        <div className="panel">
          <h2>Recent Users</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {recentUsers.map((user: any) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAYMENTS */}
        <div className="panel">
          <h2>Recent Payments</h2>

          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentPayments.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.user?.fullName}</td>
                  <td>Rs {p.amount}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === "SUCCESS"
                          ? "success"
                          : p.status === "PENDING"
                            ? "pending"
                            : "failed"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
