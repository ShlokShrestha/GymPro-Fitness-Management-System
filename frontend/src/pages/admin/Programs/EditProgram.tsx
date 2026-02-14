import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../../../api/axios";

const EditProgram = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
  });

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await API.get(`program/${id}`);
        setForm(res.data.data);
      } catch (error) {
        console.error("Fetch program failed", error);
      }
    };
    fetchProgram();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await API.put(`/program/${id}`, form);
    navigate("/admin/programs");
  };

  return (
    <div className="form-container">
      <h2>Edit Program</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Program name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditProgram;
