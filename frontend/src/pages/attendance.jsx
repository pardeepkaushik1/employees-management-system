import { useEffect, useState } from "react";
import api from "../services/api";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: "",
    check_in: "",
    check_out: "",
    status: "Present",
  });
  useEffect(() => {
    const getAttendance = async () => {
      try {
        const response = await api.get("/attendance");
        setAttendance(response.data.data);
      } catch (error) {
        console.error(error);
        setLoadError(
          "Attendance data is unavailable. Check that the API and database are running.",
        );
      }
    };

    getAttendance();
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

  // submit handel
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const attendanceData = {
        ...formData,
        employee_id: Number(formData.employee_id),
        check_in:
          formData.status === "Absent" || formData.status === "Leave"
            ? null
            : formData.check_in || null,
        check_out:
          formData.status === "Absent" || formData.status === "Leave"
            ? null
            : formData.check_out || null,
      };

      if (editingId) {
        await api.put(`/attendance/${editingId}`, attendanceData);
      } else {
        await api.post("/attendance", attendanceData);
      }
      const response = await api.get("/attendance");
      setAttendance(response.data.data);

      setEditingId(null);
      setFormData({
        employee_id: "",
        attendance_date: "",
        check_in: "",
        check_out: "",
        status: "Present",
      });

      setShowForm(false);

      alert(editingId ? "Attendance updated successfully!" : "Attendance added successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add attendance");
    }
  };

  // delet attendance
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/attendance/${id}`);

      setAttendance((prev) => prev.filter((record) => record.id !== id));

      alert("Attendance deleted successfully!");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete attendance");
    }
  };

  // edit button
  const handleEdit = (record) => {
    setEditingId(record.id);

    setFormData({
      employee_id: String(record.employee_id),
      attendance_date: record.attendance_date?.slice(0, 10),
      check_in: record.check_in || "",
      check_out: record.check_out || "",
      status: record.status,
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      employee_id: "",
      attendance_date: "",
      check_in: "",
      check_out: "",
      status: "Present",
    });
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        <p className="text-sm text-gray-500">
          Manage employee attendance records.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          All Attendance
        </h2>
        <button
          onClick={() => {
            handleCancel();
            setShowForm(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Attendance
        </button>

        <p className="text-sm text-gray-500">
          Total Records: {attendance.length}
        </p>
      </div>
      {loadError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loadError}
        </p>
      )}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {editingId ? "Edit Attendance" : "Add Attendance"}
          </h2>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Employee
            </label>

            <select
              value={formData.employee_id}
              onChange={(e) =>
                setFormData({ ...formData, employee_id: e.target.value })
              }
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
            >
              <option value="">Select Employee</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Attendance Date
            </label>

            <input
              type="date"
              value={formData.attendance_date}
              onChange={(e) =>
                setFormData({ ...formData, attendance_date: e.target.value })
              }
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
            />
          </div>
          {formData.status !== "Absent" && formData.status !== "Leave" && (
            <>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check In
                </label>

                <input
                  type="time"
                  value={formData.check_in}
                  onChange={(e) =>
                    setFormData({ ...formData, check_in: e.target.value })
                  }
                  required={formData.status === "Present"}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check Out
                </label>

                <input
                  type="time"
                  value={formData.check_out}
                  onChange={(e) =>
                    setFormData({ ...formData, check_out: e.target.value })
                  }
                  required={formData.status === "Present"}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) => {
                const status = e.target.value;
                setFormData({
                  ...formData,
                  status,
                  ...(status === "Absent" || status === "Leave"
                    ? { check_in: "", check_out: "" }
                    : {}),
                });
              }}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
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
              {editingId ? "Update Attendance" : "Save Attendance"}
            </button>
          </div>
        </form>
      )}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Employee_Name</th>
              <th className="p-3">Date</th>
              <th className="p-3">Check In</th>
              <th className="p-3">Check Out</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="p-3">{record.id}</td>
                <td className="p-3">{record.name}</td>
                <td className="p-3">{record.attendance_date}</td>
                <td className="p-3">{record.check_in || "-"}</td>
                <td className="p-3">{record.check_out || "-"}</td>
                <td className="p-3">{record.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(record)}
                    className="mr-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
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

export default Attendance;
