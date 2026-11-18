import { useEffect, useState } from "react";
import api from "../services/api";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await api.get("/department");
        setDepartments(response.data.data);
      } catch (error) {
        console.error(error);
        setLoadError(
          "Department data is unavailable. Check that the API and database are running.",
        );
      }
    };

    getDepartments();
  }, []);

  // submit handel
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/department/${editingId}`, {
          department_name: departmentName,
        });
      } else {
        await api.post("/department", {
          department_name: departmentName,
        });
      }

      const response = await api.get("/department");
      setDepartments(response.data.data);

      setDepartmentName("");
      setShowForm(false);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add department");
    }
  };

  // delete department
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/department/${id}`);

      setDepartments((prev) =>
        prev.filter((department) => department.id !== id),
      );

      alert("Department deleted successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete department");
    }
  };

  // edit department
  const handleEdit = (department) => {
    setEditingId(department.id);
    setDepartmentName(department.department_name);
    setShowForm(true);
  };

  // cancel button
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setDepartmentName("");
  };
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Departments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage all departments in your organization.
        </p>
      </div>

      <div className="mb-4 text-sm font-medium text-gray-600">
        Total Departments: {departments.length}
      </div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">All Departments</h2>

        <button
          onClick={() => {
            handleCancel();
            setShowForm(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Department
        </button>
      </div>
      {loadError && (
        <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loadError}
        </p>
      )}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {editingId ? "Edit Department" : "Add New Department"}
          </h2>

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Department Name
          </label>

          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Enter department name"
            required
            className="mb-5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {editingId ? "Update Department" : "Save Department"}
            </button>
          </div>
        </form>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                Department Name
              </th>
              <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {departments.map((department) => (
              <tr
                key={department.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="border-b px-4 py-3 text-sm text-gray-600">
                  {department.id}
                </td>
                <td className="border-b px-4 py-3 text-sm text-gray-600">
                  {department.department_name}
                </td>
                <td className="border-b px-4 py-3 text-sm text-gray-600">
                  {new Date(department.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="border-b px-4 py-3">
                  <button
                    onClick={() => handleEdit(department)}
                    className="mr-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(department.id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Departments;
