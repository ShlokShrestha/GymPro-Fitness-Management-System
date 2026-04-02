import { useEffect, useState } from "react";
import API from "../../../api/axios";
import "./UserAttendance.css";

const UserAttendance = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/attendance/me");
      setAttendance(data.data);
      const active = data.data.find((item: any) => !item.checkOut);
      setActiveSession(active || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async () => {
    try {
      await API.post("/attendance/check-in/");
      fetchAttendance();
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const checkOut = async () => {
    try {
      await API.post("/attendance/check-out");
      fetchAttendance();
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  if (loading) {
    return <div>Loading User Attendance...</div>;
  }
  return (
    <div className="attendance-container">
      <h2>Gym Attendance</h2>

      <div className="action-card">
        {!activeSession ? (
          <button className="checkin-btn" onClick={checkIn}>
            🟢 Check In
          </button>
        ) : (
          <button className="checkout-btn" onClick={checkOut}>
            🔴 Check Out
          </button>
        )}

        {activeSession && (
          <p className="active-text">
            You are currently checked in since:{" "}
            {new Date(activeSession.checkIn).toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="history">
        <h3>Attendance History</h3>

        {attendance.map((item) => (
          <div key={item.id} className="history-card">
            <div>
              <p>
                <strong>Check In:</strong>{" "}
                {new Date(item.checkIn).toLocaleString()}
              </p>
              <p>
                <strong>Check Out:</strong>{" "}
                {item.checkOut
                  ? new Date(item.checkOut).toLocaleString()
                  : "Still Active"}
              </p>
            </div>

            <span className={`status ${item.checkOut ? "done" : "active"}`}>
              {item.checkOut ? "Completed" : "Active"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAttendance;
