import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import API from "../../../api/axios";
import ComboBox from "../../../components/resuable/ComboBox/ComboBox";
import "./membership.css";

const AddMembership = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    planId: "",
    programIds: [] as string[],
  });

  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      const [u, p, pr] = await Promise.all([
        API.get("/user/"),
        API.get("/plan/"),
        API.get("/program/"),
      ]);
      console.log(u, p, pr);
      setUsers(u.data.data);
      setPlans(p.data.data);
      setPrograms(pr.data.data);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await API.post("/membership", form);
    navigate("/admin/memberships");
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
        <ComboBox
          options={userOptions}
          value={form.userId}
          onChange={(val) => setForm({ ...form, userId: val })}
          placeholder="Select User"
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
        {/* PROGRAM MULTI SELECT */}
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
                {p.name} (${p.price})
              </label>
            </div>
          ))}
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddMembership;
