import { useState } from "react";
import { useNavigate } from "react-router";
import "./Plans.css";
import API from "../../../api/axios";

const AddPlan = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    name: "",
    discount: "",
    durationInDays: "",
    description: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await API.post("/plan", form);
    navigate("/admin/plans");
  };

  return (
    <div className="form-container">
      <h2>Add Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Plan Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Discount %"
          type="number"
          onChange={(e) =>
            setForm({ ...form, discount: Number(e.target.value) })
          }
        />
        <input
          placeholder="Duration"
          onChange={(e) =>
            setForm({ ...form, durationInDays: Number(e.target.value) })
          }
        />
        <textarea
          placeholder="Description"
          rows={5}
          cols={5}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddPlan;
