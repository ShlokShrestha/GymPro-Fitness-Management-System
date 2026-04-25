import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../../../api/axios";
import "./membership.css";

const AddMembership = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    planId: "",
    programIds: [] as string[],
    paymentMethod: "CASH",
  });

  const [plans, setPlans] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [plan, program] = await Promise.all([
        API.get("/plan/"),
        API.get("/program/"),
      ]);
      setPlans(plan.data.data);
      setPrograms(program.data.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
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
    } finally {
      setLoading(false);
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

  return (
    <div className="form-container">
      <h2>Add Membership</h2>

      <form onSubmit={handleSubmit}>
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
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />
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
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default AddMembership;
