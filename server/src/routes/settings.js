
const express = require("express");
const pool = require("../db");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth");

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
       FROM public.business_settings
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
      `INSERT INTO public.business_settings
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

  if (!["KES", "USD", "EUR", "GBP"].includes(currency)) {
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
      [prefix.trim(), currency, footer, showLogo, autoPrint]
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

// ==========================================
// APPEARANCE SETTINGS
// ==========================================

// GET /api/settings/appearance
router.get("/appearance", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        theme,
        primary_color AS "primaryColor",
        layout,
        font_size AS "fontSize",
        language,
        updated_at
      FROM public.appearance_settings
      WHERE id = 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Appearance settings not found.",
      });
    }

    return res.json({ settings: result.rows[0] });
  } catch (error) {
    console.error("Get appearance settings error:", error.message);
    return res.status(500).json({
      message: "Failed to load appearance settings.",
    });
  }
});

// PUT /api/settings/appearance
router.put("/appearance", async (req, res) => {
  try {
    const {
      theme,
      primaryColor,
      layout,
      fontSize,
      language,
    } = req.body;

    const validThemes = ["Light", "Dark", "System"];
    const validColors = ["Blue", "Green", "Purple", "Orange", "Red"];
    const validLayouts = ["Comfortable", "Compact"];
    const validFontSizes = ["Small", "Medium", "Large"];
    const validLanguages = ["English", "Swahili", "French"];

    if (
      !validThemes.includes(theme) ||
      !validColors.includes(primaryColor) ||
      !validLayouts.includes(layout) ||
      !validFontSizes.includes(fontSize) ||
      !validLanguages.includes(language)
    ) {
      return res.status(400).json({
        message: "Please provide valid appearance settings.",
      });
    }

    const result = await pool.query(
      `INSERT INTO public.appearance_settings (
         id, theme, primary_color, layout, font_size, language, updated_at
       )
       VALUES (1, $1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         theme = EXCLUDED.theme,
         primary_color = EXCLUDED.primary_color,
         layout = EXCLUDED.layout,
         font_size = EXCLUDED.font_size,
         language = EXCLUDED.language,
         updated_at = NOW()
       RETURNING
         theme,
         primary_color AS "primaryColor",
         layout,
         font_size AS "fontSize",
         language,
         updated_at`,
      [theme, primaryColor, layout, fontSize, language]
    );

    return res.json({
      message: "Appearance settings saved successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Save appearance settings error:", error.message);
    return res.status(500).json({
      message: "Failed to save appearance settings.",
    });
  }
});

// ==========================================
// NOTIFICATION SETTINGS
// ==========================================

// GET /api/settings/notifications
router.get("/notifications", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sms_ready AS "smsReady",
        sms_payment AS "smsPayment",
        sms_reminder AS "smsReminder",
        email_receipt AS "emailReceipt",
        email_promotion AS "emailPromotion",
        low_stock_alert AS "lowStockAlert",
        daily_sales_report AS "dailySalesReport",
        updated_at AS "updatedAt"
      FROM public.notification_settings
      WHERE id = 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Notification settings have not been initialized.",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get notification settings error:", error.message);
    return res.status(500).json({
      message: "Failed to load notification settings.",
    });
  }
});

// PUT /api/settings/notifications
router.put("/notifications", async (req, res) => {
  try {
    const {
      smsReady,
      smsPayment,
      smsReminder,
      emailReceipt,
      emailPromotion,
      lowStockAlert,
      dailySalesReport,
    } = req.body;

    const settings = {
      smsReady,
      smsPayment,
      smsReminder,
      emailReceipt,
      emailPromotion,
      lowStockAlert,
      dailySalesReport,
    };

    for (const [key, value] of Object.entries(settings)) {
      if (typeof value !== "boolean") {
        return res.status(400).json({
          message: `Invalid value for ${key}. Each setting must be true or false.`,
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO public.notification_settings (
         id, sms_ready, sms_payment, sms_reminder,
         email_receipt, email_promotion, low_stock_alert,
         daily_sales_report, updated_at
       )
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         sms_ready = EXCLUDED.sms_ready,
         sms_payment = EXCLUDED.sms_payment,
         sms_reminder = EXCLUDED.sms_reminder,
         email_receipt = EXCLUDED.email_receipt,
         email_promotion = EXCLUDED.email_promotion,
         low_stock_alert = EXCLUDED.low_stock_alert,
         daily_sales_report = EXCLUDED.daily_sales_report,
         updated_at = NOW()
       RETURNING
         sms_ready AS "smsReady",
         sms_payment AS "smsPayment",
         sms_reminder AS "smsReminder",
         email_receipt AS "emailReceipt",
         email_promotion AS "emailPromotion",
         low_stock_alert AS "lowStockAlert",
         daily_sales_report AS "dailySalesReport",
         updated_at AS "updatedAt"`,
      [
        smsReady,
        smsPayment,
        smsReminder,
        emailReceipt,
        emailPromotion,
        lowStockAlert,
        dailySalesReport,
      ]
    );

    return res.status(200).json({
      message: "Notification settings saved successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Save notification settings error:", error.message);
    return res.status(500).json({
      message: "Failed to save notification settings.",
    });
  }
});

// ==========================================
// BACKUP SETTINGS
// ==========================================

const backupAdminOnly = authorizeRoles("admin");

// GET /api/settings/backup
router.get("/backup", backupAdminOnly, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        auto_backup AS "autoBackup",
        frequency,
        last_backup_at AS "lastBackupAt",
        updated_at AS "updatedAt"
      FROM public.backup_settings
      WHERE id = 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Backup settings have not been initialized.",
      });
    }

    return res.json({ settings: result.rows[0] });
  } catch (error) {
    console.error("Load backup settings error:", error.message);
    return res.status(500).json({
      message: "Unable to load backup settings.",
    });
  }
});

// PUT /api/settings/backup
router.put("/backup", backupAdminOnly, async (req, res) => {
  const { autoBackup, frequency } = req.body;

  if (typeof autoBackup !== "boolean") {
    return res.status(400).json({
      message: "Automatic backup must be true or false.",
    });
  }

  if (!["Daily", "Weekly", "Monthly"].includes(frequency)) {
    return res.status(400).json({
      message: "Select a valid backup frequency.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO public.backup_settings (
         id, auto_backup, frequency, updated_at
       )
       VALUES (1, $1, $2, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         auto_backup = EXCLUDED.auto_backup,
         frequency = EXCLUDED.frequency,
         updated_at = NOW()
       RETURNING
         auto_backup AS "autoBackup",
         frequency,
         last_backup_at AS "lastBackupAt",
         updated_at AS "updatedAt"`,
      [autoBackup, frequency]
    );

    return res.json({
      message: "Backup settings saved successfully.",
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("Save backup settings error:", error.message);
    return res.status(500).json({
      message: "Unable to save backup settings.",
    });
  }
});

// GET /api/settings/backup/download
// This creates a JSON data export, not a full PostgreSQL schema backup.
router.get(
  "/backup/download",
  backupAdminOnly,
  async (req, res) => {
    const client = await pool.connect();
    let transactionOpen = false;

    try {
      await client.query(
        "BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY"
      );
      transactionOpen = true;

      const tables = [
        "appearance_settings",
        "audit_logs",
        "backup_settings",
        "business_settings",
        "customers",
        "notification_settings",
        "order_items",
        "orders",
        "payments",
        "receipt_settings",
        "users",
      ];

      const backup = {
        application: "FreshFold Laundry Management System",
        backupType: "JSON data export",
        createdAt: new Date().toISOString(),
        lastBackupAt: null,
        tables: {},
      };

      for (const table of tables) {
        const result = await client.query(
          `SELECT * FROM public."${table}"`
        );

        backup.tables[table] = result.rows;
      }

      // Do not expose password hashes in a downloaded data export.
      backup.tables.users = backup.tables.users.map((user) => {
        const { password_hash, ...safeUser } = user;
        return safeUser;
      });

      await client.query("COMMIT");
      transactionOpen = false;

      // Record completion only after all table queries have succeeded.
      const timestampResult = await pool.query(`
        UPDATE public.backup_settings
        SET last_backup_at = NOW(),
            updated_at = NOW()
        WHERE id = 1
        RETURNING last_backup_at AS "lastBackupAt"
      `);

      if (timestampResult.rows.length === 0) {
        throw new Error("Backup settings record was not found.");
      }

      backup.lastBackupAt = timestampResult.rows[0].lastBackupAt;

      const settingsResult = await pool.query(
        "SELECT * FROM public.backup_settings WHERE id = 1"
      );

      backup.tables.backup_settings = settingsResult.rows;

      const filename = `freshfold-backup-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`;

      res.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Cache-Control", "no-store");

      return res.status(200).send(JSON.stringify(backup, null, 2));
    } catch (error) {
      if (transactionOpen) {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackError) {
          console.error("Backup rollback error:", rollbackError.message);
        }
      }

      console.error("Create backup export error:", error.message);

      if (!res.headersSent) {
        return res.status(500).json({
          message: "Unable to create a database data export.",
        });
      }
    } finally {
      client.release();
    }
  }
);

module.exports = router;
