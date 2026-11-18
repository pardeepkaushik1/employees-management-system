const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const validate = require("../middleware/validate");
const salarySchema = require("../validators/salaryValidator");

// get all salary records

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         s.id,
         s.employee_id,
         s.amount,
         s.salary_month,
         s.payment_date,
         s.payment_status,
         e.name
       FROM salaries s
       JOIN employees e ON s.employee_id = e.id
       ORDER BY s.employee_id ASC, s.salary_month DESC`,
    );
    res.status(200).json({
      success: true,
      message: "salary records fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});

// get salary record by id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM salaries WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      const error = new Error("Employee not found");
      error.code = "NOT_FOUND";
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "salary fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// add salary record

router.post("/", validate(salarySchema), async (req, res, next) => {
  try {
    const {
      employee_id,
      amount,
      salary_month,
      payment_date,
      payment_status = "Pending",
    } = req.body;

    const result = await pool.query(
      `INSERT INTO salaries
            (employee_id, amount, salary_month, payment_date, payment_status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
      [employee_id, amount, salary_month, payment_date, payment_status],
    );

    res.status(201).json({
      success: true,
      message: "salary created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// update salary record

router.put("/:id", validate(salarySchema), async (req, res, next) => {
  try {
    const {
      employee_id,
      amount,
      salary_month,
      payment_date,
      payment_status,
    } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE salaries
       SET employee_id = $1,
           amount = $2,
           salary_month = $3,
           payment_date = $4,
           payment_status = $5
       WHERE id = $6
       RETURNING *`,
      [employee_id, amount, salary_month, payment_date, payment_status, id],
    );

    if (result.rows.length === 0) {
      const error = new Error("Salary not found");
      error.code = "NOT_FOUND";
      return next(error);
    }

   res.status(200).json({
  success: true,
  message: "salary updated successfully",
  data: result.rows[0]
});
  } catch (error) {
    next(error);
  }
});

// delete salary record

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM salaries WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Salary not found" });
    }

   res.status(200).json({
  success: true,
  message: "Salary deleted successfully"
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
