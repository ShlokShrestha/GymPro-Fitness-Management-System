import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    API.get("/user/profile").then((res) => setProfile(res.data));
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">User Panel</aside>
      <main className="main-content">
        <h2>Welcome {profile.name}</h2>
        <div className="card">Plan: {profile.plan}</div>
        <div className="card">Expiry: {profile.expiry}</div>
      </main>
    </div>
  );
}
