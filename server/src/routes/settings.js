
const express = require("express");
const pool = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateToken);

// ==========================================
// BUSINESS SETTINGS
// ==========================================

// GET /api/settings/business
router.get("/business", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id, name, phone, email, website,
         address, logo_data, updated_at
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
  const { name, phone, email, website, address, logoData } = req.body;

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

  if (
    logoData !== undefined &&
    logoData !== null &&
    logoData !== "" &&
    (
      typeof logoData !== "string" ||
      !/^data:image\/(png|jpeg|webp|gif);base64,/.test(logoData) ||
      logoData.length > 2_500_000
    )
  ) {
    return res.status(400).json({
      message: "Invalid logo image or image is too large.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO business_settings
         (id, name, phone, email, website, address, logo_data, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         website = EXCLUDED.website,
         address = EXCLUDED.address,
         logo_data = COALESCE(
           EXCLUDED.logo_data,
           business_settings.logo_data
         ),
         updated_at = NOW()
       RETURNING
         id, name, phone, email, website,
         address, logo_data, updated_at`,
      [
        name.trim(),
        phone.trim(),
        email.trim(),
        website.trim(),
        address.trim(),
        logoData || null,
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

// ==========================================
// RECEIPT SETTINGS
// ==========================================

// GET /api/settings/receipt
router.get("/receipt", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         prefix,
         currency,
         footer,
         show_logo AS "showLogo",
         auto_print AS "autoPrint",
         updated_at
       FROM public.receipt_settings
       WHERE id = 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Receipt settings have not been configured.",
      });
    }

    return res.json({ settings: result.rows[0] });
  } catch (error) {
    console.error("Failed to load receipt settings:", error.message);
    return res.status(500).json({
      message: "Unable to load receipt settings.",
    });
  }
});

// PUT /api/settings/receipt
router.put("/receipt", async (req, res) => {
  const { prefix, currency, footer, showLogo, autoPrint } = req.body;

  if (
    typeof prefix !== "string" ||
    !prefix.trim() ||
    prefix.trim().length > 20
  ) {
    return res.status(400).json({
      message: "Receipt prefix is required and must not exceed 20 characters.",
    });
  }

  if (
    !["KES", "USD", "EUR", "GBP"].includes(currency)
  ) {
    return res.status(400).json({
      message: "Please select a supported currency.",
    });
  }

  if (typeof footer !== "string" || footer.length > 1000) {
    return res.status(400).json({
      message: "Receipt footer must be valid text of at most 1000 characters.",
    });
  }

  if (
    typeof showLogo !== "boolean" ||
    typeof autoPrint !== "boolean"
  ) {
    return res.status(400).json({
      message: "Receipt display and printing options must be true or false.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.receipt_settings
         (id, prefix, currency, footer, show_logo, auto_print, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         prefix = EXCLUDED.prefix,
         currency = EXCLUDED.currency,
         footer = EXCLUDED.footer,
         show_logo = EXCLUDED.show_logo,
         auto_print = EXCLUDED.auto_print,
         updated_at = NOW()
       RETURNING
         id,
         prefix,
         currency,
         footer,
         show_logo AS "showLogo",
         auto_print AS "autoPrint",
         updated_at`,
      [
        prefix.trim(),
        currency,
        footer,
        showLogo,
        autoPrint,
      ]
    );

    return res.json({
      message: "Receipt settings saved successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to save receipt settings:", error.message);
    return res.status(500).json({
      message: "Unable to save receipt settings.",
    });
  }
});

module.exports = router;
