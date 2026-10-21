
const express = require("express");
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

// GET /api/settings/business
router.get("/business", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, phone, email, website, address, updated_at
       FROM business_settings
       WHERE id = 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Business settings have not been configured.",
      });
    }

    return res.json({ business: result.rows[0] });
  } catch (error) {
    console.error("Failed to load business settings:", error.message);

    return res.status(500).json({
      message: "Unable to load business settings.",
    });
  }
});

// PUT /api/settings/business
router.put("/business", async (req, res) => {
  const { name, phone, email, website, address } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      message: "Business name is required.",
    });
  }

  if (
    typeof phone !== "string" ||
    typeof email !== "string" ||
    typeof website !== "string" ||
    typeof address !== "string"
  ) {
    return res.status(400).json({
      message: "All business fields must be valid text values.",
    });
  }

  if (
    email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      message: "Enter a valid email address.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO business_settings
         (id, name, phone, email, website, address, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         website = EXCLUDED.website,
         address = EXCLUDED.address,
         updated_at = NOW()
       RETURNING id, name, phone, email, website, address, updated_at`,
      [
        name.trim(),
        phone.trim(),
        email.trim(),
        website.trim(),
        address.trim(),
      ]
    );

    return res.json({
      message: "Business settings saved successfully.",
      business: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to save business settings:", error.message);

    return res.status(500).json({
      message: "Unable to save business settings.",
    });
  }
});

module.exports = router;
