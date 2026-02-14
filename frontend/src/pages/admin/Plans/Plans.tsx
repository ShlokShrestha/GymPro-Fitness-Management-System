import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Plans.css";
import DataTable from "../../../components/resuable/DataTable";
import API from "../../../api/axios";

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
}

const Plans = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    const res = await API.get("/plan/");
    setPlans(res.data.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id: string) => {
    await API.delete(`/plan/${id}/`);
    fetchPlans();
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Discount%", accessor: "discount" },
    { header: "Duration", accessor: "durationInDays" },
  ];

  return (
    <div className="plans-container">
      <div className="plans-header">
        <h2>Membership Plans</h2>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/plans/add")}
        >
          + Add Plan
        </button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        loading={loading}
        onEdit={(id) => navigate(`/admin/plans/edit/${id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Plans;
