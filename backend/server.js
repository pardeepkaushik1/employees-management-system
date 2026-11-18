require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("Connected to the database");
  res.send("Connected to the database");
});

const departmentRoute = require("./routes/departmentRoute");
const employeeRoute = require("./routes/employeeRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const salaryRoute = require("./routes/salaryRoute");
const dashboardRoutes = require("./routes/dashboardRoute") ;
const errorHandler = require("./middleware/errorHandler");

app.use("/dashboard", dashboardRoutes);
app.use("/attendance", attendanceRoute);
app.use("/employee", employeeRoute);
app.use("/department", departmentRoute);
app.use("/salary", salaryRoute);

pool
  .connect()
  .then((client) => {
    console.log("PostgreSQL Connected Successfully!");
    client.release();
  })
  .catch((error) => {
    console.log("Database Connection Failed:", error.message);
  });

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
