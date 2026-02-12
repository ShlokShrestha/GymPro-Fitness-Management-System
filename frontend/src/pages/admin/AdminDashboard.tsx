import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});

  return (
    <div className="dashboard">
      <div className="card">Members: {stats.members}</div>
      <div className="card">Revenue: {stats.revenue}</div>
      <div className="card">Trainers: {stats.trainers}</div>
    </div>
  );
}
