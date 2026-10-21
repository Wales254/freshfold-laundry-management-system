const express = require("express");
const pool = require("../db");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth");

const router = express.Router();

// Require login for every customer endpoint.
router.use(authenticateToken);

// GET all customers.
// Allowed: Admin, Manager, Cashier.
router.get(
  "/",
  authorizeRoles("admin", "manager", "cashier"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, phone, email, created_at
         FROM customers
         ORDER BY id DESC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Fetch customers failed:", error.message);
      res.status(500).json({
        message: "Failed to fetch customers.",
      });
    }
  }
);

// CREATE a customer.
// Allowed: Admin, Manager, Cashier.
router.post(
  "/",
  authorizeRoles("admin", "manager", "cashier"),
  async (req, res) => {
    try {
      const { name, phone, email } = req.body;

      if (!name || !String(name).trim()) {
        return res.status(400).json({
          message: "Customer name is required.",
        });
      }

      const result = await pool.query(
        `INSERT INTO customers (name, phone, email)
         VALUES ($1, $2, $3)
         RETURNING id, name, phone, email, created_at`,
        [
          String(name).trim(),
          phone ? String(phone).trim() : null,
          email ? String(email).trim() : null,
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Create customer failed:", error.message);
      res.status(500).json({
        message: "Failed to create customer.",
      });
    }
  }
);

// UPDATE a customer.
// Allowed: Admin, Manager, Cashier.
router.put(
  "/:id",
  authorizeRoles("admin", "manager", "cashier"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone, email } = req.body;

      if (!name || !String(name).trim()) {
        return res.status(400).json({
          message: "Customer name is required.",
        });
      }

      const result = await pool.query(
        `UPDATE customers
         SET name = $1, phone = $2, email = $3
         WHERE id = $4
         RETURNING id, name, phone, email, created_at`,
        [
          String(name).trim(),
          phone ? String(phone).trim() : null,
          email ? String(email).trim() : null,
          id,
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          message: "Customer not found.",
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Update customer failed:", error.message);
      res.status(500).json({
        message: "Failed to update customer.",
      });
    }
  }
);

// DELETE a customer.
// Allowed: Admin, Manager.
router.delete(
  "/:id",
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const result = await pool.query(
        "DELETE FROM customers WHERE id = $1 RETURNING id",
        [req.params.id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          message: "Customer not found.",
        });
      }

      res.json({
        message: "Customer deleted successfully.",
      });
    } catch (error) {
      console.error("Delete customer failed:", error.message);
      res.status(500).json({
        message:
          "Failed to delete customer. They may be linked to existing orders.",
      });
    }
  }
);

module.exports = router;