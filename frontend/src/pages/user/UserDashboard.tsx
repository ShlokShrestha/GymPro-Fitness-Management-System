import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    API.get("/user/profile").then((res) => setProfile(res.data));
  }, []);

  return (
    <div className="dashboard">
      <main className="main-content">
        <h2>Welcome {profile?.data?.fullName}</h2>
        <div className="card">Plan: {profile?.data?.plan}</div>
        <div className="card">Expiry: {profile?.data?.expiry}</div>
      </main>
    </div>
  );
}
