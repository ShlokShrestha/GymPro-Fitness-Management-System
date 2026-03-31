import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DataTable from "../../../components/resuable/DataTable";
import API from "../../../api/axios";

const Membership = () => {
  const navigate = useNavigate();

  const [membership, setMembership] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembership();
  }, [page, pageSize, search]);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/membership", {
        params: {
          page,
          limit: pageSize,
          search,
        },
      });
      setMembership(data.data);
      setTotalItems(data.pagination.totalRecords);
      setTotalPages(Math.ceil(data.pagination.totalRecords / pageSize));
    } catch (error) {
      console.error("Error fetching membership:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/user/${id}`);
      fetchMembership();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columns = [
    {
      header: "Member Name",
      accessor: "user.fullName",
      sortable: true,
    },
    {
      header: "Email",
      accessor: "user.email",
      sortable: true,
    },
    {
      header: "Plan",
      accessor: "plan.name",
      sortable: true,
    },
    {
      header: "Price",
      accessor: "price",
      sortable: true,
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
    },
    {
      header: "Start Date",
      accessor: "startDate",
    },
    {
      header: "End Date",
      accessor: "endDate",
    },
  ];
  return (
    <>
      <div className="header">
        <h2>Membership Membership</h2>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/membership/add/")}
        >
          + Add Membership
        </button>
      </div>
      <DataTable
        columns={columns}
        data={membership}
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
        onEdit={(plan) => navigate(`/admin/membership/edit/${plan.id}`)}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Membership;
