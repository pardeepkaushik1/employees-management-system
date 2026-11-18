const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const validate = require("../middleware/validate");
const departmentSchema = require("../validators/departmentValidator");

//get all departments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM departments ORDER BY id ASC");
    res.status(200).json({
      success: true,
      message: "department records fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err.message });
  }
});

// get department by id

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM departments WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      const error = new Error("Employee not found");
      error.code = "NOT_FOUND";
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "department fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// add department

router.post("/", validate(departmentSchema), async (req, res, next) => {
  try {
    const { department_name } = req.body;

    const result = await pool.query(
      "INSERT INTO departments (department_name) VALUES ($1) RETURNING *",
      [department_name],
    );

    res.status(201).json({
      success: true,
      message: "department created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// update department name

router.put("/:id", validate(departmentSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name } = req.body;

    const result = await pool.query(
      "UPDATE departments SET department_name = $1 WHERE id = $2 RETURNING *",
      [department_name, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

   res.status(200).json({
  success: true,
  message: "Department updated successfully",
  data: result.rows[0]
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//delete department
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM departments WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

   res.status(200).json({
  success: true,
  message: "Department deleted successfully"
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
