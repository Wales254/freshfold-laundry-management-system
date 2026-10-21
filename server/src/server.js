require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");
const ordersRouter = require("./routes/orders");
const customersRouter = require("./routes/customers");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const settingsRouter = require("./routes/settings");
const accountRouter = require("./routes/account");

const app = express();

app.use(cors());
app.use(express.json({ limit: "3mb" }));

app.get("/", (req, res) => {
  res.json({ message: "FreshFold backend is running." });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database() AS database"
    );

    res.json({
      status: "ok",
      database: result.rows[0].database,
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);
    res.status(500).json({
      status: "error",
      message: "Database connection failed.",
    });
  }
});

app.use("/api/orders", ordersRouter);
app.use("/api/customers", customersRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/account", accountRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FreshFold backend running on port ${PORT}`);
});