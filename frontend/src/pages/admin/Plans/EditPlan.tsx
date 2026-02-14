import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./Plans.css";
import API from "../../../api/axios";

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    name: "",
    discount: "",
    durationInDays: "",
    description: "",
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await API.get(`/plan/${id}`);
        setForm(res.data.data);
      } catch (error) {
        console.error("Fetch plan failed", error);
      }
    };
    fetchPlan();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await API.put(`/plan/${id}`, form);
    navigate("/admin/plans");
  };

  return (
    <div className="form-container">
      <h2>Edit Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Plan name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Discount %"
          value={form.discount}
          onChange={(e) =>
            setForm({ ...form, discount: Number(e.target.value) })
          }
        />
        <input
          value={form.durationInDays}
          placeholder="Duration In Days"
          onChange={(e) =>
            setForm({ ...form, durationInDays: Number(e.target.value) })
          }
        />
        <textarea
          value={form.description}
          rows={5}
          cols={5}
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditPlan;
