import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DataTable from "../../../components/resuable/DataTable";
import API from "../../../api/axios";

const Clients = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClients();
  }, [page, pageSize, search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/user", {
        params: {
          page,
          limit: pageSize,
          search,
        },
      });
      setClients(data.data);
      setTotalItems(data.pagination.totalRecords);
      setTotalPages(Math.ceil(data.pagination.totalRecords / pageSize));
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/user/${id}`);
      fetchClients();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columns = [
    { header: "Full Name", accessor: "fullName", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
  ];

  return (
    <>
      <div className="header">
        <h2>Membership Clients</h2>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/clients/add")}
        >
          + Add Client
        </button>
      </div>
      <DataTable
        columns={columns}
        data={clients}
        loading={loading}
        searchable
        pagination={{
          currentPage: page,
          totalPages,
          totalItems,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(0);
          },
        }}
        onSearch={(value) => {
          setSearch(value);
          setPage(0);
        }}
        onEdit={(plan) => navigate(`/admin/clients/edit/${plan.id}`)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Clients;
