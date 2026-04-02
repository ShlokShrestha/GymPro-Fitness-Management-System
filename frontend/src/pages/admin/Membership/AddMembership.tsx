import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../../../api/axios";
import ComboBox from "../../../components/resuable/ComboBox/ComboBox";
import "./membership.css";

const AddMembership = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    planId: "",
    programIds: [] as string[],
    paymentMethod: "CASH",
  });

  const [useExistingUser, setUseExistingUser] = useState(true);

  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [user, plan, program] = await Promise.all([
        API.get("/user/"),
        API.get("/plan/"),
        API.get("/program/"),
      ]);
      setUsers(user.data.data);
      setPlans(plan.data.data);
      setPrograms(program.data.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = useExistingUser
      ? {
          userId: form.userId,
          planId: form.planId,
          programIds: form.programIds,
          paymentMethod: form.paymentMethod,
        }
      : {
          fullName: form.fullName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          planId: form.planId,
          programIds: form.programIds,
          paymentMethod: form.paymentMethod,
        };

    try {
      await API.post("/membership/user-membership/", payload);
      navigate("/admin/membership/");
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const toggleProgram = (id: string) => {
    setForm((prev) => ({
      ...prev,
      programIds: prev.programIds.includes(id)
        ? prev.programIds.filter((p) => p !== id)
        : [...prev.programIds, id],
    }));
  };
  const userOptions = users.map((u) => ({
    label: `${u.fullName} (${u.email})`,
    value: u.id,
  }));
  return (
    <div className="form-container">
      <h2>Add Membership</h2>

      <form onSubmit={handleSubmit}>
        <div className="user-type-toggle">
          <label>
            <input
              type="radio"
              checked={useExistingUser}
              onChange={() => setUseExistingUser(true)}
            />
            Existing User
          </label>

          <label>
            <input
              type="radio"
              checked={!useExistingUser}
              onChange={() => setUseExistingUser(false)}
            />
            New User
          </label>
        </div>
        {useExistingUser ? (
          <ComboBox
            options={userOptions}
            value={form.userId}
            onChange={(val) => setForm({ ...form, userId: val })}
            placeholder="Select User"
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="phoneNumber"
              placeholder="PhoneNumber"
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />
          </>
        )}

        {/* PLAN */}
        <select onChange={(e) => setForm({ ...form, planId: e.target.value })}>
          <option value="">Select Plan</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.discount}% - {p.durationInDays} days
            </option>
          ))}
        </select>
        <div className="program-list">
          <label className="title">Select Programs:</label>
          {programs.map((p) => (
            <div key={p.id}>
              <input
                id={`program-${p.id}`}
                type="checkbox"
                checked={form.programIds.includes(p.id)}
                onChange={() => toggleProgram(p.id)}
              />
              <label htmlFor={`program-${p.id}`}>
                {p.name} (Rs{p.price})
              </label>
            </div>
          ))}
        </div>
        <select
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="KHALTI">Khalti</option>
          <option value="ESEWA">eSewa</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddMembership;
