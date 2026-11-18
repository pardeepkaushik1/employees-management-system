import { useEffect, useState } from "react";
import api from "../services/api";

function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: "",
    amount: "",
    salary_month: "",
    payment_date: "",
    payment_status: "Pending",
  });
  useEffect(() => {
    const getSalaries = async () => {
      try {
        const response = await api.get("/salary");
        setSalaries(response.data.data);
      } catch (error) {
        console.error(error);
        setLoadError(
          "Salary data is unavailable. Check that the API and database are running.",
        );
      }
    };

    getSalaries();
  }, []);
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await api.get("/employee");
        setEmployees(response.data.data);
      } catch (error) {
        console.error(error);
        setLoadError(
          "Employee data is unavailable. Check that the API and database are running.",
        );
      }
    };

    getEmployees();
  }, []);

  // handel submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const salaryData = {
        ...formData,
        employee_id: Number(formData.employee_id),
        amount: Number(formData.amount),
        payment_date: formData.payment_date || null,
      };
      if (editingId) {
        await api.put(`/salary/${editingId}`, salaryData);
      } else {
        await api.post("/salary", salaryData);
      }

      const response = await api.get("/salary");
      setSalaries(response.data.data);

      setFormData({
        employee_id: "",
        amount: "",
        salary_month: "",
        payment_date: "",
        payment_status: "Pending",
      });

      setEditingId(null);
      setShowForm(false);

      alert(editingId ? "Salary updated successfully!" : "Salary added successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add salary");
    }
  };

  // delete salaries
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this salary record?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/salary/${id}`);

      setSalaries((prev) => prev.filter((salary) => salary.id !== id));

      alert("Salary deleted successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete salary");
    }
  };

  // edit button
  const handleEdit = (salary) => {
    setEditingId(salary.id);

    setFormData({
      employee_id: String(salary.employee_id),
      amount: String(salary.amount),
      salary_month: salary.salary_month?.slice(0, 10),
      payment_date: salary.payment_date?.slice(0, 10) || "",
      payment_status: salary.payment_status,
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      employee_id: "",
      amount: "",
      salary_month: "",
      payment_date: "",
      payment_status: "Pending",
    });
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Salaries</h1>
        <p className="text-sm text-gray-500">Manage employee salary records.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              All Salaries
            </h2>
            <p className="text-sm text-gray-500">
              Total Records: {salaries.length}
            </p>
          </div>
          {loadError && (
            <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {loadError}
            </p>
          )}

          <button
            onClick={() => {
              handleCancel();
              setShowForm(true);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Add Salary
          </button>
        </div>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              {editingId ? "Edit Salary" : "Add New Salary"}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <select
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                required
                className="rounded-lg border p-3"
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Salary Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                className="rounded-lg border p-3"
              />

              <input
                type="date"
                value={formData.salary_month}
                onChange={(e) =>
                  setFormData({ ...formData, salary_month: e.target.value })
                }
                required
                className="rounded-lg border p-3"
              />

              <input
                type="date"
                value={formData.payment_date}
                onChange={(e) =>
                  setFormData({ ...formData, payment_date: e.target.value })
                }
                className="rounded-lg border p-3"
              />

              <select
                value={formData.payment_status}
                onChange={(e) =>
                  setFormData({ ...formData, payment_status: e.target.value })
                }
                className="rounded-lg border p-3"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                {editingId ? "Update Salary" : "Save Salary"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Employee</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Salary Month</th>
                <th className="p-3">Payment Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {salaries.map((salary) => (
                <tr key={salary.id} className="border-t">
                  <td className="p-3">{salary.id}</td>
                  <td className="p-3">{salary.name}</td>
                  <td className="p-3">
                    ₹{Number(salary.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">{salary.salary_month}</td>
                  <td className="p-3">{salary.payment_date || "-"}</td>
                  <td className="p-3">{salary.payment_status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(salary)}
                      className="mr-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(salary.id)}
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
    </div>
  );
}

export default Salaries;
