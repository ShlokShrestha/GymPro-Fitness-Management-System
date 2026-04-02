import { useEffect, useState } from "react";
import "./AdminProfile.css";
import API from "../../../api/axios";

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    email: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await API.get("/user/profile");
      const data = res.data.data;

      setUser(data);
      setForm({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || "",
        email: data.email || "",
      });
    } catch (err) {
      console.log("Profile error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await API.put("/user/updateProfile", form);
      fetchProfile();
      setEditMode(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!user) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.fullName?.charAt(0).toUpperCase()}
        </div>

        {!editMode ? (
          <>
            <h2>{user.fullName}</h2>
            <p className="email">{user.email}</p>

            <div className="info">
              <p>
                <strong>Phone:</strong> {user.phoneNumber}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender || "-"}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <h2>Edit Profile</h2>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />{" "}
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <div className="btn-group">
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
