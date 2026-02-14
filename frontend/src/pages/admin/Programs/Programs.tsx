import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DataTable from "../../../components/resuable/DataTable";
import API from "../../../api/axios";

interface Program {
  id: string;
  name: string;
  price: number;
}

const Programs = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    const res = await API.get("/program/");
    setPrograms(res.data.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id: string) => {
    await API.delete(`/program/${id}/`);
    fetchPrograms();
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Price", accessor: "price" },
  ];

  return (
    <>
      <div className="header">
        <h2>Membership Programs</h2>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/programs/add")}
        >
          + Add Programs
        </button>
      </div>

      <DataTable
        columns={columns}
        data={programs}
        loading={loading}
        onEdit={(data) => navigate(`/admin/programs/edit/${data.id}`)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Programs;
