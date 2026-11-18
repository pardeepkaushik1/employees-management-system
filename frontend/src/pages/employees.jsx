import { useEffect, useState } from "react";
import api from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    salary: "",
    department_id: "",
    joining_date: "",
  });
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await api.get("/employee");
        setEmployees(response.data.data);
        setLoading(false);

        console.log(response.data);
      } catch (error) {
        setLoading(false);
        console.error(error);
        setLoadError(
          "Employee data is unavailable. Check that the API and database are running.",
        );
      }
    };
    const getDepartments = async () => {
      try {
        const response = await api.get("/department");
        setDepartments(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDepartments();
    getEmployees();
  }, []);

  // search employee filter
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.department_name.toLowerCase().includes(search.toLowerCase()),
  );
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // save employee function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        department_id: Number(formData.department_id),
      };

      if (editingId) {
        await api.put(`/employee/${editingId}`, payload);
      } else {
        await api.post("/employee", payload);
      }

      const response = await api.get("/employee");
      setEmployees(response.data.data);

      setShowForm(false);
      setEditingId(null);

      alert(editingId ? "Employee updated successfully!" : "Employee added successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        salary: "",
        department_id: "",
        joining_date: "",
      });
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add employee");
    }
  };

  // delete employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/employee/${id}`);

      setEmployees((prev) => prev.filter((employee) => employee.id !== id));

      alert("Employee deleted successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete employee");
    }
  };

  // edit employee
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      address: employee.address || "",
      salary: employee.salary,
      department_id: employee.department_id,
      joining_date: employee.joining_date?.split("T")[0] || "",
    });

    setShowForm(true);
  };

  // empty form with cancel button
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      salary: "",
      department_id: "",
      joining_date: "",
    });
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employees</h1>
      <p className="mb-5 text-sm text-gray-500">
        Manage and view all employees in your organization.
      </p>
      </div>
      <div className="mb-4 text-sm font-medium text-gray-600">
        Showing {filteredEmployees.length} of {employees.length} Employees
      </div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
        >
          + Add Employee
        </button>
      </div>
      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between relative">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 sm:grid-cols-4"
            >
              <h2 className="text-base font-semibold text-slate-800 sm:col-span-4">
                {editingId ? "Edit Employee" : "Add New Employee"}
              </h2>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter employee name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  placeholder="Enter salary"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Department
                </label>

                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option value="">Select Department</option>

                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.department_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Employee" : "Save Employee"}
                </button>
              </div>
            </form>
            <button
              onClick={handleCancel}
              className="text-gray-500 absolute top-3 right-3  hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="py-6 text-center text-gray-500">Loading employees...</p>
      ) : loadError ? (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loadError}
        </p>
      ) : filteredEmployees.length === 0 ? (
        <p className="py-6 text-center text-gray-500">No employees found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                    Salary
                  </th>
                  <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="border-b px-4 py-3 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr
                    className="transition-colors cursor-pointer hover:bg-gray-50"
                    key={employee.id}
                  >
                    <td className="border-b px-4 py-3 text-sm text-gray-600">
                      {employee.id}
                    </td>
                    <td className="border-b px-4 py-3 text-sm text-gray-600">
                      {employee.name}
                    </td>
                    <td className="border-b px-4 py-3 text-sm text-gray-600">
                      {employee.email}
                    </td>
                    <td className="border-b px-4 py-3 text-sm text-gray-600">
                      ₹{Number(employee.salary).toLocaleString("en-IN")}
                    </td>
                    <td className="border-b px-4 py-3 text-sm text-gray-600">
                      {employee.department_name}
                    </td>
                    <td className="border-b px-4 py-3">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="mr-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
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
      )}
    </div>
  );
}

export default Employees;
