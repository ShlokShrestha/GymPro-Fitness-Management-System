import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./dashboard.css";

export default function UserDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    API.get("/user/profile").then((res) => setProfile(res.data));
  }, []);
  const user = profile?.data;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏋️ Gym Dashboard</h1>
        <p>Welcome back, {user?.fullName}</p>
      </div>
      <div className="dashboard-grid">
        <div className="card primary">
          <h3>Profile</h3>
          <p>{user?.email}</p>
          <p>{user?.phoneNumber}</p>
        </div>

        <div className="card">
          <h3>Membership Plan</h3>
          <p>{user?.memberships?.[0]?.plan?.name || "No Plan"}</p>
          <span className="badge">{user?.memberships?.[0]?.status}</span>
        </div>

        <div className="card">
          <h3>Validity</h3>
          <p>Start: {user?.memberships?.[0]?.startDate?.split("T")[0]}</p>
          <p>End: {user?.memberships?.[0]?.endDate?.split("T")[0]}</p>
        </div>

        <div className="card">
          <h3>Fitness Goal</h3>
          <p>{user?.fitnessGoals?.[0]?.goalType}</p>
          <p>
            {user?.fitnessGoals?.[0]?.startWeight}kg →{" "}
            {user?.fitnessGoals?.[0]?.targetWeight}kg
          </p>
        </div>
      </div>
    </div>
  );
}
