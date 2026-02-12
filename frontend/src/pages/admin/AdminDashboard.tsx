import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    API.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">Admin Panel</aside>
      <main className="main-content">
        <h2>Admin Dashboard</h2>
        <div className="cards">
          <div className="card">Members: {stats.members}</div>
          <div className="card">Revenue: {stats.revenue}</div>
          <div className="card">Trainers: {stats.trainers}</div>
        </div>
      </main>
    </div>
  );
}
