import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import API from "../../../api/axios";

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch client
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/user/${id}`);
        const user = res.data.data;

        setForm({
          fullName: user.fullName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
        });
      } catch (error) {
        console.error("Fetch client failed", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await API.put(`/user/${id}`, form);
      navigate("/admin/user");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h2>Edit Client</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Client Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditClient;
