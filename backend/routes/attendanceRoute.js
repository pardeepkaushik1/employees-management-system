const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const validate = require("../middleware/validate");
const attendanceSchema = require("../validators/attendanceValidator");

const normalizeAttendanceTimes = (status, checkIn, checkOut) => {
  if (status === "Absent" || status === "Leave") {
    return [null, null];
  }

  return [checkIn || null, checkOut || null];
};

// get all attendance records

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         attendance.id,
         attendance.employee_id,
         attendance.attendance_date,
         attendance.check_in,
         attendance.check_out,
         attendance.status,
         employees.name
       FROM attendance
       JOIN employees ON attendance.employee_id = employees.id
       ORDER BY attendance.attendance_date DESC, attendance.id DESC`,
    );
    res.status(200).json({
      success: true,
      message: "attendance records fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});

// get attendance record by id

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM attendance WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      const error = new Error("Employee not found");
      error.code = "NOT_FOUND";
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "attendance fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// add attendance record

router.post("/", validate(attendanceSchema), async (req, res, next) => {
  try {
    const { employee_id, attendance_date, check_in, check_out, status } =
      req.body;
    const [normalizedCheckIn, normalizedCheckOut] = normalizeAttendanceTimes(
      status,
      check_in,
      check_out,
    );

    const result = await pool.query(
      `INSERT INTO attendance
            (employee_id, attendance_date, check_in, check_out, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
      [
        employee_id,
        attendance_date,
        normalizedCheckIn,
        normalizedCheckOut,
        status,
      ],
    );

    res.status(201).json({
      success: true,
      message: "attendance created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// update attendance record

router.put("/:id", validate(attendanceSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      employee_id,
      attendance_date,
      check_in,
      check_out,
      status,
    } = req.body;
    const [normalizedCheckIn, normalizedCheckOut] = normalizeAttendanceTimes(
      status,
      check_in,
      check_out,
    );

    const result = await pool.query(
      `UPDATE attendance
            SET employee_id = $1,
                attendance_date = $2,
                check_in = $3,
                check_out = $4,
                status = $5
            WHERE id = $6
            RETURNING *`,
      [
        employee_id,
        attendance_date,
        normalizedCheckIn,
        normalizedCheckOut,
        status,
        id,
      ],
    );

    if (result.rows.length === 0) {
      const error = new Error("Attendance not found");
      error.code = "NOT_FOUND";
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// delete attendance record

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM attendance WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
