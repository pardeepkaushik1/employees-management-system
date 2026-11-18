const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const [employees, departments, attendance, salaries, departmentStats, attendanceStats] =
      await Promise.all([
        pool.query("SELECT COUNT(*) FROM employees"),
        pool.query("SELECT COUNT(*) FROM departments"),
        pool.query(
          "SELECT COUNT(*) FROM attendance WHERE attendance_date = CURRENT_DATE",
        ),
        pool.query("SELECT COALESCE(SUM(amount), 0) FROM salaries"),
        pool.query(`
  SELECT
    departments.department_name,
    COUNT(employees.id) AS total_employees
  FROM departments
  LEFT JOIN employees
  ON departments.id = employees.department_id
  GROUP BY departments.id, departments.department_name
  ORDER BY departments.id
`),
        pool.query(`
  SELECT
    status,
    COUNT(*) AS total
  FROM attendance
  GROUP BY status
`),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees: Number(employees.rows[0].count),
        totalDepartments: Number(departments.rows[0].count),
        todayAttendance: Number(attendance.rows[0].count),
        totalSalary: Number(salaries.rows[0].coalesce),
        departmentStats: departmentStats.rows,
        attendanceStats: attendanceStats.rows,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
