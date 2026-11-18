const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const validate = require("../middleware/validate");
const employeeSchema = require("../validators/employeeValidator");

// get all employees

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT 
    employees.*,
    departments.department_name
  FROM employees 
  INNER JOIN departments
  ON employees.department_id = departments.id
  ORDER BY employees.id ASC
`);
    res.status(200).json({
      success: true,
      message: "Employees records fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});

// get employee by id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      const error = new Error("Employee not found");
      error.code = "NOT_FOUND";
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// add employee

router.post("/", validate(employeeSchema), async (req, res, next) => {
  try {
    const { name, email, phone, address, salary, department_id, joining_date } =
      req.body;

    const result = await pool.query(
      `INSERT INTO employees
            (name, email, phone, address, salary, department_id, joining_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
      [name, email, phone, address, salary, department_id, joining_date],
    );

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// update employee

router.put("/:id", validate(employeeSchema), async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, phone, address, salary, department_id, joining_date } =
      req.body;

    const result = await pool.query(
      `UPDATE employees
            SET name = $1,
                email = $2,
                phone = $3,
                address = $4,
                salary = $5,
                department_id = $6,
                joining_date = $7
            WHERE id = $8
            RETURNING *`,
      [name, email, phone, address, salary, department_id, joining_date, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// delete employee

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
