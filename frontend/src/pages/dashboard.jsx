import { useEffect, useState } from "react";
import api from "../services/api";
import { Building2, CalendarCheck, Users, Wallet } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    todayAttendance: 0,
    totalSalary: 0,
  });
  const [departmentStats, setDepartmentStats] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setStats(response.data.data);
        setDepartmentStats(response.data.data.departmentStats);
        setAttendanceStats(response.data.data.attendanceStats);
      } catch (error) {
        console.error(error);
        setLoadError(
          "Dashboard data is unavailable. Check that the API and database are running.",
        );
      }
    };

    getDashboard();
  }, []);

  const attendanceChartData = attendanceStats
    .map((entry) => ({ ...entry, total: Number(entry.total) || 0 }))
    .filter((entry) => entry.total > 0);
  const totalAttendance = attendanceChartData.reduce(
    (total, entry) => total + entry.total,
    0,
  );
  const attendanceColors = {
    Present: "#16a34a",
    Absent: "#ef4444",
    Leave: "#f59e0b",
    "Half Day": "#2563eb",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Overview of your employee management system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            color: "bg-blue-100 text-blue-600",
            icon: Users,
          },
          {
            title: "Total Departments",
            value: stats.totalDepartments,
            color: "bg-purple-100 text-purple-600",
            icon: Building2,
          },
          {
            title: "Today's Attendance",
            value: stats.todayAttendance,
            color: "bg-green-100 text-green-600",
            icon: CalendarCheck,
          },
          {
            title: "Total Salary",
            value: `₹${Number(stats.totalSalary).toLocaleString("en-IN")}`,
            color: "bg-orange-100 text-orange-600",
            icon: Wallet,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`mb-4 inline-flex rounded-xl p-3 ${item.color}`}>
              <item.icon size={21} />
            </div>

            <p className="text-sm text-gray-500">{item.title}</p>

            <h2 className="mt-2 text-2xl font-bold text-gray-800">
              {item.value}
            </h2>
          </div>
        ))}
      </div>
      {loadError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      )}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department-wise Employees */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Employees by Department
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentStats}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="department_name" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="total_employees" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Attendance Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                All recorded attendance by status
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {totalAttendance} records
            </span>
          </div>

          {totalAttendance > 0 ? (
            <div className="grid min-h-[260px] grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={attendanceChartData}
                    dataKey="total"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {attendanceChartData.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={attendanceColors[entry.status] || "#64748b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} records`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                {attendanceChartData.map((entry) => (
                  <div
                    key={entry.status}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            attendanceColors[entry.status] || "#64748b",
                        }}
                      />
                      <span className="truncate text-slate-600">
                        {entry.status}
                      </span>
                    </div>
                    <span className="shrink-0 font-semibold text-slate-800">
                      {entry.total}{" "}
                      <span className="font-normal text-slate-500">
                        ({Math.round((entry.total / totalAttendance) * 100)}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
              <CalendarCheck className="mb-3 text-slate-400" size={32} />
              <p className="text-sm font-medium text-slate-700">
                No attendance records yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Attendance data will appear here once records are added.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
