import { useState } from "react";
import { useNavigate } from "react-router";
import API from "../../../api/axios";

const AddProgram = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await API.post("/program", form);
      navigate("/admin/programs");
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <h2>Add Programs</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Program name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="price"
          type="number"
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddProgram;
