import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../../../api/axios";

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await API.get(`user/${id}`);
        setForm(res.data.data);
      } catch (error) {
        console.error("Fetch client failed", error);
      }
    };
    fetchClient();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await API.put(`/user/${id}`, form);
    navigate("/admin/user");
  };

  return (
    <div className="form-container">
      <h2>Edit client</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="client name"
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

export default EditClient;
