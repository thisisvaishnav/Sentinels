require("dotenv").config();
const express = require("express");

const citizenAuthRoutes = require("./routes/citizenAuth");
const enumeratorAuthRoutes = require("./routes/enumeratorAuth");
const enumeratorTaskRoutes = require("./routes/enumeratorTasks");
const citizenHouseholdRoutes = require("./routes/citizenHousehold");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ApiTesting server is running" });
});

app.use("/api/auth", citizenAuthRoutes);
app.use("/api/auth", enumeratorAuthRoutes);
app.use("/api/enumerator", enumeratorTaskRoutes);
app.use("/api/citizen", citizenHouseholdRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Unexpected server error" });
});

module.exports = app;