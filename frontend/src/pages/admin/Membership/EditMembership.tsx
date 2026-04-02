import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../../../api/axios";
import "./membership.css";

const EditMembership = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  const [mode, setMode] = useState<"EDIT" | "RENEW">("EDIT");

  const [form, setForm] = useState({
    planId: "",
    programIds: [] as string[],
    status: "",
    startDate: "",
    endDate: "",
    extraDays: 0,
    priceOverride: "",
    paymentMethod: "CASH",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipRes, planRes, programRes] = await Promise.all([
          API.get(`/membership/${id}`),
          API.get("/plan/"),
          API.get("/program/"),
        ]);

        const m = membershipRes.data.data;

        setPlans(planRes.data.data);
        setPrograms(programRes.data.data);

        // 🧠 detect mode automatically
        if (m.status === "EXPIRED") {
          setMode("RENEW");
        }

        setForm({
          planId: m.planId,
          programIds: m.membershipPrograms.map((p: any) => p.programId),
          status: m.status,
          startDate: m.startDate?.split("T")[0] || "",
          endDate: m.endDate?.split("T")[0] || "",
          extraDays: 0,
          priceOverride: "",
          paymentMethod: "CASH",
        });

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  const toggleProgram = (pid: string) => {
    setForm((prev) => ({
      ...prev,
      programIds: prev.programIds.includes(pid)
        ? prev.programIds.filter((p) => p !== pid)
        : [...prev.programIds, pid],
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (mode === "RENEW") {
        await API.post(`/membership/${id}/renew`, {
          paymentMethod: form.paymentMethod,
          planId: form.planId,
          programIds: form.programIds,
        });

        navigate("/admin/membership/");
        return;
      }

      const payload = {
        planId: form.planId,
        programIds: form.programIds,
        status: form.status,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        extraDays: form.extraDays || undefined,
        priceOverride: form.priceOverride
          ? Number(form.priceOverride)
          : undefined,
        paymentMethod: form.paymentMethod,
      };

      await API.patch(`/membership/${id}`, payload);

      navigate("/admin/membership/");
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2>{mode === "RENEW" ? "Renew Membership 🔥" : "Edit Membership"}</h2>

      {mode === "RENEW" && (
        <p style={{ color: "orange" }}>
          This membership is expired. Renew will start a new cycle.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          disabled={mode === "RENEW"}
        >
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="EXPIRED">Expired</option>
        </select>

        <select
          value={form.planId}
          onChange={(e) => setForm({ ...form, planId: e.target.value })}
        >
          <option value="">Select Plan</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {p.discount}% - {p.durationInDays} days
            </option>
          ))}
        </select>

        <div className="program-list">
          <label className="title">Programs:</label>
          {programs.map((p) => (
            <div key={p.id}>
              <input
                type="checkbox"
                checked={form.programIds.includes(p.id)}
                onChange={() => toggleProgram(p.id)}
              />
              <label>
                {p.name} (Rs{p.price})
              </label>
            </div>
          ))}
        </div>

        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          disabled={mode === "RENEW"} // 🔒 optional
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          disabled={mode === "RENEW"}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "14px" }}>Extra Days</label>
          <input
            type="number"
            placeholder="Extra Days"
            value={form.extraDays}
            onChange={(e) =>
              setForm({ ...form, extraDays: Number(e.target.value) })
            }
            disabled={mode === "RENEW"}
          />
        </div>
        <input
          type="number"
          placeholder="Override Price"
          value={form.priceOverride}
          onChange={(e) => setForm({ ...form, priceOverride: e.target.value })}
          disabled={mode === "RENEW"}
        />

        <select
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="KHALTI">Khalti</option>
          <option value="ESEWA">eSewa</option>
        </select>

        <button type="submit">
          {mode === "RENEW" ? "Renew Membership 🔥" : "Update Membership"}
        </button>
      </form>
    </div>
  );
};

export default EditMembership;
