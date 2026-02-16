import React, { useState } from "react";
import "./datatable.css";

interface Column {
  header: string;
  accessor: string;
  sortable?: boolean;
}

interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  pagination?: PaginationConfig;
  searchable?: boolean;
  onSearch?: (value: string) => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
}

const DataTable: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  pagination,
  searchable = false,
  onSearch,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState("");

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) onDelete?.(id);
  };

  const showActions = onEdit || onDelete;

  return (
    <div className="table-wrapper">
      {/* Top Controls */}
      {(searchable || pagination?.onPageSizeChange) && (
        <div className="table-controls">
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch?.(e.target.value);
              }}
            />
          )}

          {pagination?.onPageSizeChange && (
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                pagination.onPageSizeChange?.(Number(e.target.value))
              }
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          )}
        </div>
      )}

      {/* Table */}
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            {showActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={showActions ? columns.length + 1 : columns.length}
                className="no-data"
              >
                Loading...
              </td>
            </tr>
          ) : data?.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? columns.length + 1 : columns.length}
                className="no-data"
              >
                No data available
              </td>
            </tr>
          ) : (
            data?.map((row, index) => (
              <tr key={index}>
                {columns.map((col, i) => (
                  <td key={i}>{row[col.accessor]}</td>
                ))}

                {showActions && (
                  <td>
                    {onEdit && (
                      <button className="edit-btn" onClick={() => onEdit(row)}>
                        Edit
                      </button>
                    )}

                    {onDelete && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
          >
            Prev
          </button>

          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
            {pagination.totalItems && ` | ${pagination.totalItems} items`}
          </span>

          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
