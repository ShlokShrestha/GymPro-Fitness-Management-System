import { useEffect, useState } from "react";
import API from "../../../api/axios";
import "../../admin/Membership/membership.css";

const AddUserMembership = () => {
  const [form, setForm] = useState({
    planId: "",
    programIds: [] as string[],
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

    const payload = {
      planId: form.planId,
      programIds: form.programIds,
    };

    try {
      await API.post("/membership/", payload);
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

  return (
    <div className="form-container">
      <h2>User Membership</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddUserMembership;
